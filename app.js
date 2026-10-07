// Pausa Breve - Autorregulación
// Configuraciones de ejercicios, gráficos SVG dinámicos, guía de fases, temporizadores y música

const exercises = {
    pecho: {
        title: "Suspiro Cíclico",
        duration: 60,
        instruction: "Inhala hondo por la nariz en 2 tiempos cortos (sin soltar el aire entre inhalaciones) y exhala muy despacio por la boca en 6 tiempos.",
        closing: "Dios no te dio un espíritu de temor, sino de poder, amor y dominio propio. Su paz guarda tu corazón en este instante.",
        fases: [
            { dur: 2, texto: "Inhala profundo...", color: "f-verde" },
            { dur: 1, texto: "Inhala un poco más...", color: "f-cian" },
            { dur: 5, texto: "Exhala despacio por la boca...", color: "f-violeta" }
        ],
        svg: `<svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true">
            <defs>
                <linearGradient id="lungGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.65"/>
                </linearGradient>
                <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
                    <stop offset="60%" stop-color="#10b981" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <g class="anatomy-head">
                <ellipse cx="100" cy="40" rx="24" ry="27"/>
                <path d="M88,64 L86,80"/>
                <path d="M112,64 L114,80"/>
            </g>
            <g class="anatomy-breath">
                <path class="torso" d="M86,80 C70,86 58,100 56,122 C54,146 58,172 63,192 C66,204 74,212 86,212 L114,212 C126,212 134,204 137,192 C142,172 146,146 144,122 C142,100 130,86 114,80 Z"/>
                <g class="lungs">
                    <path class="lung lung-l" d="M94,106 C80,108 70,122 70,142 C70,160 78,172 88,172 C95,172 97,162 96,148 C95,132 98,114 94,106 Z"/>
                    <path class="lung lung-r" d="M106,106 C120,108 130,122 130,142 C130,160 122,172 112,172 C105,172 103,162 104,148 C105,132 102,114 106,106 Z"/>
                    <path class="airway" d="M100,86 L100,106 M100,110 C96,112 94,114 93,117 M100,110 C104,112 106,114 107,117"/>
                </g>
                <circle class="energy-core" cx="100" cy="140" r="16"/>
            </g>
            <g class="pulse-wave">
                <path d="M-60,146 q10,-12 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0"/>
            </g>
        </svg>`
    },
    rabia: {
        title: "Empuje Isométrico",
        duration: 45,
        instruction: "Empuja una pared firme con ambas manos usando tu máxima fuerza constante. Mantén la presión y suelta el aire de golpe al terminar.",
        closing: "Entrega tu frustración. Dios es tu refugio y tu fuerza en los momentos de prueba; no tienes que sostener todo solo.",
        fases: [
            { dur: 5, texto: "Tensa todo el cuerpo...", color: "f-rojo" },
            { dur: 5, texto: "Suelta y libera la tensión...", color: "f-verde" }
        ],
        svg: `<svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true">
            <defs>
                <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.85"/>
                    <stop offset="60%" stop-color="#fb923c" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#fb923c" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <g class="rabia-ciclo">
                <ellipse class="rb-head" cx="100" cy="42" rx="24" ry="27"/>
                <path class="rb-neck" d="M88,66 L86,82"/>
                <path class="rb-neck" d="M112,66 L114,82"/>
                <path class="rb-torso" d="M86,82 C70,88 58,102 56,124 C54,148 58,174 63,194 C66,206 74,214 86,214 L114,214 C126,214 134,206 137,194 C142,174 146,148 144,124 C142,102 130,88 114,82 Z"/>
                <g class="rb-vibra">
                    <circle class="rb-orb" cx="100" cy="152" r="36"/>
                    <path class="rb-lineas" d="M42,112 L26,105 M40,142 L22,142 M42,172 L26,179 M158,112 L174,105 M160,142 L178,142 M158,172 L174,179 M72,44 L62,30 M128,44 L138,30"/>
                </g>
            </g>
        </svg>`
    },
    exhausted: {
        title: "Descanso Ocular 20/20",
        duration: 60,
        instruction: "Desvía la mirada de la pantalla. Enfoca un punto lejano por la ventana o al fondo de la habitación, suelta los hombros y afloja la mandíbula.",
        closing: "Los que confían en el Señor renuevan sus fuerzas. Pausar un minuto es un acto de fe y descanso en Su cuidado.",
        fases: [
            { dur: 10, texto: "Mira 5 cosas a tu alrededor...", color: "f-cian" },
            { dur: 10, texto: "Escucha 4 sonidos distintos...", color: "f-azul" },
            { dur: 10, texto: "Siente 3 texturas con las manos...", color: "f-verde" }
        ],
        svg: `<svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true">
            <g class="ondas">
                <circle class="onda o1" cx="100" cy="136" r="26"/>
                <circle class="onda o2" cx="100" cy="136" r="26"/>
                <circle class="onda o3" cx="100" cy="136" r="26"/>
            </g>
            <g class="ground-core">
                <ellipse cx="100" cy="66" rx="22" ry="25"/>
                <path d="M84,90 C70,96 62,110 62,126 C62,142 70,154 82,158 L118,158 C130,154 138,142 138,126 C138,110 130,96 116,90 Z"/>
                <circle class="ground-punto" cx="100" cy="126" r="11"/>
            </g>
        </svg>`
    },
    nudo: {
        title: "Contacto Somático",
        duration: 60,
        instruction: "Coloca tu mano derecha en el centro del pecho ejerciendo una presión suave pero constante. Toma respiraciones profundas sintiendo el calor de tu mano.",
        closing: "Cerca está el Señor de los que tienen el corazón afligido. Estás acompañado y seguro en sus manos.",
        fases: [
            { dur: 4, texto: "Coloca tu mano en el pecho...", color: "f-cian" },
            { dur: 4, texto: "Siente tu mano y su calor...", color: "f-calido" },
            { dur: 4, texto: "Nota tus latidos y respira...", color: "f-verde" }
        ],
        svg: `<svg viewBox="0 0 200 240" width="100%" height="100%" aria-hidden="true">
            <defs>
                <linearGradient id="corGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#67e8f9"/>
                    <stop offset="100%" stop-color="#fbbf24"/>
                </linearGradient>
                <radialGradient id="calorGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <g class="nudo-ciclo">
                <ellipse class="nd-head" cx="100" cy="42" rx="24" ry="27"/>
                <path class="nd-neck" d="M88,66 L86,82"/>
                <path class="nd-neck" d="M112,66 L114,82"/>
                <path class="nd-torso" d="M86,82 C70,88 58,102 56,124 C54,148 58,174 63,194 C66,206 74,214 86,214 L114,214 C126,214 134,206 137,194 C142,174 146,148 144,124 C142,102 130,88 114,82 Z"/>
                <circle class="nd-calor" cx="100" cy="148" r="34"/>
                <path class="nd-corazon" d="M100,178 C78,162 68,148 68,134 C68,122 76,115 85,115 C91,115 96,119 100,125 C104,119 109,115 115,115 C124,115 132,122 132,134 C132,148 122,162 100,178 Z"/>
                <path class="nd-pulso" d="M-60,150 q10,-10 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0"/>
            </g>
        </svg>`
    }
};

