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
        let data = await res.json();

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