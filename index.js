var extend = require('extend'),
    haversine = require('haversine');

module.exports.filter = filter;

// Filter the input geojson 
function filter(geojson, options) {

    var lineString = geojson.features[0].geometry.coordinates,
        timeStamp = geojson.features[0].properties.coordTimes,
        tidyLineString = [];

    // Set the minimum distance in metres and time interval in seconds between successive coordinates
    var defaults = {
        minDx: 7,
        minTx: 5,
        maxPoints: 100
    }
    var meanDistance = 0,
        useTimeFiltering = false,
        filter = extend(defaults, options);

    try {
        // If number of timestamps match number of points, use time filtering
        if (lineString.length == timeStamp.length) {
            useTimeFiltering = true;
        }
    } catch (e) {
        console.log("Timestamps don't match or are missing, disabling time based filtering");
    }

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

        if (useTimeFiltering) {
            var time1 = new Date(timeStamp[i]),
                time2 = new Date(timeStamp[i + 1])
        }

        // Calculate time difference between successive points in seconds
        Tx = (time2 - time1) / 1000;

        // Calculate haversine distance between 2 points in metres
        Dx = haversine(point1, point2, {
            unit: 'km'
        }) * 1000;

        // Filter out points lesser than minimum distance
        if (Dx > filter.minDx) {

            // Filter out points at a smaller time interval than minimum
            if (useTimeFiltering && Tx < filter.minTx) {
                continue;
            } else {
                tidyLineString.push(lineString[i]);
            }

            // Filter out points which have a greater distance than 1/2 the mean distance as noisy
            //            if (Math.abs(distance12 - meanDistance) < 0.5 * meanDistance) {
            //                tidyLineString.push(lineString[i]);
            //            }
        }

    }

    // Print IO stats
    console.log("Input points: " + lineString.length + "\nOutput points: " + tidyLineString.length + "\n");

    return true;

}