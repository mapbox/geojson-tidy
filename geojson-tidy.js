var haversine = require('haversine');

module.exports.tidy = tidy;

function distanceBetween(a, b) {
    return haversine({
        longitude: a[0], latitude: a[1]
    }, {
        longitude: b[0], latitude: b[1]
    }, {  unit: 'km' }) * 1000;
}

function timeBetween(a, b) {
    return (new Date(b) - new Date(a)) / 1000;
}

// Public function
function tidy(geojson, options) {

    var minimumDistance = !options || options.minimumDistance === undefined ? 10 : options.minimumDistance;
    var minimumTime = !options || options.minimumTime === undefined ? 5 : options.minimumTime;
    var maximumPoints = !options || options.maximumPoints === undefined ? 100 : options.maximumPoints;

    // Create the tidy output feature collection
    return {
        type: 'FeatureCollection',
        features: geojson.features
            .filter(function (feature) {
                return feature.geometry.type === 'LineString'
            })
            .reduce(function (memo, feature) {
                var coords = feature.geometry.coordinates.slice(1, -1);
                var times = (feature.properties.coordTimes || []).slice(1, -1);

                return memo.concat([0]
                    .concat(coords.map(function (a, i, arr) {
                        var b = arr[i + 1];
                        if (b && (distanceBetween(a, b) >= minimumDistance) &&
                            (!times || timeBetween(times[i], times[i + 1]) >= minimumTime)) {
                            return i;
                        }
                    }).filter(function (i) {
                        return i !== undefined;
                    }))
                    .concat([coords.length - 1])
                    .reduce(function (memo, idx) {
                        if (memo[memo.length - 1].length > maximumPoints) {
                            memo.push([]);
                        }
                        memo[memo.length - 1].push(idx);
                        return memo;
                    }, [[]])
                    .map(function (indexes) {
                        return {
                            type: 'Feature',
                            properties: {
                                coordTimes: times.length ? indexes.map(function (idx) {
                                    return times[idx];
                                }) : []
                            },
                            geometry: {
                                type: 'LineString',
                                coordinates: indexes.map(function (idx) {
                                    return coords[idx];
                                })
                            }
                        };
                    }));
            }, [])
    };
}
