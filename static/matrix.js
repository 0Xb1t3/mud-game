const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const letters = "アァカサタナハマヤャラワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*<>[]{}=/\\|";
const chars = letters.split("");

const fontSize = 16;
let columns = Math.floor(window.innerWidth / fontSize);

let drops = [];

function init(){
    columns = Math.floor(window.innerWidth / fontSize);
    drops = Array(columns).fill(0);
}
init();
window.addEventListener("resize", init);

function drawMatrix(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff9c";
    ctx.font = fontSize + "px monospace";

    for(let i = 0; i < drops.length; i++){
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if(y > canvas.height && Math.random() > 0.975){
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 33);