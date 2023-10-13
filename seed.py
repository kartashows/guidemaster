from main import app
from website import db
from website.models import City


with app.app_context():
    db.create_all()

with app.app_context():
    sp = City(city_name='Saint Petersburg', city_lat=59.936806, city_lng=30.31085)
    msk = City(city_name='Moscow', city_lat=55.752936, city_lng=37.621522)
    db.session.add(sp)
    db.session.add(msk)

    db.session.commit()
    db.session.close()
