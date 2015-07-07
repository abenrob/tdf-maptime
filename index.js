// [toGeoJSON](https://github.com/mapbox/togeojson) transforms
// GPX files into [GeoJSON](http://geojson.org/),
// readable by [Mapbox.js](https://www.mapbox.com/mapbox.js/) and other
// open source tools.
var gpx2geojson = require('togeojson').gpx;

// [Chroniton](http://github.com/tmcw/chroniton) gives us a time slider for time-based data
var chroniton = require('chroniton');

// [d3](http://d3js.org/) draws the graphs that go alongside the map,
// for elevation and heart rate
var d3 = require('d3');

L.mapbox.accessToken = 'pk.eyJ1IjoiYWJlbnJvYiIsImEiOiJEYmh3WWNJIn0.fus8CLBKPBHDvSxiayhJyg';


// GPX lookup array
var stages = ["MapMyTrack-Route-Tour-de-Force-2015Stage-01UtrechtPrologue.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-02Utrecht-Zeland.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-03Anvers-Huy-.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-04Seraing-Cambrai.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-05Arras-Amiens.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-06Abbeville-Le-Harve.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-07Livarot-Fougeres.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-08Rennes-MurdeBretagne.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-09Vannes-Plumelec.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-10Tarbes-LaPierreSaintMartin.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-11Pau-Cauterets.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-12Lannemezan-Plateau-de-Beille.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-13Muret-Rodez.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-14Rodez-Mende.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-15Mende-Valence.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-16BourgdePeage-Gap.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-17DignelesBains-Pra-Loup.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-18Gap-SaintJeandeMaurienne.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-19SaintJeandeMaurienne-La-Toussuire.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-20Modane-Valfrejus-Alpe-dHuez.gpx",
"MapMyTrack-Route-Tour-de-Force-2015Stage-21Sevres-ParisChampsElysees.gpx"]