let currentKey = null;
let totalSeconds = 60;
let remainingSeconds = 60;
let timerInterval = null;
let isRunning = false;
let inicioReciente = 0;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function cargarFigura(data) {
    const cont = document.getElementById('figura-svg');
    if (cont) cont.innerHTML = data.svg;
}

function selectSymptom(key) {
    currentKey = key;
    const data = exercises[key];
    totalSeconds = data.duration;
    remainingSeconds = data.duration;

    document.getElementById('exercise-name').textContent = data.title;
    document.getElementById('exercise-instruction').textContent = data.instruction;
    document.getElementById('closing-text').textContent = `"${data.closing}"`;

    cargarFigura(data);
    updateTimerDisplay();
    setBreathing(false);
    stopGuia();

    // Reset del activador SVG (figura): texto visible + aria de inicio
    const hint = document.getElementById('svg-hint');
    if (hint) hint.style.display = '';
    const cont = document.getElementById('figura-svg');
    if (cont) cont.setAttribute('aria-label', 'Iniciar ejercicio de respiración');

    document.getElementById('btn-cancel').textContent = 'Cancelar';

    showScreen('screen-exercise');
}

function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTimerDisplay() {
    document.getElementById('timer-number').textContent = formatTime(remainingSeconds);
}

function setBreathing(active) {
    const fig = document.querySelector('.timer-display');
    if (fig) fig.classList.toggle('animating', active);
    const box = document.querySelector('.instruction-box');
    if (box) box.classList.toggle('running', active);
}

// ===== Guía dinámica por fases (ciclo definido en exercises[key].fases) =====
let guiaTimer = null;
let guiaSwapTimer = null;
let guiaSecond = 0;

function cicloTotal(ej) {
    return ej.fases.reduce((suma, f) => suma + f.dur, 0);
}

function faseDe(ej, seg) {
    let acc = 0;
    for (const f of ej.fases) {
        acc += f.dur;
        if (seg < acc) return f;
    }
    return ej.fases[ej.fases.length - 1];
}

function aplicarFaseGuia() {
    const ej = exercises[currentKey];
    const guia = document.getElementById('guia-respiracion');
    if (!ej || !guia) return;
    const f = faseDe(ej, guiaSecond);
    if (guia.textContent === f.texto) return;
    guia.classList.remove('visible'); // fade-out 300ms
    clearTimeout(guiaSwapTimer);
    guiaSwapTimer = setTimeout(() => {
        guia.textContent = f.texto;
        guia.className = 'guia-respiracion ' + f.color;
        guia.classList.add('visible'); // fade-in 300ms
    }, 300);
}

