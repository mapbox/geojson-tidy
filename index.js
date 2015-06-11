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
        inputPointCount = 0,
        outputPointCount = 0,
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
    // Create the tidy output feature collection
    //

    var tidyOutput = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "coordTimes": []
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            }
        ]
    };

    //
    // Loop through the coordinate array of the noisy linestring and build a tidy linestring
    // 

    for (var i = 0; i < lineString.length; i++) {

        // Add first and last points

        if (i === 0 || i == lineString.length - 1) {
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
            if (useTimeFiltering) {
                tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
            }
            //tidyLineString[tidyLineString.length - 1].push(lineString[i]);
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

        // Skip point if its too close to each other

        if (Dx < filter.minDx) {
            continue;
        }

        // Calculate time difference between successive points in seconds

        if (useTimeFiltering) {
            var time1 = new Date(timeStamp[i]),
                time2 = new Date(timeStamp[i + 1]),
                Tx = (time2 - time1) / 1000;

            // Skip point if sampled to close to each other
            if (Tx < filter.minTx) {
                continue;
            }

        }

        // Copy the point and timestamp to the tidyOutput

        tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
        if (useTimeFiltering) {
            tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
        }

        // WIP: Filter out points which have a greater distance than 1/2 the mean distance as noisy
        //            if (Math.abs(distance12 - meanDistance) < 0.5 * meanDistance) {
        //                tidyLineString.push(lineString[i]);
        //            }


        // If tidylinestring exceeds maximum points, split into a new string with the starting point from the previuos end point

        if (tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.length % maxPoints === 0) {
            tidyOutput.features.push([]);
            console.log(JSON.stringify(tidyOutput));
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
            if (useTimeFiltering) {
                tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
            }
        }
    }

    /*
        //
        // Stringify output linestring
        //

        var outputFeatures = [],
            ;

        for (i = 0; i < tidyLineString.length; i++) {

            outputFeatures.push({
                "type": "Feature",
                "properties": {
                coordTimes: ""
                },
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

    */

    //
    // DEBUG: Print IO stats 
    //
//    var outputCompression = (lineString.length - outputPoints) / lineString.length * 100;
//    console.log("Input points: " + lineString.length + "\nOutput points: " + outputPoints + "\nPoints removed:" + outputCompression + "%\n");

    console.log(JSON.stringify(tidyOutput));
//    return tidyOutput;

}