var haversine = require('haversine');

module.exports.tidy = tidy;

// Public function

function tidy(geojson, options) {

    options = options || {};

    // Set the minimum distance in metres and time interval in seconds between successive coordinates
    var filter = {
        minimumDistance: options.minimumDistance || 0,
        minimumTime: options.minimumTime || 0,
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
            "coordTimes": [],
            'indices': []
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

        var lineString = geojson.features[featureIndex].geometry.coordinates,
            timeStamp = geojson.features[featureIndex].properties.coordTimes;
        

        tidyOutput.features.push(clone(emptyFeature));

        // Loop through the coordinate array of the noisy linestring and build a tidy linestring
        // var tidyPoints = [];
        // var tidyTimestamps = [];
        var keepIdxs = [];

        for (var i = 0; i < lineString.length; i++) {

            // Add first and last points
            if (i === 0 || i == lineString.length - 1) {
                keepIdxs.push(i);
                continue;
            }

            // Calculate distance between this point and the last point we included
            var point1 = {
                latitude: lineString[keepIdxs[keepIdxs.length - 1]][1],
                longitude: lineString[keepIdxs[keepIdxs.length - 1]][0]
            };
            var point2 = {
                latitude: lineString[i][1],
                longitude: lineString[i][0]
            };

            var Dx = haversine(point1, point2, {
                unit: 'km'
            }) * 1000;

            // Skip point if its too close to each other
            if (Dx < filter.minimumDistance) {
                console.log(`Skipping point ${i} as distance is ${Dx}`)
                continue;
            }

            // Calculate sampling time diference between successive points in seconds
            if (timeStamp) {

                var time1 = new Date(timeStamp[keepIdxs[keepIdxs.length - 1]]);
                var time2 = new Date(timeStamp[i]);

                var Tx = (time2 - time1) / 1000;

                // Skip point if sampled to close to each other
                if (Tx < filter.minimumTime) {
                    console.log(`Skipping point ${i} as time is ${Tx}`)
                    continue;
                }

            }

            console.log(`Keeping point ${i}. Distance: ${Dx}, time: ${Tx}`)
            console.log(`Point ${i}: ${lineString[i]}`)
            keepIdxs.push(i)
        }


        // If we have < maximumPoints points, just return the entire set
        if (keepIdxs.length <= filter.maximumPoints) {
            console.log("Keeping all points left after time/distance filtering")
        } else {
            console.log("Tidy points length exceeded max")
            console.log("Length before filtering: ", keepIdxs.length)
            // Subsample keepIdxs so that we only keep < maxLength points
            // by randomly removing points until we hit maxLength

            // Split off the first and last indices as we always want to keep these
            const firstIdx = keepIdxs[0]
            const lastIdx = keepIdxs[keepIdxs.length - 1]
            keepIdxs = keepIdxs.slice(1, -2)
            
            // until we hit the desired length:
            while (keepIdxs.length > (filter.maximumPoints - 2)) {
                // randomly select one of the elements to remove
                removeIdx = Math.floor(Math.random() * keepIdxs.length)
                keepIdxs = keepIdxs.filter((element, index) => index !== removeIdx)
            }
            keepIdxs = [firstIdx, ...keepIdxs, lastIdx]
            console.log("Length after filtering: ", keepIdxs.length)
        }

        // Now that we know which indices we want to keep, save the corresponding points
        keepIdxs.forEach(function (item, index) {
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[item]);
            // for validation purposes, record the index as well
            tidyOutput.features[tidyOutput.features.length - 1].properties.indices.push(item);
            if (timeStamp) {
                tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[item]);
            }
          });
    
        continue;
    }

    // DEBUG
    // console.log(JSON.stringify(tidyOutput));

    // Your tidy geojson is served
    return tidyOutput;

}