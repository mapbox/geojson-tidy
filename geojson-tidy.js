var haversine = require('haversine');

module.exports.tidy = tidy;

// Public function

function tidy(geojson, options) {

    options = options || {};

    // Set the minimum distance in metres and time interval in seconds between successive coordinates
    var filter = {
        minimumDistance: options.minimumDistance || 10,
        minimumTime: options.minimumTime || 5,
        maximumPoints: options.maximumPoints || 100
    };

    // Create the tidy output feature collection
    var tidyOutput = {
        "type": "FeatureCollection",
        "features": []
    };
    var emptyFeature = {
        "type": "Feature",
        "properties": {
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

    for (var featureIndex = 0; featureIndex < geojson.features.length; featureIndex++) {

        // Skip non LineString features in the collections
        if (geojson.features[featureIndex].geometry.type != 'LineString') {
            continue;
        }

        var lineString = geojson.features[featureIndex].geometry.coordinates;
        var timestamps, coordTimesSupport;
        if(typeof geojson.features[featureIndex].properties.timestamps !== 'undefined'){
          timestamps = geojson.features[featureIndex].properties.timestamps;
        }
        else if(typeof geojson.features[featureIndex].properties.coordTimes !== 'undefined'){
          coordTimesSupport = true;
          timestamps = geojson.features[featureIndex].properties.coordTimes;
        }
        var altitudes, accuracies, altitudeAccuracies, headings, speeds;
        if(typeof geojson.features[featureIndex].properties.altitudes !== 'undefined'){
          altitudes = geojson.features[featureIndex].properties.altitudes;
        }
        if(typeof geojson.features[featureIndex].properties.accuracies !== 'undefined'){
          accuracies = geojson.features[featureIndex].properties.accuracies;
        }
        if(typeof geojson.features[featureIndex].properties.altitudeAccuracies !== 'undefined'){
          altitudeAccuracies = geojson.features[featureIndex].properties.altitudeAccuracies;
        }
        if(typeof geojson.features[featureIndex].properties.headings !== 'undefined'){
          headings = geojson.features[featureIndex].properties.headings;
        }
        if(typeof geojson.features[featureIndex].properties.speeds !== 'undefined'){
          speeds = geojson.features[featureIndex].properties.speeds;
        }


        tidyOutput.features.push(clone(emptyFeature));

        // Loop through the coordinate array of the noisy linestring and build a tidy linestring

        for (var i = 0; i < lineString.length; i++) {

            // Add first and last points
            if (i === 0 || i == lineString.length - 1) {
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timestamps && typeof timestamps[i] !== 'undefined') {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps.push(timestamps[i]);
                }
                if(coordTimesSupport){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes = tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps;
                  if (i == lineString.length - 1) {
                    delete(tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps);
                  }
                }
                if (altitudes) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes.push(altitudes[i]);
                }
                if (accuracies) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies.push(accuracies[i]);
                }
                if (altitudeAccuracies) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies.push(altitudeAccuracies[i]);
                }
                if (headings) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.headings === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.headings = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.headings.push(headings[i]);
                }
                if (speeds) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.speeds === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.speeds = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.speeds.push(speeds[i]);
                }
                continue;
            }

            // Calculate distance between successive points in metres
            var point1 = {
                latitude: lineString[i][1],
                longitude: lineString[i][0]
            };
            var point2 = {
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
            if (timestamps) {

                var time1 = new Date(timestamps[i]);
                var time2 = new Date(timestamps[i + 1]);

                var Tx = (time2 - time1) / 1000;

                // Skip point if sampled to close to each other
                if (Tx < filter.minimumTime) {
                    continue;
                }

            }

            // Copy the point and timestamp to the tidyOutput
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
            if (timestamps && typeof timestamps[i] !== 'undefined') {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps.push(timestamps[i]);
            }
            if(coordTimesSupport){
              tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes = tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps;
            }
            if (altitudes) {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes.push(altitudes[i]);
            }
            if (accuracies) {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies.push(accuracies[i]);
            }
            if (altitudeAccuracies) {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies.push(altitudeAccuracies[i]);
            }
            if (headings) {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.headings === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.headings = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.headings.push(headings[i]);
            }
            if (speeds) {
                if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.speeds === 'undefined'){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.speeds = [];
                }
                tidyOutput.features[tidyOutput.features.length - 1].properties.speeds.push(speeds[i]);
            }

            // If feature exceeds maximum points, start a new feature beginning at the previuos end point
            if (tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.length % filter.maximumPoints === 0) {
                if(coordTimesSupport){
                  delete(tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps);
                }
                tidyOutput.features.push(clone(emptyFeature));
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timestamps && typeof timestamps[i] !== 'undefined') {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps.push(timestamps[i]);
                }
                if(coordTimesSupport){
                  tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes = tidyOutput.features[tidyOutput.features.length - 1].properties.timestamps;
                }
                if (altitudes) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.altitudes.push(altitudes[i]);
                }
                if (accuracies) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.accuracies.push(accuracies[i]);
                }
                if (altitudeAccuracies) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.altitudeAccuracies.push(altitudeAccuracies[i]);
                }
                if (headings) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.headings === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.headings = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.headings.push(headings[i]);
                }
                if (speeds) {
                    if(typeof tidyOutput.features[tidyOutput.features.length - 1].properties.speeds === 'undefined'){
                      tidyOutput.features[tidyOutput.features.length - 1].properties.speeds = [];
                    }
                    tidyOutput.features[tidyOutput.features.length - 1].properties.speeds.push(speeds[i]);
                }
            }
        }
    }

    // DEBUG
    //    console.log(JSON.stringify(tidyOutput));

    // Your tidy geojson is served
    return tidyOutput;

}