// resuseable function so we can re-call for each stage
function buildPage(stage){

    // clear the contianer so we have a clean slate
    d3.select('.container').html("");
    
    // add the current stage to the top of the container
    d3.select('.container')
        .append('div')
        .attr('class','stage')
        .text('Stage '+stage);

    // add the down botton
    d3.select('.container')
        .append('div')
        .attr('class','control-down')
        .text("down")
        .on("click", function(){
            changeStage('down')
        });
        
    // add the up botton
    d3.select('.container')
        .append('div')
        .attr('class','control-up')
        .text("up")
        .on("click", function(){
            changeStage('up')
        });

    // Load the GPX file with d3's xml method.
    var urlRoot = 'https://raw.githubusercontent.com/MaptimeAlpes/tour-de-france-2015/master/data/gpx/';
    d3.text(urlRoot+stages[stage-1], function(str) {

        var dom = (new DOMParser()).parseFromString(str, 'text/xml');
        // # Data Conversion
        //
        // Convert the GPX file to GeoJSON using toGeoJSON
        var geojson = gpx2geojson(dom);     

        // prop up our initial map, using tiles from [Mapbox](https://www.mapbox.com/)
        var map = L.mapbox.map(d3.select('.container')
            .append('div')
            .attr('id', 'map')
            .node(), 'abenrob.ml33j7da');

        // Create shortcuts to properties and coordinates as `props` and
        // `coords`, and then resolve focused arrays of dates versus
        // places and heart rates
        var props = geojson.features[0].properties,
            coords = geojson.features[0].geometry.coordinates,
            // Create an array of `[date, position, heart rate]` that
            // we will use to power charts and interactions.
            datePlaceEl = props.coordTimes.map(function(d, i) {
                return [new Date(d), coords[i], coords[i][2]];
            }),
            // Create a generalized getter creator: this is a function
            // that takes an key and returns a function that gets
            // that key from a given object.
            getter = function(n) { return function(_) { return _[n]; }; },
            getDate = getter(0),
            getEl = getter(2),
            // Create a bisector function that helps us go from a place
            // on the chroniton slider to a place in time.
            bisectPlace = d3.bisector(function(d) { return d[0]; }).left,
            timeDomain = d3.extent(datePlaceEl, getDate);


        // # Adding Map Layers
        //
        // First: add a white casing layer that surrounds the path and makes
        // it easier to differntiate from the surrounding map
        var casingLayer = L.geoJson(geojson, {
            style: function() { return { weight: 5, color: '#fff', opacity: 1 }; }
        }).addTo(map);

        // And then add the run layer. This is a layer of short LineString
        // segments, and we color each one its own special hue by using the
        // `heartRateColor` scale we created before.
        var tdfLayer = L.geoJson(geojson, {
            style: function(feature) {
                return {
                    weight: 2,
                    opacity: 1,
                    color: '#000000'
                };
            }
        }).addTo(map);

        // A marker that follows the runner's position when the time changes
        var hereMarker = L.circleMarker(L.latLng(0, 0), {
            color: 'black', weight: .5, opacity: 1,
            fillColor: 'yellow', fillOpacity: 1, radius: 5
        }).addTo(map);

        map.fitBounds(tdfLayer.getBounds());
        var initZoom = map.getZoom();

        // # The Slider
        //
        // Here we use [chroniton](http://github.com/tmcw/chroniton) to navigate
        // through time.

         var sWidth = 660; //700 - 20 - 20
        var slider = chroniton()
          .domain(timeDomain)
          // A custom label format shows time elapsed since the beginning of the
          // run (`timeDomain[0]`) rather than absolute time.
          .labelFormat(function(d) {
              return d3.time.format('%M:%S')(new Date(+d - timeDomain[0]));
          })
          .width(sWidth);
          // .playButton(true)
          // .playbackRate(rate);

        // When the slider moves, use d3.bisect to find the right place
        // for the map's location indicator to move as well.
        slider.on('change.place', function(d) {
              var datum = datePlaceEl[bisectPlace(datePlaceEl, d)];
              var ll = L.latLng(datum[1][1], datum[1][0]);
              hereMarker.setLatLng(ll);
              if (d !== timeDomain[0]){
                map.setView(ll, initZoom > 12 ? initZoom : 13, {animate: false});
              }
        });

        var margin = {};
        margin.right = 20;
        margin.left = 20;
        margin.bottom = 0;
        margin.top = 20;

        // Use the slider's width, scale, and margins to position the area graph for elevation 
        // in the right position and sync them to user input.
        var height = 80;
        var width = sWidth - margin.left - margin.right;
        var x = d3.scale.linear()
            .domain(timeDomain)
            .range([0, width]);
        var elevation = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(datePlaceEl, function(d) {
                return d[1][2];
            })]);

        // Create an area generator for elevation.
        var elevationLine = d3.svg.area()
            .x(function(d) { 
                return x(d[0]); 
            })
            .y0(height)
            .y1(function(d) { return elevation(d[1][2]); });

        // Create the SVG element and group within it where the charts will live.
        var svg = d3.select('.container').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // Append the paths for the elevation and area charts, within the
        // same element, as well as the label and connector that displays
        // the current elevation
        svg.append('path')
            .datum(datePlaceEl)
            .attr('class', 'elevation-area')
            .attr('d', elevationLine);

        var label = svg.append('text')
            .attr('text-anchor', 'middle');

        var connector = svg.append('rect')
            .attr('width', 1)
            .attr('class', 'elevation-indicator')
            .attr('height', height);

        // Hove the label and indicator line on the charts whenever
        // the slider moves.
        slider.on('change.el', function(d) {
            var datum = datePlaceEl[bisectPlace(datePlaceEl, d)];
            label
                .attr('transform', 'translate(' + [x(d), -5] + ')')
                .text(Math.round(getEl(datum)) + ' m');
            connector
                .attr('transform', 'translate(' + [x(d) - 1, 0] + ')');
        });

        // Append the slider element to the page.
        d3.select('.container')
            .append('div')
            .call(slider);
    })
}


var changeStage = function(upordown){
    var targetStage;
    var currentStage = parseInt(hashStage);
    if (currentStage == stages.length && upordown == 'up'){
        targetStage = 1;
    } else if (currentStage == 1 && upordown == 'down'){
        targetStage = stages.length;
    } else {
        targetStage = (upordown == 'up') ? currentStage + 1 : currentStage - 1
    }

    location.hash = targetStage;
    location.reload();
}

// see if there is a number from 1-21 in the hash, use it to build page
var hashStage = location.hash.slice(1)
if (!isNaN(hashStage) && hashStage <= stages.length && hashStage > 1){
    buildPage(parseInt(hashStage));
} else {
    location.hash = 1;
    hashStage = 1;
    buildPage(1);
}
