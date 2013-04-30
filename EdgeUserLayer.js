L.EdgeUserLayer = L.FeatureGroup.extend({
  options: {
    apiUrl: 'http://www.jugglingedge.com/feeds/createjson.php?CallBack=?',
    userID: "404",
    icons:{"juggling":
      L.icon({
        iconUrl: 'icons/conTag_1.png',
        iconSize: [32, 32],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0]
      }),
      "unicycle": L.icon({
        iconUrl: 'icons/conTag_2.png',
        iconSize: [32, 32],
        iconAnchor: [0, 32],
        popupAnchor: [0, 0]
      }),
      "acrobatics": L.icon({
        iconUrl: 'icons/conTag_3.png',
        iconSize: [32, 32],
        iconAnchor: [32, 32],
        popupAnchor: [0, 0]
      })
    },
    latlng: new L.LatLng(50, 4)
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._layers = {};
    // save position of the layer or any options from the constructor
    console.log("init");
    this._ids = {};
    this._loadPoi();
  },

  _poiInfo: function(tags) {
    var r = $('<table>');
    for (key in tags)
      r.append($('<tr>').append($('<th>').text(key)).append($('<td>').text(tags[key])));
    return $('<div>').append(r).html();
  },

  _loadPoi: function () {
    console.log("load Pois");
    var icon = this.options.icons["juggling"];

    $.ajax({
      url: this.options.apiUrl,
      context: { instance: this },
      crossDomain: true,
      dataType: "jsonp",
      data: {Data : "events", UserID : this.options.userID},
      success: function(data) {
        for(i=0;i<data.length;i++) {
          var event = data[i];
          if ((event.Lat == 0) && (event.Lng == 0)) {
            console.log(event.ShortTitle + " has no position");
            continue;
          }
          var pos = new L.LatLng(event.Lat, event.Lng);
          var popup = this.instance._poiInfo(event);
          var marker = new L.Marker(pos, {icon: icon}).bindPopup(popup);
          this.instance.addLayer(marker);
        }
      }
    });
  }

});

//FIXME no idea why the browser crashes with this code
//L.EdgeUserLayer = function (options) {
//  return new L.EdgeUserLayer(options);
//};
