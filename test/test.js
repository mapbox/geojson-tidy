var geojsonTidy = require('../'),
    test = require('tape');

// Mock Math.random() to return a fixed value so we get repeatable sampling
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

test('geojson tidy', function (t) {

    t.test('Process a feature collection without timestamps', function (t) {
        t.deepEqual(
            geojsonTidy.tidy(require('./walk-2.json'), {
                minimumDistance: 10,
                minimumTime: 5,
                maximumPoints: 500     // Set this high to avoid random sampling which confuses comparisons
            }),
            require('./walk-2-tidy.json')
        );
        t.end();
    });

    t.test('Process a feature collection with timestamps', function (t) {
        t.deepEqual(
            geojsonTidy.tidy(require('./walk-1.json'), {
                minimumDistance: 10,
                minimumTime: 5,
                maximumPoints: 500     // Set this high to avoid random sampling which confuses comparisons
            }),
            require('./walk-1-tidy.json')
        );
        t.end();
    });

    t.test('Process a feature collection with custom minimumDistance, minimumTime and maximumPoints', function (t) {
        t.deepEqual(
            geojsonTidy.tidy(require('./walk-1.json'), {
                "minimumDistance": 20,
                "minimumTime": 7,
                "maximumPoints": 10
            }),
            require('./walk-1-resampled.json')
        );
        t.end();
    });

    t.test('Process a feature collection with multiple features', function (t) {
        t.deepEqual(
            JSON.stringify(geojsonTidy.tidy(require('./cross-country.json'), {
                minimumDistance: 10,
                minimumTime: 5,
                maximumPoints: 100     // Set this high to avoid random sampling which confuses comparisons
            })),
            JSON.stringify(require('./cross-country-tidy.json'))
        );
        t.end();
    });

    t.end();
});