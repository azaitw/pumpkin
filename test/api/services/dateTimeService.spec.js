/* global describe, it */

var dateTimeService = require('../../../api/services/dateTimeService.js');
var assert = require('assert');

describe('services/dateTimeService', function() {
    describe('getDate()', function () {
        it('should return today\'s date', function (done) {
            var actual = dateTimeService.getDate();
            var appendZero = function (I) {
                if (I < 10) {
                    return '0' + I;
                }
                return I;
            };
            var date = new Date();
            var year = date.getFullYear();
            var month = appendZero(date.getMonth() + 1);
            var day  = appendZero(date.getDate());
            var hour = appendZero(date.getHours());
            var min  = appendZero(date.getMinutes());
            var sec  = appendZero(date.getSeconds());
            var expected = year + '-' + month + '-' + day + '_' + hour + ':' + min + ':' + sec;
            assert.equal(actual, expected);
            done();
        });
    });
    describe('getYear()', function () {
        it('should return today\'s year', function (done) {
            var date = new Date();
            var expected = date.getFullYear();
            var actual = dateTimeService.getYear();
            assert.equal(actual, expected);
            done();
        });
    });
    describe('getMonth(format)', function () {
        it('should return today\'s month in number', function (done) {
            var date = new Date();
            var expected = date.getMonth() + 1;
            var actual = dateTimeService.getMonth();
            assert.equal(actual, expected);
            done();
        });
        it('should return today\'s month name with format:name', function (done) {
            var date = new Date();
            var actual = dateTimeService.getMonth({format: 'name'});
            var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var expected = monthName[date.getMonth()];
            assert.equal(actual, expected);
            done();
        });
        it('should return today\'s month name with format:name-abbr', function (done) {
            var date = new Date();
            var actual = dateTimeService.getMonth({format: 'name-abbr'});
            var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            var expected = monthName[date.getMonth()];
            assert.equal(actual, expected);
            done();
        });
        it('should return today\'s month name with format:double-digit', function (done) {
            var date = new Date();
            var actual = dateTimeService.getMonth({format: 'double-digit'});
            var expected = date.getMonth() + 1;
            if (expected < 10) {
                expected = '0' + expected;
            }
            assert.equal(actual, expected);
            done();
        });
    });
    describe('getDay()', function () {
        it('should return today\'s day', function (done) {
            var date = new Date();
            var expected = date.getDate();
            var actual = dateTimeService.getDay();
            assert.equal(actual, expected);
            done();
        });
    });
});