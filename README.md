# Places Search
[Live Link][live]

[live]: http://katamartin.github.io/GoogleMapsPlaces/index.html

## Summary

A query box with fields for search term, open constraints, and ordering
preference is displayed on the left. The map on the right is centered around the
the geolocation of the user if one is available, otherwise the map centers on
San Francisco. A `#textSearch` called on an instance of
`google.maps.places.PlacesService` using the Google Maps
[Places Library][library].

[library]: https://developers.google.com/maps/documentation/javascript/places

### Query Building

Whenever a change in the form is detected, using jQuery, these events are
handled with the `Map.newQuery` method:
```
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

```
The query is always performed on the area within 500 meters of either the
detected geolocation or the central coordinates of San Francisco, not bounds of
the map as those are subject to change with arbitrary query results.
