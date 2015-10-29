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
  };

  Map.setLocation = function(position) {
    this.center = { lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
    this.map.setCenter(this.center);
  };
})();
