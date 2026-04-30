from flask import Blueprint, request, jsonify, session

command_bp = Blueprint("command", __name__)

players = {}

def get_player(user):
    if user not in players:
        players[user] = {"x": 2, "y": 2, "xp": 0}
    return players[user]


@command_bp.route("/command", methods=["POST"])
def command():
    if "user" not in session:
        return jsonify({"response": "not logged in"})

    data = request.get_json()
    cmd = data.get("cmd", "")
    p = get_player(session["user"])

    # HELP
    if cmd == "help":
        return jsonify({
            "response": "help, learn, next, back, map, north, south, east, west"
        })

    # LEARN
    if cmd == "learn":
        p["xp"] += 10
        return jsonify({"response": "__LEARN__"})

    # NEXT
    if cmd == "next":
        return jsonify({"response": "__NEXT__"})

    # BACK
    if cmd == "back":
        return jsonify({"response": "__BACK__"})

    # MAP
    if cmd == "map":
        return jsonify({
            "response": "__MAP__",
            "x": p["x"],
            "y": p["y"]
        })

    # MOVEMENT (FIXED - EGYSÉGES RETURN)
    if cmd in ["north", "south", "east", "west"]:

        if cmd == "north":
            p["y"] -= 1
        elif cmd == "south":
            p["y"] += 1
        elif cmd == "east":
            p["x"] += 1
        elif cmd == "west":
            p["x"] -= 1

        return jsonify({
            "response": "__MOVE__",
            "dir": cmd,
            "x": p["x"],
            "y": p["y"]
        })

    return jsonify({"response": "ismeretlen parancs"})