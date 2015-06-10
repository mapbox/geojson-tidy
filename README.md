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

Given a Geometry object, return contains a clean geometry with extra points filtered out. Invalid input will return `null`.


