function initialize() {
	var mapOptions = {
		center: {lat: -7.2756141, lng: 112.6416432}, zoom: 9
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	function show_wisata_tobasa(){
		wisata_tobasa = new google.maps.Data();
		wisata_tobasa.loadGeoJson('geojson.php');
		wisata_tobasa.setMap(map);
		info_wisata_tobasa = new google.maps.InfoWindow();
		wisata_tobasa.addListener('click', function(e) {
			info_wisata_tobasa.close();
			var nama = e.feature.getProperty('nama');
			info_wisata_tobasa.setContent("<b>Nama</b> : "+nama);
			info_wisata_tobasa.setPosition(e.latLng);
			info_wisata_tobasa.setOptions({pixelOffset: new google.maps.Size(0,-35)});
			info_wisata_tobasa.open(map);
		});
	}
	function toggle_wisata_tobasa(){
		if (typeof wisata_tobasa.setMap == 'function') {
			if (document.getElementById("wisata_tobasa").checked == true) {
				wisata_tobasa.setMap(map);
			}
			else {
				wisata_tobasa.setMap(null);
			}
		}
		else{
			if (document.getElementById("wisata_tobasa").checked == true) {
				show_wisata_tobasa();
			}
		}
	}
	document.getElementById("wisata_tobasa").addEventListener("change", toggle_wisata_tobasa);

	resultmarker = [];
	function findname(){
		for (var i = 0; i < resultmarker.length; i++){
			resultmarker[i].setMap(null);
		}
		resultmarker = [];

		if(inputname.value==''){
			alert("Isi kolom pencarian!");
		}
	
		else{
			document.getElementById("listdata").innerHTML = "";
			var xmlhttp = new XMLHttpRequest();
			var url = "findname.php?q="+inputname.value;
			xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var arr = JSON.parse(this.responseText);
					if(arr == null){
						alert('Data Tidak Ada');
						return;
					}
					var i;

					for(i = 0; i < arr.length; i++) {
						gid=arr[i].gid,
						nama=arr[i].nama,
						latitude=arr[i].latitude,
						longitude=arr[i].longitude;
						newcenter=new google.maps.LatLng(latitude, longitude);
						marker=new google.maps.Marker({
							position: newcenter, map: map, animation: google.maps.Animation.DROP
						});
						resultmarker.push(marker);
						map.setZoom(9);
						map.setCenter(newcenter);
						createInfoWindow(marker, gid, nama);
						document.getElementById("listdata").innerHTML += "<li id="+gid+" onclick='showdetail(this.id)'>"+nama+"</li>";
					}
				}
			};
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		}
	}

	function createInfoWindow(marker, gid, nama){
		infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function(){
			infowindow.close();
			infowindow.setContent("<b>Nama</b> : "+nama);
			infowindow.open(map, marker);
		});
	}

	document.getElementById("btnfind").addEventListener("click", findname);
	document.getElementById("inputname").addEventListener("keyup", function(event){
		if (event.keyCode==13){
			btnfindname();
		}
	});

	// function initMap() {
	// 	var directionsService = new google.maps.DirectionsService;
	// 	var directionsDisplay = new google.maps.DirectionsRenderer;
	// 	var map = new google.maps.Map(document.getElementById('map'), {
	// 	  zoom: 6,
	// 	  center: {lat: -7.280582, lng: 112.780800}
	// 	});
	// 	directionsDisplay.setMap(map);

	// }
	// document.getElementById('submit').addEventListener('click', function() {
	// 	var directionsService = new google.maps.DirectionsService;
	// 	var directionsDisplay = new google.maps.DirectionsRenderer;
	//   	calculateAndDisplayRoute(directionsService, directionsDisplay);
	// });

	// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	// 	console.log('hai');
	// 	var waypts = [];
	// 	var checkboxArray = document.getElementById('waypoints');
	// 	for (var i = 0; i < checkboxArray.length; i++) {
	// 	  if (checkboxArray.options[i].selected) {
	// 	    waypts.push({
	// 	      location: checkboxArray[i].value,
	// 	      stopover: true
	// 	    });
	// 	  }
	// 	}
	// 	var start = document.getElementById('start').value;
	// 	var end = document.getElementById('end').value;

	// 	directionsService.route({
	// 	  origin: window.lat[start]['lat']+' '+window.lat[start]['long'],
	// 	  destination: window.lat[end]['lat']+' '+window.lat[end]['long'],
	// 	  waypoints: waypts,
	// 	  optimizeWaypoints: true,
	// 	  travelMode: 'DRIVING'
	// 	}, function(response, status) {
	// 	  if (status === 'OK') {
	// 	    directionsDisplay.setDirections(response);
	// 	    var route = response.routes[0];
	// 	    var summaryPanel = document.getElementById('directions-panel');
	// 	    summaryPanel.innerHTML = '';
	// 	  } else {
	// 	    window.alert('Directions request failed due to ' + status);
	// 	  }
	// 	});
	// }
}
google.maps.event.addDomListener(window, 'load', initialize);

