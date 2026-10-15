// Genera un par de llaves VAPID (sin dependencias) con Node 18+.
// Uso: node worker/gen-keys.mjs
// Copia las dos salidas a los secrets del Worker:
//   npx wrangler secret put VAPID_PUBLIC_KEY
//   npx wrangler secret put VAPID_PRIVATE_KEY

function b64url(bytes) {
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const par = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
);
const publica = new Uint8Array(await crypto.subtle.exportKey('spki', par.publicKey));
const privada = new Uint8Array(await crypto.subtle.exportKey('pkcs8', par.privateKey));

console.log('VAPID_PUBLIC_KEY=' + b64url(publica));
console.log('VAPID_PRIVATE_KEY=' + b64url(privada));
