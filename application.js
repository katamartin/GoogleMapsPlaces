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
      var li = this.createResult(place);
      results.appendChild(li);

      var marker = new google.maps.Marker({
        map: this.map,
        title: place.name,
        position: place.geometry.location
      });
      li.addEventListener("mouseover", function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });

      li.addEventListener("mouseout", function() {
        marker.setAnimation(null);
      });

      // Create a marker for each place.
      markers.push(marker);
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

  Map.createResult = function(place) {
    var li = document.createElement("LI");
    var name = document.createElement("B");
    name.appendChild(document.createTextNode(place.name));
    name.appendChild(document.createElement("BR"));
    li.appendChild(name);
    li.appendChild(document.createTextNode(place.formatted_address));
    return li;
  };

  Map.setLocation = function(position) {
    this.center = { lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
    this.map.setCenter(this.center);
  };
})();
