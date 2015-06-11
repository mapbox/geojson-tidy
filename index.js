var extend = require('extend'),
    haversine = require('haversine');

module.exports.tidy = tidy;


//
// Public function
//

function tidy(geojson, options) {

    var lineString = geojson.features[0].geometry.coordinates,
        timeStamp = geojson.features[0].properties.coordTimes,
        tidyLineString = [[]];

    // Set the minimum distance in metres and time interval in seconds between successive coordinates

    var defaults = {
            minDx: 10,
            minTx: 5
        },
        maxPoints = 100,
        meanDistance = 0,
        useTimeFiltering = false,
        filter = extend(defaults, options);

    // Catch errors

    try {
        // If number of timestamps match number of points, use time filtering
        if (lineString.length == timeStamp.length) {
            useTimeFiltering = true;
        }
    } catch (e) {
        //        console.log("Timestamps don't match or are missing, disabling time based filtering");
    }


    //
    // Loop through the coordinate array of the noisy linestring and build a tidy linestring
    // 

    for (var i = 0; i < lineString.length; i++) {

        // Add first and last points

        if (i === 0 || i == lineString.length - 1) {
            tidyLineString[tidyLineString.length - 1].push(lineString[i]);
            continue;
        }

        // Calculate distance between successive points in metres

        var point1 = {
                latitude: lineString[i][1],
                longitude: lineString[i][0]
            },
            point2 = {
                latitude: lineString[i + 1][1],
                longitude: lineString[i + 1][0]
            };

        var Dx = haversine(point1, point2, {
            unit: 'km'
        }) * 1000;

        // Calculate time difference between successive points in seconds

        var Tx;
        if (useTimeFiltering) {
            var time1 = new Date(timeStamp[i]),
                time2 = new Date(timeStamp[i + 1]),
                Tx = (time2 - time1) / 1000;
        }

        // Make sure the points exceed minimum distance

        if (Dx > filter.minDx) {

            // Filter out points at a smaller time interval than minimum

            if (useTimeFiltering && Tx < filter.minTx) {
                continue;
            } else {
                tidyLineString[tidyLineString.length - 1].push(lineString[i]);
            }

            // WIP: Filter out points which have a greater distance than 1/2 the mean distance as noisy
            //            if (Math.abs(distance12 - meanDistance) < 0.5 * meanDistance) {
            //                tidyLineString.push(lineString[i]);
            //            }
        }

        // If tidylinestring exceeds maximum points, split into a new string with the starting point from the previuos end point

        if (tidyLineString[tidyLineString.length - 1].length % maxPoints === 0) {
            tidyLineString.push([]);
            tidyLineString[tidyLineString.length - 1].push(lineString[i]);
        }
    }


    //
    // Stringify output linestring
    //

    var outputFeatures = [],
        outputPoints = 0;

    for (i = 0; i < tidyLineString.length; i++) {

        outputFeatures.push({
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": tidyLineString[i]
            }
        });

        outputPoints += tidyLineString[i].length;

    }

    var outputFeatureCollection = JSON.stringify({
        "type": "FeatureCollection",
        "features": outputFeatures
    });

    //
    // DEBUG: Print IO stats 
    //
    var outputCompression = (lineString.length - outputPoints) / lineString.length * 100;
    console.log("Input points: " + lineString.length + "\nOutput points: " + outputPoints + "\nCompression:" + outputCompression + "%\n");

    console.log(outputFeatureCollection);
    return outputFeatureCollection;

}