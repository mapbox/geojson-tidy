[![Build Status](https://travis-ci.org/mapbox/geojson-tidy.png)](https://travis-ci.org/mapbox/geojson-tidy)

# geojson-tidy

Filter out noisy points from an input geojson lineString feature based on:
- Minumum sampling time between successive points (Default: 5 seconds)
- Miniumum distance between successive points (Default: 10 metres)

![untitled](https://cloud.githubusercontent.com/assets/126868/8111925/96012394-1032-11e5-9e9e-069746f4dcc9.gif)

### install

    npm install geojson-tidy

### usage

```js
var geojsonTidy = require('geojson-tidy');

var tidyLineString = geojsonTidy.geometry(obj, [options]);
```

###input
Any geojson output file from [togeojson](https://github.com/mapbox/togeojson) is a valid input for geojson-tidy. However only the first feature in the feature collection is processed currently. 

The timestamp array for the trackpoints need to be stored stored in `features[].properties.coordTimes[]`. Both [Unix time](https://en.wikipedia.org/wiki/Unix_time) or Strings in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) are accepted.

###output
The default output is a geojson `FeatureCollection` with the timestamps stored as 

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
        
        