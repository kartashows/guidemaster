//if ("geolocation" in navigator) {
//const loadingMessage = document.getElementById("loading-message");
//loadingMessage.classList.remove("d-none");

//    navigator.geolocation.getCurrentPosition(function(position) {
//        latitude = position.coords.latitude;
//        longitude = position.coords.longitude;
//        accuracy = position.coords.accuracy;
//
//        console.log("Latitude: " + latitude);
//        console.log("Longitude: " + longitude);
//        console.log("accuracy: " + accuracy);
map = L.map('map').setView(mapCoordinates, 12);
popup = L.popup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'}).addTo(map);

L.control.locate({drawCircle: false, flyto: true, initialZoomLevel: 12,locateOptions: {watch: true}}).addTo(map);

//        map.setMinZoom(11);
if (markers.length > 0){
    console.log(markers)
    markers.forEach(function(marker) {
        let sight = L.marker([marker.lat, marker.lng]).addTo(map);
        sight.bindPopup(`<p>${marker.name}</p><p>${marker.description}</p>`)
    });
}
//loadingMessage.classList.add("d-none");
//    });
//} else {
//    console.error("Geolocation is not supported in this browser.");
//}

