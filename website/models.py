from flask_login import UserMixin

from . import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    role = db.Column(db.Enum('user', 'admin'), nullable=False, default='user')


class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city_name = db.Column(db.String(150))
    city_lat = db.Column(db.Float)
    city_lng = db.Column(db.Float)
    tours = db.relationship('Tour', back_populates='city')


class Tour(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'))
    name = db.Column(db.String(150))
    city = db.relationship('City', back_populates='tours')
    markers = db.relationship('Marker', back_populates='tour')

class Marker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'))
    name = db.Column(db.String(150))
    description = db.Column(db.String(750))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    tour = db.relationship('Tour', back_populates='markers')
