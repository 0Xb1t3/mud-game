from flask import Blueprint, render_template, request, jsonify, session
from .db import get_db

auth_bp = Blueprint("auth", __name__)

DB_PATH = "instance/database.db"


#LOGIN PAGE
@auth_bp.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")


#LOGIN ACTION
@auth_bp.route("/login", methods=["POST"])
def login():
    db = get_db(DB_PATH)

    user = db.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (request.form["username"], request.form["password"])
    ).fetchone()

    if user:
        session["user"] = user["username"]
        return jsonify({"status": "ok", "msg": "Login success"})

    return jsonify({"status": "error", "msg": "Invalid credentials"}), 401


#REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    db = get_db(DB_PATH)

    try:
        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (request.form["username"], request.form["password"])
        )
        db.commit()

        return jsonify({"status": "ok", "msg": "Registered"})

    except:
        return jsonify({"status": "error", "msg": "User exists"}), 409