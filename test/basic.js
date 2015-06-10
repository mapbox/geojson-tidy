var geojsonTidy = require('../'),
    test = require('tape'),
    //    fs = require('fs'),
    walk1Json = require('./walk-1.json'),
    walk2Json = require('./walk-2.json'), // has no timestamps
    walk1JsonTidy = require('./walk-1-tidy.json'),
    walk2JsonTidy = require('./walk-2-tidy.json'); 

test('geojson tidy', function (t) {

    //    t.test('Output not equal to input', function(t) {
    //        t.notEqual(geojsonTidy.tidy(walk1Json), true);
    //        t.end();
    //    });

    t.test('Tidy walk with timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk1Json), JSON.stringify(walk1JsonTidy));
        t.end();
    });

    t.test('Tidy walk without timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk2Json), JSON.stringify(walk2JsonTidy));
        t.end();
    });

    t.end();
});