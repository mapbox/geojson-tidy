var geojsonTidy = require('../'),
    test = require('tape'),
    walk1Json = require('./walk-1.json'),
    walk2Json = require('./walk-2.json');

test('geojson tidy', function(t) {
    
    t.test('Walk 1', function(t) {
        t.equal(geojsonTidy.tidy(walk1Json), true);
        t.end();
    });
    
    t.test('Walk 2', function(t) {
        t.equal(geojsonTidy.tidy(walk2Json), true);
        t.end();
    });
    
    t.end();
});