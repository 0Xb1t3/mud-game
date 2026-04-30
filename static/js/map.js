(() => {

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

let TILE_X = 50;
let TILE_Y = 50;

const STATE = window.GAME_STATE || {
    player: { x: 2, y: 2 },
    matrixIntensity: 0
};

const mapData = [
    [" ", "N", " ", "L", " "],
    [" ", " ", " ", " ", " "],
    ["W", " ", "P", " ", "E"],
    [" ", " ", " ", " ", " "],
    [" ", "D", " ", " ", " "]
];

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

function updateTileSize() {
    TILE_X = canvas.width / 5;
    TILE_Y = canvas.height / 5;
}

function drawMap() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00ff00";
    ctx.fillStyle = "#00ff00";
    ctx.font = "16px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {

            ctx.strokeRect(x * TILE_X, y * TILE_Y, TILE_X, TILE_Y);

            const tile = mapData[y][x];
            if (tile !== " ") {
                ctx.fillText(tile, x * TILE_X + TILE_X/2, y * TILE_Y + TILE_Y/2);
            }
        }
    }

    const p = STATE.player;

    ctx.beginPath();
ctx.arc(
    p.x * TILE_X + TILE_X / 2,
    p.y * TILE_Y + TILE_Y / 2,
    Math.min(TILE_X, TILE_Y) / 4,
    0,
    Math.PI * 2
);
ctx.fill();
}
 
window.drawMap = drawMap;

window.movePlayer = function(dir, x, y) {

    const p = STATE.player;

    if (typeof x === "number") p.x = x;
    if (typeof y === "number") p.y = y;

    if (dir === "north") p.y--;
    if (dir === "south") p.y++;
    if (dir === "east") p.x++;
    if (dir === "west") p.x--;

    p.x = Math.max(0, Math.min(4, p.x));
    p.y = Math.max(0, Math.min(4, p.y));

    drawMap();
};

function init() {
    resizeCanvas();
    updateTileSize();
    drawMap();
}

init();

window.addEventListener("resize", () => {
    resizeCanvas();
    updateTileSize();
    drawMap();
});

})();
