const CLAVE_APP = 'https://carlangatrex.github.io/app_bienestar/';

function origenesPermitidos(env) {
    return (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function cabecerasCors(env, req) {
    const origen = req.headers.get('Origin') || '';
    const permitido = origenesPermitidos(env).includes(origen);
    return {
        'Access-Control-Allow-Origin': permitido ? origen : 'null',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
    };
}

function json(env, req, data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...cabecerasCors(env, req) }
    });
}

function b64url(bytes) {
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deB64url(texto) {
    const padding = '='.repeat((4 - (texto.length % 4)) % 4);
    const base64 = (texto + padding).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

async function firmarVapid(env, audiencia) {
    const clave = await crypto.subtle.importKey(
        'pkcs8',
        deB64url(env.VAPID_PRIVATE_KEY),
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['sign']
    );
    const ahora = Math.floor(Date.now() / 1000);
    const enc = (obj) => new TextEncoder().encode(JSON.stringify(obj));
    const header = b64url(enc({ typ: 'JWT', alg: 'ES256' }));
    const claims = b64url(enc({
        aud: audiencia,
        exp: ahora + 12 * 3600,
        sub: 'mailto:' + (env.VAPID_EMAIL || 'admin@example.com')
    }));
    const jwt = header + '.' + claims;
    const firma = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, clave, enc(jwt));
    return jwt + '.' + b64url(new Uint8Array(firma));
}

async function enviarPush(env, endpoint) {
    const jwt = await firmarVapid(env, new URL(endpoint).origin);
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': 'vapid t=' + jwt + ', k=' + env.VAPID_PUBLIC_KEY,
            'TTL': '86400',
            'Content-Length': '0',
            'Urgency': 'normal'
        }
    });
    return res.status;
}

function textoMensaje(horaLocal) {
    const h = parseInt(String(horaLocal).slice(0, 2), 10);
    if (h < 12) return { title: 'Pausa Breve', body: 'Buenos días. ¿Cómo te sientes hoy?' };
    if (h < 18) return { title: 'Pausa Breve', body: '¿Cómo te sientes hoy?' };
    return { title: 'Pausa Breve', body: 'Antes de cerrar el día: ¿cómo te sientes?' };
}

function horaLocalEn(tz, fecha) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    return fmt.format(fecha);
}

function diaLocalEn(tz, fecha) {
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    return fmt.format(fecha);
}

export default {
    async fetch(req, env) {
        const url = new URL(req.url);
        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cabecerasCors(env, req) });
        }

        if (req.method === 'POST' && url.pathname === '/subscribe') {
            try {
                const { subscription, time, tz } = await req.json();
                if (!subscription || !subscription.endpoint || !/^\d{2}:\d{2}$/.test(time || '')) {
                    return json(env, req, { error: 'datos inválidos' }, 400);
                }
                await env.REMINDERS.put(subscription.endpoint, JSON.stringify({
                    endpoint: subscription.endpoint,
                    time,
                    tz: tz || 'UTC',
                    creado: Date.now()
                }));
                return json(env, req, { ok: true });
            } catch (e) {
                return json(env, req, { error: 'no se pudo guardar' }, 500);
            }
        }

        if (req.method === 'POST' && url.pathname === '/unsubscribe') {
            try {
                const { endpoint } = await req.json();
                if (endpoint) await env.REMINDERS.delete(endpoint);
                return json(env, req, { ok: true });
            } catch (e) {
                return json(env, req, { error: 'no se pudo borrar' }, 500);
            }
        }

        if (req.method === 'POST' && url.pathname === '/test') {
            try {
                const { endpoint } = await req.json();
                if (!endpoint) return json(env, req, { error: 'falta endpoint' }, 400);
                const rec = await env.REMINDERS.get(endpoint, 'json');
                const texto = textoMensaje(rec ? rec.time : '08:00');
                const status = await enviarPush(env, endpoint);
                return json(env, req, { ok: status < 300, status, ...texto });
            } catch (e) {
                return json(env, req, { error: 'no se pudo enviar' }, 500);
            }
        }

        if (req.method === 'GET' && url.pathname === '/message') {
            const endpoint = url.searchParams.get('k');
            const rec = endpoint ? await env.REMINDERS.get(endpoint, 'json') : null;
            const texto = textoMensaje(rec ? rec.time : '08:00');
            return json(env, req, { ...texto, url: CLAVE_APP + '?from=notification' });
        }

        return json(env, req, { error: 'no encontrado' }, 404);
    },

    async scheduled(event, env, ctx) {
        ctx.waitUntil(enviarRecordatorios(env));
    }
};

async function enviarRecordatorios(env) {
    const ahora = new Date();
    const list = await env.REMINDERS.list();
    for (const item of list.keys) {
        const rec = await env.REMINDERS.get(item.name, 'json');
        if (!rec || !rec.time || !rec.tz) continue;
        let hhmm, hoy;
        try {
            hhmm = horaLocalEn(rec.tz, ahora);
            hoy = diaLocalEn(rec.tz, ahora);
        } catch (e) {
            continue;
        }
        const [ah, am] = hhmm.split(':').map(Number);
        const [eh, em] = rec.time.split(':').map(Number);
        const actualMin = (ah % 24) * 60 + am;
        const elegidoMin = (eh || 0) * 60 + (em || 0);
        if (actualMin < elegidoMin || actualMin >= elegidoMin + 15) continue;
        if (rec.lastSent === hoy) continue;
        try {
            const status = await enviarPush(env, rec.endpoint);
            if (status === 404 || status === 410) {
                await env.REMINDERS.delete(rec.endpoint);
            } else if (status < 300) {
                rec.lastSent = hoy;
                await env.REMINDERS.put(rec.endpoint, JSON.stringify(rec));
            }
        } catch (e) {
            // sigue con el siguiente recordatorio
        }
    }
}
