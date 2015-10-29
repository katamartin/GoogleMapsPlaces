(function () {
  if (typeof Map === "undefined") {
    window.Map = {};
  }

  Map.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: 37.7833, lng: -122.4167 }
    });
  };
})();
