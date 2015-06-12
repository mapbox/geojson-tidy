var geojsonTidy = require('../'),
    test = require('tape'),
    fs = require('fs'),
    //    fs = require('fs'),
    walk1Json = require('./walk-1.json'),
    walk2Json = require('./walk-2.json'), // has no timestamps
    walk1JsonTidy = require('./walk-1-tidy.json'),
    walk2JsonTidy = require('./walk-2-tidy.json');
    walk1JsonTidyFeature = require('./walk-1-resampled.json');

test('geojson tidy', function (t) {

    t.test('Process a feature collection with timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk1Json), JSON.stringify(walk1JsonTidy));
        t.end();
    });

    t.test('Process a feature collection without timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk2Json), JSON.stringify(walk2JsonTidy));
        t.end();
    });

    t.test('Process a feature collection with custom minimumDistance minimumTime and maximumPoints', function (t) {
        t.equal(geojsonTidy.tidy(walk1Json, {
            "minimumDistance": 20,
            "minimumTime": 7,
            "maximumPoints": 10
        }), JSON.stringify(walk1JsonTidyFeature));
        t.end();
    });

    t.end();
});

// Test map matching
// curl -X POST -d @test/walk-2-feature.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"