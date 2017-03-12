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
	var dataMarker, infoWindow, x;

	if (isPassengers) {
		dataMarker = 'user.png';
	} else {
		dataMarker = 'black_car.png';
	}

	infoWindow = new google.maps.InfoWindow();

	for (x in data) {
		marker = new google.maps.Marker({
			position: new google.maps.LatLng(data[x].lat, data[x].lng),
			icon: dataMarker,
			size: new google.maps.Size(1, 1),
			map: map
		});
	}

	google.maps.event.addListener(marker, 'click', (function(marker, x){
		return function() {
			username = data[x].username;
			myPos = new google.maps.LatLng(myLat, myLng);
			userPos = new google.maps.LatLng(data[x].lat, data[x].lng);
			distance = new google.maps.computeDistanceBetween(myPos, userPos);
			displayInfo = "<div><p>Username: "+ username + "</p><p>Miles from me: " + distance + "</p></div>";
	    info.setContent(displayInfo);
	    info.open(map, marker);
		}
	})(marker, x));
}

















