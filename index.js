var extend = require('extend'),
    haversine = require('haversine');

module.exports.filter = filter;

// Filter the input geojson 
function filter(geojson, options) {

    var lineString = geojson.features[0].geometry.coordinates,
        tidyLineString = [];

    // Set the minimum distance in metres and displacement in 10 seconds between successive coordinates
    var defaults = {
        minDistance : 7 ,
    }
    var filter = extend(defaults, options);

    // Loop through the coordinate array of the line to determine distance between consecutive points
    for (var i = 0; i < lineString.length - 1; i++) {

        var point1 = {
            latitude: lineString[i][1],
            longitude: lineString[i][0]
        }
        var point2 = {
            latitude: lineString[i + 1][1],
            longitude: lineString[i + 1][0]
        }

        // Calculate haversine distance between 2 points in metres
        distance12 = haversine(point1, point2, {
            unit: 'km'
        }) * 1000;

//        console.log(distance12);

        // 
        if (distance12 > filter.minDistance) {
            tidyLineString.push(lineString[i]);
        }

    }

    // Tidy output
    console.log("Input points: " + lineString.length + "\nOutput points: " + tidyLineString.length+"\n");

    return true;

}