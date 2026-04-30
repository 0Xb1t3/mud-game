function login() {
    send("/login", true);
}

function register() {
    send("/register", false);
}

function send(url, isLogin) {
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `username=${username.value}&password=${password.value}`
    })
    .then(async res => {

    let text = await res.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.log("SERVER NOT JSON:", text);
        document.getElementById("msg").innerText = "Server error";
        return;
    }

        if (data.status === "ok") {

            document.getElementById("msg").innerText = data.msg;

            if (isLogin) {
                setTimeout(() => {
                    window.location = "/game";
                }, 500);
            }

        } else {
            document.getElementById("msg").innerText = data.msg;
        }
    })
    .catch(err => {
        document.getElementById("msg").innerText = "Server error";
        console.log(err);
    });
}