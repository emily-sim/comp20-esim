var map, myLat, myLng;

window.addEventListener('load', navigator.geolocation.getCurrentPosition(getLocation));

// creates map and puts in HTML
function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
	 	center: {lat: 42.365, lng: -71.038},
   	zoom: 8
  });
}

function getLocation(position) {
	if (navigator.geolocation) {
		myLat = position.coords.latitude;
		myLng = position.coords.longitude;
		displayMap();
	} else {
		alert("Geolocation is not available on this device");
	}
}

function displayMap() {
	myLocation = new google.maps.LatLng(myLat, myLng);
	map.panTo(myLocation);

	marker = new google.maps.Marker({
		position: {lat: myLat, lng: myLng}, 
		size: new google.maps.Size(1, 1),
		icon: 'marker.png'
	});

	marker.setMap(map);
	infoWindow = new google.maps.InfoWindow();

	getData();
}

function getData() {
	var request = new XMLHttpRequest();
	request.open("POST","https://defense-in-derpth.herokuapp.com/submit", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200){
			var data = JSON.parse(request.responseText);
			checkData(data);
		}
	};

	request.send("username=njr1i7xM&lat=" + myLat + "&lng=" +myLng);
}

function checkData(data) {
	var isPassengers = true;

	if (data.passengers) {
		displayData(data.passengers, isPassengers);
	} else if (data.vehicles) {
		isPassengers = false;
		displayData(data.vehicles, isPassengers);
	}
}

function displayData(data, isPassengers) {
	var dataMarker, i;

	if (isPassengers) {
		dataMarker = 'user.png';
	} else {
		dataMarker = 'black_car.png';
	}

	var infoWindow = new google.maps.InfoWindow();

	for (i = 0; i < data.length; i++) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data[i].lat, data[i].lng),
			icon: dataMarker,
			size: new google.maps.Size(1, 1),
			map: map
		});

		google.maps.event.addListener(marker, 'click', (function(marker, i){
			return function() {
				var username = data[i].username;
				var userLat = data[i].lat;
				var userLng = data[i].lng;
				var distance = getDistance(userLat, userLng)
				var displayInfo = "<div><p>Username: "+ username + "</p><p>Miles from me: " + distance + "</p></div>";
	   	 infoWindow.setContent(displayInfo);
	   	 infoWindow.open(map, marker);
			}
		})(marker, i));
	}
}

function getDistance(userLat, userLng) {
	Number.prototype.toRad = function() {
	  return this * Math.PI / 180;
 	}

	lat1 = userLat;
	lng1 = userLng;
	lat2 = myLat;
	lng2 = myLng;
	R = 6371;
	x1 = lat2-lat1;
	dLat = x1.toRad();
	x2 = lng2-lng1;
	dLng = x2.toRad();
	a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin (dLng/2) * Math.sin(dLng/2);
	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	distance = R * c;
	distance = distance * 0.062137;
	return distance;
}
