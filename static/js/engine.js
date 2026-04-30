const output = document.getElementById("output");
const map = document.getElementById("mapCanvas");

window.ENGINE = { output, map };

// 🔥 SINGLE SOURCE OF TRUTH
window.GAME_STATE = window.GAME_STATE || {
    xp: 0,
    level: 1,
    player: { x: 2, y: 2 },
    mode: window.location.pathname.includes("game") ? "game" : "login",
    matrixIntensity: 0
};

// PRINT (egy darab, nincs duplikáció)
window.printOutput = function(text) {
    const div = document.createElement("div");
    div.innerText = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
};