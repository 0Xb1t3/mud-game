document.addEventListener("DOMContentLoaded", () => {

const u = document.getElementById("u");
const p = document.getElementById("p");
const msg = document.getElementById("msg");

async function login() {
    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: u.value,
            password: p.value
        })
    });

    const data = await res.json();

    if (!res.ok) {
        msg.innerText = data.error;
        return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/game.html";
}

async function register() {
    const res = await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: u.value,
            password: p.value
        })
    });

    const data = await res.json();

    msg.innerText = res.ok ? "Registered!" : data.error;
}

document.getElementById("loginBtn").onclick = login;
document.getElementById("regBtn").onclick = register;

});