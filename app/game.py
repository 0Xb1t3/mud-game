from flask import Blueprint, render_template, session, redirect

game_bp = Blueprint("game", __name__)

@game_bp.route("/game")
def game():
    if "user" not in session:
        return redirect("/login")

    return render_template("game.html")