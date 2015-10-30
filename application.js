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
    $("input").on("keyup", this.newQuery.bind(this));
    $("input").on("change", this.newQuery.bind(this));
    $("select").on("change", this.newQuery.bind(this));

    this.markers = [];

  };

  Map.newQuery = function() {
    var location = new google.maps.LatLng(this.center.lat, this.center.lng);

    var request = {
      location: location,
      radius: '500',
      query: $("#pac-input").val(),
      openNow: $("#open-now").prop('checked'),
      rankBy: this.rankBy($("select").val())
    };

    service = new google.maps.places.PlacesService(this.map);
    service.textSearch(request, function(results, status) {
      this.updateResults(results);
    }.bind(this));

  };

  Map.rankBy = function(str) {
    if (str === "prominence") {
      return google.maps.places.RankBy.PROMINENCE;
    } else {
      return google.maps.places.RankBy.DISTANCE;
    }
  }

  Map.updateResults = function(places) {
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

      this.infowindow = new google.maps.InfoWindow();

      this.infowindow.addListener("closeclick", function() {
        $(".active").removeClass("active");
      });

      li.addEventListener("click", function() {
        this.updateActive(place, li, marker);
      }.bind(this));

      marker.addListener("click", function() {
        this.updateActive(place, li, marker);
        document.getElementById(place.place_id).scrollIntoView({
          block: "end",
          behavior: "smooth"
        });
      }.bind(this));

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

  Map.updateActive = function(place, li, marker) {
    $(".active").removeClass("active");
    li.setAttribute("class", "active");
    this.infowindow.setContent(place.name);
    this.infowindow.open(this.map, marker);
  };

  Map.createResult = function(place) {
    var li = document.createElement("LI");
    var name = document.createElement("B");
    name.appendChild(document.createTextNode(place.name));
    name.appendChild(document.createElement("BR"));
    li.appendChild(name);
    li.appendChild(document.createTextNode(place.formatted_address));
    if (place.opening_hours) {
      var open = document.createElement("B");
      if (place.opening_hours.open_now) {
        open.setAttribute("class", "open");
        open.appendChild(document.createTextNode("Open Now"));
      } else {
        open.setAttribute("class", "closed");
        open.appendChild(document.createTextNode("Closed"));
      }
      li.appendChild(document.createElement("BR"));
      li.appendChild(open);
      li.setAttribute("id", place.place_id)
    }
    return li;
  };

  Map.setLocation = function(position) {
    this.center = { lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
    this.map.setCenter(this.center);
  };
})();
