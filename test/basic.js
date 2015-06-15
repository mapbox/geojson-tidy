var geojsonTidy = require('../'),
    test = require('tape');

test('geojson tidy', function (t) {

    t.test('Process a feature collection without timestamps', function (t) {
        t.equal(
            geojsonTidy.tidy(require('./walk-2.json')),
            JSON.stringify(require('./walk-2-tidy.json'))
        );
        t.end();
    });

    t.test('Process a feature collection with timestamps', function (t) {
        t.equal(
            geojsonTidy.tidy(require('./walk-1.json')),
            JSON.stringify(require('./walk-1-tidy.json'))
        );
        t.end();
    });

    t.test('Process a feature collection with custom minimumDistance minimumTime and maximumPoints', function (t) {
        t.equal(
            geojsonTidy.tidy(require('./walk-1.json'), {
                "minimumDistance": 20,
                "minimumTime": 7,
                "maximumPoints": 10
            }),
            JSON.stringify(require('./walk-1-resampled.json'))
        );
        t.end();
    });

    t.test('Process a feature collection with multiple features', function (t) {
        t.equal(
            geojsonTidy.tidy(require('./cross-country.json')),
            JSON.stringify(require('./cross-country-tidy.json'))
        );
        t.end();
    });

    t.end();
});

// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"