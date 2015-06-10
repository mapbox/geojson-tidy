var geojsonTidy = require('../'),
    test = require('tape'),
    walkingJson = require('./walking-route.json');

test('geojson tidy', function(t) {
    t.test('checks if the function works', function(t) {
        t.equal(geojsonTidy.filter(walkingJson), true);
        t.end();
    });
    t.end();
});