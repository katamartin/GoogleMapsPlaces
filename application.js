(function () {
  if (typeof Map === "undefined") {
    window.Map = {};
  }

  Map.initMap = function() {
    this.center = { lat: 37.7833, lng: -122.4167 };
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: this.center
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setLocation.bind(this));
    }
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    this.searchBox = searchBox;

    this.map.addListener('bounds_changed', function() {
      searchBox.setBounds(this.map.getBounds());
    }.bind(this));

    this.markers = [];
    searchBox.addListener('places_changed', this.updateResults.bind(this));
  };

  Map.updateResults = function() {
    var places = this.searchBox.getPlaces();
    // Clear out the old markers.
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    var results = document.getElementById('results');
    results.innerHTML = "";

    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      results.innerHTML += "<li>" + place.name + "</li>";
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }.bind(this));
    this.markers = markers;
    this.map.fitBounds(bounds);
  };

  Map.setLocation = function(position) {
    this.center = { lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
    this.map.setCenter(this.center);
  };
})();
