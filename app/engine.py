players = {}

def get_player(user):
    if user not in players:
        players[user] = {
            "x": 2,
            "y": 2,
            "xp": 0
        }
    return players[user]


def handle_command(user, cmd):
    p = get_player(user)

    if cmd == "help":
        return {"response": "help, learn, next, back, map, north, south, east, west"}

    if cmd == "status":
        return {"response": f"XP: {p['xp']} | POS: ({p['x']},{p['y']})"}

    if cmd == "learn":
        p["xp"] += 10
        return {"response": "__LEARN__"}

    if cmd == "next":
        return {"response": "__NEXT__"}

    if cmd == "back":
        return {"response": "__BACK__"}

    if cmd == "map":
        return {"response": "__MAP__"}

    if cmd == "north":
        p["y"] -= 1

    elif cmd == "south":
        p["y"] += 1

    elif cmd == "east":
        p["x"] += 1

    elif cmd == "west":
        p["x"] -= 1

    else:
        return {"response": "ismeretlen parancs"}

    return {
        "response": "__MOVE__",
        "x": p["x"],
        "y": p["y"]
    }