from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user


from .models import City, Tour, Marker
from . import db
from .utility import (has_updated_fields,
                      get_lat_lng_deleted_marker)


views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        city_name = request.form.get('city-name')
        tour_name = request.form.get('tour-name')
        if len(tour_name) < 1:
            flash("City tour name shouldn't be empty", category='error')
        elif Tour.query.filter_by(name=tour_name).first() is not None:
            flash('This tour name already exists', category='error')
        else:
            city_id = City.query.filter_by(city_name=city_name).first().id
            if Tour.query.filter_by(name=tour_name).first() is None:
                new_tour = Tour(user_id=current_user.id,
                                city_id=city_id,
                                name=tour_name)
                db.session.add(new_tour)
                db.session.commit()
            city = City.query.filter_by(city_name=city_name).first()
            tour = Tour.query.filter_by(name=tour_name).first()
            markers = Marker.query.filter_by(tour_id=tour.id).all()
            return render_template("map.html", user=current_user, city=city, tour=tour, markers=markers)
    cities = City.query.all()
    if current_user.role == 'admin':
        tours = Tour.query.filter_by(user_id=current_user.id).all()
    elif current_user.role == 'user':
        tours = Tour.query.all()
    return render_template("home.html", user=current_user, cities=cities, tours=tours)


@views.route('/map', methods=['POST', 'GET'])
def open_map_view():
    city_name = request.args.get('city')
    tour_name = request.args.get('tour')
    city = City.query.filter_by(city_name=city_name).first()
    tour = Tour.query.filter_by(name=tour_name).first()
    markers = Marker.query.filter_by(tour_id=tour.id).all()
    return render_template("map.html", user=current_user, city=city, tour=tour, markers=markers)


@views.route('/save-tour', methods=['POST', 'GET'])
def save_tour():
    markers = request.json
    all_markers = markers['allMarkers']
    deleted_markers = markers['deletedMarkers']
    if all_markers:
        for marker in all_markers:
            db_entry = Marker.query.filter_by(latitude=marker['latitude'], longitude=marker['longitude']).first()
            marker_exists = db_entry is not None
            if marker_exists and has_updated_fields(db_entry, marker['name'], marker['description']):
                db_entry.name = marker['name']
                db_entry.description = marker['description']
                continue
            elif marker_exists:
                continue
            new_marker = Marker(tour_id=marker['tour_id'],
                                name=marker['name'],
                                description=marker['description'],
                                latitude=marker['latitude'],
                                longitude=marker['longitude'],
                                )
            db.session.add(new_marker)
    if deleted_markers:
        for marker in deleted_markers:
            marker_lat, marker_lng = get_lat_lng_deleted_marker(marker)
            marker_to_delete = Marker.query.filter_by(latitude=marker_lat, longitude=marker_lng).first()
            if marker_to_delete:
                db.session.delete(marker_to_delete)
    db.session.commit()
    return jsonify({})
