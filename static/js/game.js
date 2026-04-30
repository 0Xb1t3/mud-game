const input = document.getElementById("input");

const STATE = window.GAME_STATE;

let currentLesson = 0;
let currentStep = 0;
let lessonState = "question";

const lessonKeys = [
    "valtozo","adat_tipus","fuggveny","osztaly",
    "http","request_response","get","post",
    "json","backend","flask"
];

function highlight(text, key) {
    if (!window.KEYWORDS) return text;

    const words = window.KEYWORDS[key] || [];

    words.forEach(w => {
        const regex = new RegExp(`\\b${w}\\b`, "gi");
        text = text.replace(regex, `<span class="keyword">${w}</span>`);
    });

    return text;
}

function print(text, key = null, useHighlight = false) {

    const div = document.createElement("div");

    if (useHighlight && key) {
        div.innerHTML = highlight(text, key);
    } else {
        div.innerText = text;
    }

    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function loadLesson() {
    const key = lessonKeys[currentLesson];

    fetch("/lesson/" + key)
        .then(r => r.json())
        .then(data => {

            const step = data.steps?.[currentStep];
            if (!step) return;

            // 📘 QUESTION STATE
            if (lessonState === "question") {
                print("📘 " + data.cim);
                print("❓ " + step.kerdes);

                lessonState = "answer";
            }

            // 💡 ANSWER STATE
            else if (lessonState === "answer") {
                print("💡 " + step.valasz, key, true);

                lessonState = "question";
                currentStep++;

                // 🔁 NEXT STEP / NEXT LESSON LOGIC
                if (currentStep >= data.steps.length) {
                    currentStep = 0;
                    currentLesson = Math.min(currentLesson + 1, lessonKeys.length - 1);
                }
            }
        });
}

function handleResponse(res, data) {

    if (res === "__LEARN__") {
        STATE.xp += 10;
        loadLesson();
    }

    else if (res === "__NEXT__") {
        currentLesson = Math.min(currentLesson + 1, lessonKeys.length - 1);
        currentStep = 0;
        lessonState = "question";
        loadLesson();
    }

    else if (res === "__BACK__") {
        currentLesson = Math.max(currentLesson - 1, 0);
        currentStep = 0;
        lessonState = "question";
        loadLesson();
    }

    else if (res === "__MOVE__") {
        movePlayer(data.dir, data.x, data.y);
    }

    else {
        print(res);
    }
}

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {

        const cmd = input.value.trim();
        if (!cmd) return;

        print("> " + cmd);

        fetch("/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cmd })
        })
        .then(r => r.json())
        .then(d => handleResponse(d.response, d));

        input.value = "";
    }
});


print(`
██▓███   ██▀███   ▒█████    ▄████            ▓█████▄  █    ██  ███▄    █   ▄████ ▓█████  ▒█████   ███▄    █ 
▓██░  ██▒▓██ ▒ ██▒▒██▒  ██▒ ██▒ ▀█▒           ▒██▀ ██▌ ██  ▓██▒ ██ ▀█   █  ██▒ ▀█▒▓█   ▀ ▒██▒  ██▒ ██ ▀█   █ 
▓██░ ██▓▒▓██ ░▄█ ▒▒██░  ██▒▒██░▄▄▄░           ░██   █▌▓██  ▒██░▓██  ▀█ ██▒▒██░▄▄▄░▒███   ▒██░  ██▒▓██  ▀█ ██▒
▒██▄█▓▒ ▒▒██▀▀█▄  ▒██   ██░░▓█  ██▓           ░▓█▄   ▌▓▓█  ░██░▓██▒  ▐▌██▒░▓█  ██▓▒▓█  ▄ ▒██   ██░▓██▒  ▐▌██▒
▒██▒ ░  ░░██▓ ▒██▒░ ████▓▒░░▒▓███▀▒    ██▓    ░▒████▓ ▒▒█████▓ ▒██░   ▓██░░▒▓███▀▒░▒████▒░ ████▓▒░▒██░   ▓██░
▒▓▒░ ░  ░░ ▒▓ ░▒▓░░ ▒░▒░▒░  ░▒   ▒     ▒▓▒     ▒▒▓  ▒ ░▒▓▒ ▒ ▒ ░ ▒░   ▒ ▒  ░▒   ▒ ░░ ▒░ ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ 
░▒ ░       ░▒ ░ ▒░  ░ ▒ ▒░   ░   ░     ░▒      ░ ▒  ▒ ░░▒░ ░ ░ ░ ░░   ░ ▒░  ░   ░  ░ ░  ░  ░ ▒ ▒░ ░ ░░   ░ ▒░
░░         ░░   ░ ░ ░ ░ ▒  ░ ░   ░     ░       ░ ░  ░  ░░░ ░ ░    ░   ░ ░ ░ ░   ░    ░   ░ ░ ░ ▒     ░   ░ ░ 
            ░         ░ ░        ░      ░        ░       ░              ░       ░    ░  ░    ░ ░           ░


Ez az oldal kicsit szándékosan provokatív!! 
Itt nem elég végignézni a tartalmat. 
Írni kell. Gondolkodni kell. Hibázni is. 
Mert a programozás nem passzív tudás, hanem izommemória.
Amit nem írsz le, azt nem fogod tudni munka közben sem.
A learn parancs mögötti logika szándékosan lineáris, mert így működik a valós fejlesztői tanulás is:

Kérdés → Válasz → Feladat

a kérdés ráállít a problémára
a válasz beépíti az elméletet
a feladat kikényszeríti a használatot

Ez nem olvasó mód. Ez “hands-on” mód.


Szóval a lényeg:
Nem egy tananyagot olvasol — hanem egy olyan rendszert használsz, ami arra készít fel, hogy majd te is rendszereket írj.

És igen… a valóságban is lesz olyan nap, amikor egy bug fix közben ugyanennyit fogsz gépelni — csak akkor már fizetnek érte 😄



WELCOME TO MUD HACKER SIM

`);

print("SYSTEM BOOTING...");
print("=".repeat(60));
print("TYPE help");

drawMap();

setTimeout(() => {
    output.scrollTop = 0;
}, 50);