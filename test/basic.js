var geojsonTidy = require('../'),
    test = require('tape'),
    walkingJson = require('./walking-route.json');

test('geojson tidy', function(t) {
    
    t.test('Defult 7m filter', function(t) {
        t.equal(geojsonTidy.filter(walkingJson), true);
        t.end();
    });
    
    t.test('5m filter', function(t) {
        t.equal(geojsonTidy.filter(walkingJson, {minDistance : 5}), true);
        t.end();
    });
    
    t.test('20m filter', function(t) {
        t.equal(geojsonTidy.filter(walkingJson, {minDistance : 20}), true);
        t.end();
    });
    
    t.end();
});