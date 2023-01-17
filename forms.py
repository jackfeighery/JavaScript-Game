from flask import Flask
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, EqualTo


class RegistrationForm(FlaskForm):
    user_id = StringField("User ID:", validators=[InputRequired()])
    pw =PasswordField("Password:", validators=[InputRequired()])
    pw2 =PasswordField("Confirm Password:", validators=[InputRequired(), EqualTo("pw")])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    user_id = StringField("User ID:", validators=[InputRequired()])
    pw =PasswordField("Password:", validators=[InputRequired()])
    submit = SubmitField("Submit")
