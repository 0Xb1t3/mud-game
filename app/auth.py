from flask import Blueprint, render_template, request, jsonify, session
from .db import get_db
import os

auth_bp = Blueprint("auth", __name__)

# =========================
# 🧠 RENDER SAFE DB PATH
# =========================
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_PATH = os.path.join(BASE_DIR, "instance", "database.db")


# =========================
# LOGIN PAGE
# =========================
@auth_bp.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")


# =========================
# LOGIN ACTION
# =========================
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        db = get_db()

        user = db.execute(
            "SELECT * FROM users WHERE username=? AND password=?",
            (request.form["username"], request.form["password"])
        ).fetchone()

        if user:
            session["user"] = user["username"]
            return jsonify({"status": "ok", "msg": "Login success"})

        return jsonify({"status": "error", "msg": "Invalid credentials"}), 401

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"status": "error", "msg": "Server error"}), 500


# =========================
# REGISTER
# =========================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        db = get_db()

        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (request.form["username"], request.form["password"])
        )
        db.commit()

        return jsonify({"status": "ok", "msg": "Registered"})

    except Exception as e:
        print("REGISTER ERROR:", e)
        return jsonify({"status": "error", "msg": "User exists"}), 409