var haversine = require('haversine');

module.exports.filter = filter;

// Filter the input geojson 
function filter(geojson) {

    var lineString = geojson.features[0].geometry.coordinates;

    // Loop through the coordinate array of the line to determine distance between consecutive points
    for (var i = 0; i < lineString.length-1; i++) {

        var point1 = {
            latitude: lineString[i][1],
            longitude: lineString[i][0]
        }
        var point2 = {
            latitude: lineString[i+1][1],
            longitude: lineString[i+1][0]
        }
        
        // Calculate haversine distance between 2 points in metres
        console.log(haversine(point1, point2, {unit: 'km'}) * 1000);
    }

    return true;

}