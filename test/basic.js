var geojsonTidy = require('../'),
    test = require('tape'),
    //    fs = require('fs'),
    walk1Json = require('./walk-1.json'),
    walk2Json = require('./walk-2.json'), // has no timestamps
    walk1JsonTidy = require('./walk-1-tidy.json'),
    walk2JsonTidy = require('./walk-2-tidy.json'); 

test('geojson tidy', function (t) {

    t.test('Can process a geometry with timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk1Json), JSON.stringify(walk1JsonTidy));
        t.end();
    });

    t.test('Can process a geometry without timestamps', function (t) {
        t.equal(geojsonTidy.tidy(walk2Json), JSON.stringify(walk2JsonTidy));
        t.end();
    });

    t.end();
});