[![Build Status](https://travis-ci.org/mapbox/geojson-tidy.png)](https://travis-ci.org/mapbox/geojson-tidy)

# geojson-tidy

Filter out noisy points from an input geojson linestring based on:
- Minumum sampling time between successive points (Default: 5 seconds)
- Miniumum distance between successive points (Default: 10 metres)

### install

    npm install geojson-tidy

### usage

```js
var geojsonTidy = require('geojson-tidy');

var tidyLineString = geojsonTidy.geometry(obj, [options]);
```

### cli

```js
node -e 
```

###Input

## api

### `geojsonTidy.geometry(obj, [options])`

Given a geojson object, return contains a tidy geometry with extra points filtered out based on default settings

### options

Allows you to set custom values for the filter

```js
{
            minDx: 7,   // Minimum distance between points in metres
            minTx: 5    // Minimum time interval between points in seconds
        }
```
        
        