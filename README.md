[![Build Status](https://travis-ci.org/mapbox/geojson-tidy.png)](https://travis-ci.org/mapbox/geojson-tidy)

# geojson-tidy

Filter out noisy points from  geojson input.

## usage

    npm install geojson-tidy

## example

```js
var geojsonTidy = require('geojson-tidy');

var tidy = geojsonTidy.geometry(obj);
```

## api

### `geojsonTidy.geometry(obj)`

Given a geojson object, return contains a tidy geometry with extra points filtered out based on default settings

### `geojsonTidy.geometry(obj, options)`

Pass options for the filter settings

```
{
            minDx: 7,   // Minimum distance between points in metres
            minTx: 5    // Minimum time interval between points in seconds
        }
        ```
        
        