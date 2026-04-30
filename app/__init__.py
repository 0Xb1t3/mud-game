import os
from flask import Flask

def create_app():
    base_dir = os.path.abspath(os.path.dirname(__file__))

    app = Flask(
        __name__,
        template_folder=os.path.join(base_dir, "..", "templates"),
        static_folder=os.path.join(base_dir, "..", "static")
    )

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-key")
    app.config["DATABASE"] = os.path.join(base_dir, "..", "instance", "database.db")

    from .auth import auth_bp
    from .game import game_bp
    from .routes import main_bp
    from .command import command_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(command_bp)

    return app