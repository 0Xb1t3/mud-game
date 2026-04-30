from flask import Blueprint, jsonify, redirect
from .edu import LESSONS

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def root():
    return redirect("/login")


@main_bp.route("/lesson/<key>")
def lesson(key):
    lesson = LESSONS.get(key)

    if not lesson:
        return jsonify({"error": "nincs ilyen lecke"})

    if "steps" not in lesson:
        lesson = {
            "cim": lesson.get("cim", ""),
            "feladat": lesson.get("feladat", ""),
            "steps": [{
                "kerdes": lesson.get("tartalom", ""),
                "valasz": lesson.get("tartalom", "")
            }]
        }

    return jsonify(lesson)