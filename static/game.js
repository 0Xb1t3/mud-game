window.addEventListener("DOMContentLoaded", () => {

const socket = io();
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/";
    return;
}

const output = document.getElementById("output");
const input = document.getElementById("input");
const canvas = document.getElementById("map");

if (!output || !input || !canvas) {
    console.error("Missing DOM elements!");
    return;
}

const ctx = canvas.getContext("2d");

/* ================= LOG ================= */
function log(msg) {
    if (!msg) return;
    output.textContent += msg + "\n";
    output.scrollTop = output.scrollHeight;
}

/* ================= ASCII ================= */
let welcomeShown = false;

function showWelcome() {
    if (welcomeShown) return;
    welcomeShown = true;

    const ascii = `
 ██▓███   ██▀███   ▒█████    ▄████            ▓█████▄  █    ██  ███▄    █   ▄████ ▓█████  ▒█████   ███▄    █ 
▓██░  ██▒▓██ ▒ ██▒▒██▒  ██▒ ██▒ ▀█▒           ▒██▀ ██▌ ██  ▓██▒ ██ ▀█   █  ██▒ ▀█▒▓█   ▀ ▒██▒  ██▒ ██ ▀█   █ 
▓██░ ██▓▒▓██ ░▄█ ▒▒██░  ██▒▒██░▄▄▄░           ░██   █▌▓██  ▒██░▓██  ▀█ ██▒▒██░▄▄▄░▒███   ▒██░  ██▒▓██  ▀█ ██▒
▒██▄█▓▒ ▒▒██▀▀█▄  ▒██   ██░░▓█  ██▓           ░▓█▄   ▌▓▓█  ░██░▓██▒  ▐▌██▒░▓█  ██▓▒▓█  ▄ ▒██   ██░▓██▒  ▐▌██▒
▒██▒ ░  ░░██▓ ▒██▒░ ████▓▒░░▒▓███▀▒    ██▓    ░▒████▓ ▒▒█████▓ ▒██░   ▓██░░▒▓███▀▒░▒████▒░ ████▓▒░▒██░   ▓██░
▒▓▒░ ░  ░░ ▒▓ ░▒▓░░ ▒░▒░▒░  ░▒   ▒     ▒▓▒     ▒▒▓  ▒ ░▒▓▒ ▒ ▒ ░ ▒░   ▒ ▒  ░▒   ▒ ░░ ▒░ ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ 
░▒ ░       ░▒ ░ ▒░  ░ ▒ ▒░   ░   ░     ░▒      ░ ▒  ▒ ░░▒░ ░ ░ ░ ░░   ░ ▒░  ░   ░  ░ ░  ░  ░ ▒ ▒░ ░ ░░   ░ ▒░
░░         ░░   ░ ░ ░ ░ ▒  ░ ░   ░     ░       ░ ░  ░  ░░░ ░ ░    ░   ░ ░ ░ ░   ░    ░   ░ ░ ░ ▒     ░   ░ ░ 
            ░         ░ ░        ░      ░        ░       ░              ░       ░    ░  ░    ░ ░           ░ 

WELCOME TO MUD HACKER SIM
type: help
`;

    log(ascii);
}

/* ================= MAP ================= */
function drawMap(x, y) {

    const size = 50;
    const tile = 8;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            ctx.fillStyle = Math.random() > 0.85 ? "#003300" : "#001001";
            ctx.fillRect(i * tile, j * tile, tile, tile);
        }
    }

    ctx.fillStyle = "red";
    ctx.fillRect(x * tile, y * tile, tile, tile);
}

/* ================= SOCKET ================= */
socket.on("connect", () => {
    showWelcome();
    socket.emit("join", { token });
});

socket.on("state", (d) => {

    if (d?.x !== undefined && d?.y !== undefined) {
        drawMap(d.x, d.y);
    }

    if (d?.msg && d.msg !== "Connected") {
        log("> " + d.msg);
    }
});

/* ================= INPUT ================= */
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const cmd = input.value.trim();
        input.value = "";

        if (!cmd) return;

        socket.emit("action", { token, cmd });
    }
});

});