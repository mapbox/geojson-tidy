var extend = require('extend'),
    haversine = require('haversine');

module.exports.tidy = tidy;


// Public function

function tidy(geojson, options) {

    // Set the minimum distance in metres and time interval in seconds between successive coordinates
    var defaults = {
            tolerance: 0.0001,
            minimumDistance: 10,
            minimumTime: 5,
            maximumPoints: 100,
            output: "FeatureCollection"
        },
        filter = extend(defaults, options);

    // Create the tidy output feature collection
    var tidyOutput = {
            "type": "FeatureCollection",
            "features": []
        },
        emptyFeature = {
            "type": "Feature",
            "properties": {
                "coordTimes": []
            },
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        };

    // Helper to pass an object by value instead of reference
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //Loop through input features

    for ( var featureIndex = 0; featureIndex < geojson.features.length; featureIndex++) {

        // Skip non LineString features
        if ( geojson.features[featureIndex].geometry.type != 'LineString'){
            continue;
        }

        var simplifiedGeojson = geojson.features[featureIndex],
            lineString = simplifiedGeojson.geometry.coordinates,
            timeStamp = simplifiedGeojson.properties.coordTimes;

        tidyOutput.features.push(clone(emptyFeature));

        // Loop through the coordinate array of the noisy linestring and build a tidy linestring

        for (var i = 0; i < lineString.length; i++) {

            // Add first and last points
            if (i === 0 || i == lineString.length - 1) {
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timeStamp) {
                    tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
                }
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
            if (Dx < filter.minimumDistance) {
                continue;
            }

            // Calculate sampling time diference between successive points in seconds
            if (timeStamp) {
                var time1 = new Date(timeStamp[i]),
                    time2 = new Date(timeStamp[i + 1]),
                    Tx = (time2 - time1) / 1000;

                // Skip point if sampled to close to each other
                if (Tx < filter.minimumTime) {
                    continue;
                }

            }

            // Copy the point and timestamp to the tidyOutput
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
            if (timeStamp) {
                tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
            }

            // If feature exceeds maximum points, start a new feature beginning at the previuos end point
            if (tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.length % filter.maximumPoints === 0) {
                tidyOutput.features.push(clone(emptyFeature));
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timeStamp) {
                    tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
                }
            }
        }
    }

    // DEBUG
    // Stats
    //    console.log(JSON.stringify(tidyOutput));

    // Your tidy geojson is ready!
    return JSON.stringify(tidyOutput);

}