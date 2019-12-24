// add query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    console.log(data.features);
    createMap(data.features);
});

function createMap(eData) {
  console.log(eData);
  //create map
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
  });
  // define background image layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(myMap);

  var earthquakeCoor = [];

  eData.forEach(object => {
  //console.log(object.properties.mag)
  //returns corresponding color depending on the magnitude
  function checkColor(feature) {
    if (feature.properties.mag <= 1) {
        return "#cfff33";
    }
    if (feature.properties.mag <= 2 ) {
        return "#eeff33";
    }
    if (feature.properties.mag <=3 ) {
        return "#ffd633";
    }
    if (feature.properties.mag <=4 ) {
        return "#ff9c33";
    }
    if (feature.properties.mag <= 5) {
        return "#ff6333";
    }
    else {
        return "#ff3333";
    }
  }
  //create radius function to check for negative magnitudes
  function checkRadNeg(feature) {
    if (feature.properties.mag < 0) {
        return 0;
    }
    else {
        return feature.properties.mag * 15000;
    }
  }
  L.circle([object.geometry.coordinates[1], object.geometry.coordinates[0]], {
      color: "black",
      opacity: .2,
      fillColor: checkColor(object),
      fillOpacity: 1,
      radius: checkRadNeg(object)
    }).bindPopup("<h2>" + object.properties.place +
      "</h2><hr><h2>" + new Date(object.properties.time) +
      "</h2><hr><h2>" + "Magnitude: " + object.properties.mag + "</hr>")
      .addTo(myMap);
  })

  function getColor(color) {
    if (color <= 1) {
        return "#cfff33";
    }
    if (color <= 2 ) {
        return "#eeff33";
    }
    if (color <=3 ) {
        return "#ffd633";
    }
    if (color <=4 ) {
        return "#ff9c33";
    }
    if (color <= 5) {
        return "#ff6333";
    }
    else {
        return "#ff3333";
    }
  }
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend'),
          labels = ['<strong>Legend</strong>'];
          grades = [0, 1, 2, 3, 4, 5];
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(myMap);
  };
