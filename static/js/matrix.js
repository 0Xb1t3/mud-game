(() => {

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const STATE = window.GAME_STATE || {
    player: { x: 2, y: 2 },
    matrixIntensity: 0
};

// ✅ ELŐSZÖR deklaráljuk
const GAME_CHARS =
"アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*<>[]{}=/\\|";

// ✅ DEFAULT (login)
let chars = "01";

// ✅ GAME mód
if (window.location.pathname.includes("game")) {
    chars = GAME_CHARS;
    STATE.matrixIntensity = 0;
}

const size = 14;
let cols = Math.floor(canvas.width / size);
let drops = Array(cols).fill(1);

// 🎨 DRAW
function draw() {

    const intensity = STATE.matrixIntensity || 0;

    ctx.fillStyle = `rgba(0,0,0,${0.05 + intensity * 0.02})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = size + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * size, drops[i] * size);

        const speed = 1;

        if (drops[i] * size > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += speed;
    }
}

// 🔁 LOOP
setInterval(draw, 33);

// 📱 RESIZE FIX
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cols = Math.floor(canvas.width / size);
    drops = Array(cols).fill(1);
});

})();