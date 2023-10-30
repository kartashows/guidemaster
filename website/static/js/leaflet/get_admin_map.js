
map = L.map('map').setView(mapCoordinates, 12);
popup = L.popup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'}).addTo(map);
map.setMinZoom(11);
if (markers.length > 0){
    markers.forEach(function(marker) {
        let uniqueId = [marker.lat, marker.lng].join('-')
        let sight = L.marker([marker.lat, marker.lng], {'id': uniqueId}).addTo(map);
        markerPopup = `<p id="${uniqueId}-name">${marker.name}</p><p id="${uniqueId}-description">${marker.description}</p> <button id="${uniqueId}" type="button" class="btn btn-danger btn-sm" onclick="deleteMarker(this)">Delete</button>`;
        sight.bindPopup(markerPopup)
        if (marker.isStartingPoint){
            sight._icon.classList.add("is-starting-point");
        }
        sight.on('click', function(e){
            let markerId = e.target.options.id
            let popupText = e.target._popup._content
            editOptionsControl('visible', markerId, popupText)
        });
    });
}

function getSavedMarkers(){

}

function onMapClick(e) {
    let uniqueId = [e.latlng.lat, e.latlng.lng].join('-')
    let marker = L.marker([e.latlng.lat, e.latlng.lng], {'id': uniqueId}).addTo(map);
    marker.bindPopup(`<p id="${uniqueId}-name">No name</p><p id="${uniqueId}-description">no info</p> <button id="${uniqueId}" type="button" class="btn btn-danger btn-sm" onclick="deleteMarker(this)">Delete</button>`)
    marker.on('click', function(e){
        let markerId = e.target.options.id
        let popupText = e.target._popup._content
        editOptionsControl('visible', markerId, popupText)
    });
    map.off('click', onMapClick);
    document.getElementsByClassName('custom-cancel-btn')[0].style.display = 'none';
}

function addMarker(){
    map.on('click', onMapClick);
    document.getElementsByClassName('custom-cancel-btn')[0].style.display = 'block';
}

function cancelAddMarker(){
    map.off('click', onMapClick);
    document.getElementsByClassName('custom-cancel-btn')[0].style.display = 'none';
}

function deleteMarker(e){
    map.eachLayer(layer => {
        if (layer.options.id == e.id){
            let deletedMarkers = JSON.parse(sessionStorage.getItem('deletedMarkers')) || [];
            deletedMarkers.push(layer.options.id)
            sessionStorage.setItem('deletedMarkers', JSON.stringify(deletedMarkers));
            map.removeLayer(layer)
        }
    })
    editOptionsControl('hidden')
}

function editMarkerInfo(e){
//    console.log(e.id)
    let name = document.getElementsByClassName('marker-name')[0].value;
    let description = document.getElementsByClassName('marker-desc')[0].value;
    let isStartingPoint = document.getElementsByClassName('marker-starting-point')[0].checked;
    map.eachLayer(layer => {
        if (layer.options.id == e.id){
            newPopupContent = `<p id="${e.id}-name">${name}</p><p id="${e.id}-description">${description}</p> <button id="${e.id}" type="button" class="btn btn-danger btn-sm" onclick="deleteMarker(this)">Delete</button>`;
            layer.setPopupContent(newPopupContent);
            if(isStartingPoint){
                layer._icon.classList.add("is-starting-point");
            }
        }
    })
    editOptionsControl('hidden')
}

function editOptionsControl(mode, markerId, popupText){
    if (mode == 'visible'){
        let elements = document.getElementsByClassName('marker-edit');
        let nameInput = document.getElementsByClassName('marker-name')[0];
        let descriptionInput = document.getElementsByClassName('marker-desc')[0];
        Array.from(elements).map(element => {
            if (markerId && popupText){
                element.id = markerId
                let [name, desc] = extractPopupText(popupText)
                nameInput.value = name
                descriptionInput.value = desc
            }
            element.style.display = 'block';
        });
    } else if (mode == 'hidden'){
        let elements = document.getElementsByClassName('marker-edit');
        Array.from(elements).map(element => {
            element.style.display = 'none';
        });
    }
}


function extractPopupText(htmlString){
    let regex = /<p id="[^"]+">(.*?)<\/p>/g;
    let contents = [];
    let match;
    while ((match = regex.exec(htmlString)) !== null) {
        const paragraphContent = match[1];
        contents.push(paragraphContent);
    }
    return contents;
}

function saveMarkersToDB(tour_id){

    allMarkers = getAllMapMarkers(tour_id)
    deletedMarkers = JSON.parse(sessionStorage.getItem('deletedMarkers')) || [];
    markers = {'allMarkers': allMarkers, 'deletedMarkers': deletedMarkers}
    fetch('/save-tour', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(markers)
    }).then(response => response.json())
    .then(data => {
        sessionStorage.clear()
//        alerts('Your tour has been saved successfully!')
        console.log(data);
    })
    .catch(error => {
        alert('Error:', error);
    });
}

function getAllMapMarkers(tour_id){
    markers = []
    map.eachLayer(function (layer) {
        if (typeof layer.options.id !== 'undefined') {
            let isStartingPoint = layer._icon.classList.contains("is-starting-point") ? 1 : 0;
            let [name, desc] = extractPopupText(layer._popup._content)
            let lat = layer._latlng.lat;
            let lng = layer._latlng.lng;
            layer_info = {'tour_id': tour_id,
                          'name': name,
                          'description': desc,
                          'latitude': lat,
                          'longitude': lng,
                          'is_starting_point': isStartingPoint}
            markers.push(layer_info)
        }
    })
    return markers
}

//function setBoundsForMap(city){
//    if (city == 'Saint Petersburg'){
//        bounds = L.latLngBounds(
//        L.latLng(60.017144, 29.660302), // Northwest corner
//        L.latLng(59.664694, 30.709534)  // Southeast corner
//        );
//
//        map.setMaxBounds(bounds);
//        map.on('drag', function () {
//            map.panInsideBounds(bounds, { animate: false });
//        });
//    } else if (city == 'Moscow') {
//        bounds = L.latLngBounds(
//        L.latLng(55.503749, 37.190725), // Northwest corner
//        L.latLng(55.612888, 37.949647)  // Southeast corner
//        );
//
//        map.setMaxBounds(bounds);
//        map.on('drag', function () {
//            map.panInsideBounds(bounds, { animate: false });
//        });
//    }
//}