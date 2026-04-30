players = {}

def get_player(user):
    if user not in players:
        players[user] = {
            "xp": 0,
            "level": 1
        }
    return players[user]


def add_xp(user, amount):
    player = get_player(user)
    player["xp"] += amount

    # level up logika
    if player["xp"] >= player["level"] * 100:
        player["level"] += 1
        player["xp"] = 0