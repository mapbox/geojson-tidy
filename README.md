[![Build Status](https://travis-ci.org/mapbox/geojson-tidy.png)](https://travis-ci.org/mapbox/geojson-tidy)

# geojson-tidy

Create a tidy geojson by resmapling points in the feature based on sampling time and distance. Handy when geometries that have been converted from a noisy GPS/GPX output.
- Set a minimum  sampling time between successive points (Default: 5 seconds)
- Set a minimum distance between successive points (Default: 10 metres)
- Set a maximum feature length to split long segments (Default: 100 points)

![untitled](https://cloud.githubusercontent.com/assets/126868/8111925/96012394-1032-11e5-9e9e-069746f4dcc9.gif)

### install

    npm install geojson-tidy

### usage

```js
var geojsonTidy = require('geojson-tidy');

var tidyLineString = geojsonTidy.geometry(obj, [options]);
```

###input
Any geojson file from [togeojson](https://github.com/mapbox/togeojson) is a valid input for geojson-tidy. Only LineString features are processed currently.

The timestamp array for the trackpoints need to be stored stored in `features[].properties.coordTimes[]`. Both [Unix time](https://en.wikipedia.org/wiki/Unix_time) or Strings in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) are accepted.

###output
The default output is a geojson `FeatureCollection` with the timestamps stored in the `ccordTimes[]` property

```
{
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
}
```

To use with the Mapbox [matchstick](https://github.com/mapbox/matchstick), you would want to generate only a single feature by using the `{"output":"Feature"}` option

## API

### `geojsonTidy.geometry(obj, [options])`

Given a geojson object, return contains a tidy geometry with extra points filtered out based on default settings

### options

Allows you to set custom values for the filter

```js
{
    minimumDistance: 10, // Minimum distance between points in metres
    minimumTime: 5,      // Minimum time interval between points in seconds
    maximumPoints: 100   // Maximum points in a feature
}
```

## CLI
```
./geojson-tidy -h
Usage: geojson-tidy [-d minimum distance between points] [-t minimum sample time between points] [-m maximum number of points in a single line feature] FILE
```

**Example**

`./geojson-tidy test/wal-1.json -d 10 -t 5 -m 100 > output.json `


## Algorithm
1. Read a geojson FeatureCollection
2. Loop through the features for LineString features
3. Compare successive coordinates of the feature
4. If the dinstance between the points or timestamp difference is too small, delete it
5. Write a tidied geojson FeatureCollection with reduced points
        