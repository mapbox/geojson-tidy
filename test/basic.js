var geojsonTidy = require('../'),
    test = require('tape'),
    walk1Json = require('./walk-1.json'),
    walk2Json = require('./walk-2.json'); // has no timestamps

test('geojson tidy', function(t) {
    
//    t.test('Output not equal to input', function(t) {
//        t.notEqual(geojsonTidy.tidy(walk1Json), true);
//        t.end();
//    });
    
    t.test('Tidy walk with timestamps', function(t) {
        t.equal(geojsonTidy.tidy(walk1Json), true);
        t.end();
    });
    
    t.test('Tidy walk without timestamps', function(t) {
        t.equal(geojsonTidy.tidy(walk2Json), true);
        t.end();
    });
    
    t.end();
});