function startGuia() {
    stopGuia();
    if (!exercises[currentKey]) return;
    guiaSecond = 0;
    aplicarFaseGuia();
    const total = cicloTotal(exercises[currentKey]);
    guiaTimer = setInterval(() => {
        guiaSecond = (guiaSecond + 1) % total;
        aplicarFaseGuia();
    }, 1000);
}

function stopGuia() {
    clearInterval(guiaTimer);
    guiaTimer = null;
    clearTimeout(guiaSwapTimer);
    const guia = document.getElementById('guia-respiracion');
    if (guia) {
        guia.textContent = '';
        guia.className = 'guia-respiracion';
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    inicioReciente = Date.now();
    startMusic();
    setBreathing(true);
    startGuia();

    // El toque en la figura oculta el texto y cambia la etiqueta a "finalizar"
    const hint = document.getElementById('svg-hint');
    if (hint) hint.style.display = 'none';
    const cont = document.getElementById('figura-svg');
    if (cont) cont.setAttribute('aria-label', 'Finalizar ejercicio');

    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();

        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            finishExercise();
        }
    }, 1000);
}

function finishExercise() {
    // Ignora el click sintético que sigue al pointerdown de la figura en móviles
    if (isRunning && Date.now() - inicioReciente < 700) return;
    clearInterval(timerInterval);
    isRunning = false;
    setBreathing(false);
    stopGuia();
    stopMusic();
    showScreen('screen-closing');
}

function repeatExercise() {
    if (currentKey) {
        selectSymptom(currentKey);
    }
}

function resetToHome() {
    clearInterval(timerInterval);
    isRunning = false;
    currentKey = null;
    setBreathing(false);
    stopGuia();
    stopMusic();
    showScreen('screen-home');
}

if ('serviceWorker' in navigator) {
    // Si una versión nueva del SW toma el control, recarga para mostrarla
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Recarga solo desde el inicio: nunca interrumpe un ejercicio en curso
        if (hadController) {
            const activa = document.querySelector('.screen.active');
            if (!activa || activa.id === 'screen-home') window.location.reload();
        }
        hadController = true;
    });
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('PWA lista y Service Worker registrado.'))
            .catch((err) => console.log('Error al registrar Service Worker:', err));
    });
}

// ===== Activación de botones: pointerdown inmediato + click con preventDefault, sin duplicar =====
function enlazar(el, accion) {
    if (!el) return;
    let ultimoPointer = 0;
    el.addEventListener('pointerdown', () => {
        ultimoPointer = Date.now();
        accion();
    });
    el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (Date.now() - ultimoPointer < 700) return; // ya ejecutado por pointerdown
        accion();
    });
}

document.querySelectorAll('.symptom-btn[data-accent]').forEach((btn) => {
    enlazar(btn, () => selectSymptom(btn.dataset.accent));
});
// ===== Activador principal: la figura SVG (tocar o Enter/Espacio alterna iniciar/finalizar) =====
function alternarEjercicio() {
    if (isRunning) finishExercise(); else startTimer();
}

const figuraSvg = document.getElementById('figura-svg');
enlazar(figuraSvg, alternarEjercicio);
if (figuraSvg) {
    figuraSvg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // evita el scroll de la página con Espacio
            alternarEjercicio();
        }
    });
}
enlazar(document.getElementById('btn-cancel'), resetToHome);
enlazar(document.querySelector('#screen-closing .btn-main'), repeatExercise);
enlazar(document.querySelector('#screen-closing .nav-btn-secondary'), resetToHome);

// Audio control
const audioBtn = document.getElementById('audioBtn');
const bgMusic = document.getElementById('bg-music');
let isMuted = false;
if (audioBtn) {
    enlazar(audioBtn, () => {
        isMuted = !isMuted;
        if (bgMusic) bgMusic.muted = isMuted;
    });
}

if (bgMusic) {
    bgMusic.addEventListener('error', () => {
        console.warn('No se pudo cargar tu_archivo_relajante.mp3. La app sigue funcionando en silencio.');
    });
}

function startMusic() {
    if (!bgMusic) return;
    bgMusic.muted = false;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(e => console.error('Error playing music:', e));
}

function stopMusic() {
    if (!bgMusic || bgMusic.paused) return;
    // Fade-out of 1.2s so the music closes softly with the exercise
    const fadeSteps = 12;
    const fadeMs = 100;
    let step = 0;
    const initialVolume = bgMusic.volume;
    const fadeOut = setInterval(() => {
        step++;
        bgMusic.volume = Math.max(0, initialVolume * (1 - step / fadeSteps));
        if (step >= fadeSteps) {
            clearInterval(fadeOut);
            bgMusic.pause();
            bgMusic.currentTime = 0;
            bgMusic.volume = initialVolume;
        }
    }, fadeMs);
}
