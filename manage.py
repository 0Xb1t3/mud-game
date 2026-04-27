from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import random
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

SECRET = os.environ.get("SECRET", "dev-secret")
ALGO = "HS256"

users = {}
players = {}

# ================= AUTH =================

def hash_pw(pw):
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def check_pw(pw, hashed):
    return bcrypt.checkpw(pw.encode(), hashed.encode())


def create_token(user):
    return jwt.encode(
        {"sub": user, "exp": datetime.utcnow() + timedelta(hours=2)},
        SECRET,
        algorithm=ALGO
    )


def verify_token(t):
    try:
        return jwt.decode(t, SECRET, algorithms=[ALGO])["sub"]
    except:
        return None


# ================= GAME =================

class Player:
    def __init__(self, name):
        self.name = name
        self.x = 10
        self.y = 10
        self.xp = 0
        self.rank = "Script Kiddie"

    def add_xp(self, xp):
        self.xp += xp

        if self.xp > 500:
            self.rank = "Root"
        elif self.xp > 250:
            self.rank = "Elite"
        elif self.xp > 100:
            self.rank = "Analyst"
        elif self.xp > 50:
            self.rank = "Coder"


def get_player(user):
    if user not in players:
        players[user] = Player(user)
    return players[user]


def send_state(sid, p, msg=None):
    socketio.emit("state", {
        "x": p.x,
        "y": p.y,
        "xp": p.xp,
        "rank": p.rank,
        "msg": msg
    }, to=sid)


# ================= ROUTES =================

@app.route("/")
def index():
    return app.send_static_file("login.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("static", path)


# ================= AUTH API =================

@app.post("/register")
def register():
    d = request.json
    u, p = d.get("username"), d.get("password")

    if u in users:
        return {"error": "exists"}, 400

    users[u] = hash_pw(p)
    return {"ok": True}


@app.post("/login")
def login():
    d = request.json
    u, p = d.get("username"), d.get("password")

    if u not in users:
        return {"error": "bad"}, 400

    if not check_pw(p, users[u]):
        return {"error": "bad"}, 400

    return {"token": create_token(u)}


# ================= SOCKET =================

@socketio.on("join")
def on_join(data):
    user = verify_token(data.get("token"))
    if not user:
        return

    p = get_player(user)
    send_state(request.sid, p, "Connected")


@socketio.on("action")
def on_action(data):
    user = verify_token(data.get("token"))
    if not user:
        return

    p = get_player(user)
    cmd = data.get("cmd", "").lower()

    if cmd == "help":
        send_state(request.sid, p, "commands: north south east west hack scan")
        return

    if cmd == "scan":
        send_state(request.sid, p, f"POS {p.x},{p.y} XP:{p.xp} RANK:{p.rank}")
        return

    if cmd == "north":
        p.y -= 1
    elif cmd == "south":
        p.y += 1
    elif cmd == "east":
        p.x += 1
    elif cmd == "west":
        p.x -= 1
    elif cmd == "hack":
        gain = random.randint(10, 50)
        p.add_xp(gain)
        send_state(request.sid, p, f"+{gain} XP ({p.rank})")
        return

    send_state(request.sid, p, f"> {cmd}")


# ================= RUN =================

#if __name__ == "__main__":
#    socketio.run(app, host="0.0.0.0", port=3000, debug=True)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)