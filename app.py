
from flask import Flask, render_template, redirect, request, url_for, session, jsonify, g
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm

app = Flask(__name__)
app.teardown_appcontext(close_db)
# app.config["SECRET_KEY"] = "banana"
# app.config["SESSION_PERMANENT"] = False
# app.config ["SESSION_TYPE"] = "filesystem"
Session(app)

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0')
    

@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id", None)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/greedy_wizard")
def greedy_wizard():
    return render_template("ca2.html")


@app.route("/leaderboard")
def leaderboard():
    db = get_db() 
    scores = db.execute("""SELECT user, MAX(score) score
                FROM scores
                GROUP BY user
                ORDER BY score DESC;
    """)
    return render_template("leaderboard.html", scores=scores)

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])
    # Insert score into database
    # form = LoginForm()
    # user_id = form.user_id.data
    db = get_db()
    db.execute("""INSERT INTO scores (user, score)
                        VALUES(?, ?);""", (g.user, score))
    db.commit()
    return "success"



#Authentication
@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        pw = form.pw.data
        pw2 = form.pw2.data
        db = get_db()
        possible_clashing_user = db.execute("""SELECT * FROM users
                                            WHERE user_id = ?;""", (user_id,)).fetchone()
        if possible_clashing_user is not None:
            form.user_id.errors.append ("User id already taken!")
        else:
            db.execute("""INSERT INTO users (user_id, pw)
                        VALUES (?, ?);""",
                        (user_id, generate_password_hash(pw)))
            db.commit ()
            return redirect( url_for("login") )
    return render_template("register.html", form=form,)

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        pw = form.pw.data
        db = get_db()
        matching_user = db.execute("""SELECT * FROM users
                                            WHERE user_id = ?;""", (user_id,)).fetchone()
        if matching_user is None:
            form.user_id.errors.append ("Unknown user id!")
        elif not check_password_hash(matching_user["pw"], pw):
            form.pw.errors.append("Incorrect password!")
        else:
            session.clear()
            session["user_id"] = user_id
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()
    return redirect( url_for("index") )
