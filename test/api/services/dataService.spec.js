/* global describe, it */

var dataService = require('../../../api/services/dataService.js');
var assert = require('assert');

describe('services/dataService', function() {
    describe('slug()', function () {
        it('should convert to lowercase', function (done) {
            var input = 'Mybrand';
            var expected = 'mybrand';
            var actual = dataService.slug(input);
            assert.equal(actual, expected);
            done();
        });
        it('should remove hyphen in brand name', function (done) {
            var input = 'my-brand';
            var expected = 'mybrand';
            var actual = dataService.slug(input);
            assert.equal(actual, expected);
            done();
        });
        it('should remove space in brand name', function (done) {
            var input = 'my brand';
            var expected = 'mybrand';
            var actual = dataService.slug(input);
            assert.equal(actual, expected);
            done();
        });
    });
    describe('sort()', function () {
        it('should sort an object according to key', function (done) {
            var raw = [
                {
                    name: 1,
                    brand: 2,
                    size: 3
                },
                {
                    name: 2,
                    brand: 3,
                    size: 1
                },
                {
                    name: 3,
                    brand: 1,
                    size: 2
                }
            ];
            var actual = dataService.sort(raw, {key: 'brand'})[0];
            var expected = raw[2];
            assert.equal(actual, expected);
            actual = dataService.sort(raw, {key: 'size'})[0];
            expected = raw[1];
            assert.equal(actual, expected);
            actual = dataService.sort(raw, {key: 'name'})[0];
            expected = raw[0];
            assert.equal(actual, expected);
            done();
        });
    });
});