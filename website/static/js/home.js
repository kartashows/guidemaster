function getMapView() {
    var city_name = document.getElementById("city-selection").value;
    var tour_name = document.getElementById("tour-selection").value;
    window.location.href = "/map?city=" + city_name + "&tour=" + tour_name;
}