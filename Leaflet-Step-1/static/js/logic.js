var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

var map = L.map("map-id", {
    center: [40, -94],
    zoom: 3
});

lightmap.addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function(data){


    function Mapping(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: Coloring(feature.properties.mag),
            radius: RadiusSize(feature.properties.mag),
            stroke: true,
            weight: 0.5  

        };
    }

        // Create a function to put the color type
    function Coloring(magnitude) {
        switch(true) {
        case magnitude > 7:
            return "black";
        case magnitude > 6:
            return "purple";
        case magnitude > 5:
            return "red";
        case magnitude > 4:
            return "orange";
        case magnitude > 3:
            return "yellow";
        case magnitude > 2:
            return "green";
        case magnitude > 1:
            return "blue";
        default:
            return "gray";
        }
    }

    //Radius size
    function RadiusSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 2;

    }

    //GeoJSON layer

    L.geoJson(data, {
        //circle marker
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },

        // style of the circle marker
        style: Mapping,

        //the pop up
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br>Location: " + feature.properties.place);

        }

    }).addTo(map);

    //legend
    var legend = L.control({
        position: "bottomright"
    });

    // add legend details
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var magGrades = [0,1,2,3,4,5,6,7]
        var colors = ["gray", "blue", "green", "yellow", "orange", "red","purple","black"];

        // loop thru-generate the colors
        for (var x = 0 ; x < magGrades.length; x++) {
            div.innerHTML +="<i style='background: " + colors[x] + "'></i> " + colors[x] + " "+ magGrades[x] + (magGrades[x + 1] ? '-' + magGrades[x + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);


});