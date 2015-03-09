/* global describe, it */

var renderService = require('../../../api/services/renderService.js');
var dateTimeService = require('../../../api/services/dateTimeService.js');
var sinon = require('sinon');
var assert = require('assert');

describe('services/renderService', function() {
    var res = {
        render: function (key, data) {
            return data;
        }
    };
    sinon.mock(res);
    
    it('.html should inject partials and specified params', function (done) {
        var params = {
            title: 'test title',
            desc: 'test desc'
        };
        var result;
        var expected = {
            partials: {
                head: 'head',
                css: 'lib/css',
                script: 'lib/script',
                sourceDecoration: 'lib/sourceDecoration',
                header: 'header',
                footer: 'footer',
                body: 'test'
            },
            title: 'test title',
            desc: 'test desc',
            time: {}
        };
        result = renderService.html(res, 'test', params);
        assert.deepEqual(result, expected);
        done();
    });
    it('.email should inject partials', function (done) {
        var params = {
            title: 'test title',
            desc: 'test desc',
            email: 'test email'
        };
        var result;
        var expected = {
            title: 'test title',
            desc: 'test desc',
            email: 'test email'
        };
        result = renderService.email(res, 'test', params);
        assert.deepEqual(result, expected);
        done();
    });
    it('.renderHtml should inject partials and specified params', function (done) {
        var params = {
            templates: {
                header: 'myheader'
            },
            title: 'test title'
        };
        var result;
        var expected = {
            partials: {
                css: 'lib/css',
                script: 'lib/script',
                header: 'myheader',
                footer: 'footer',
                sourceDecoration: 'lib/sourceDecoration',
                body: 'lib/form'
            },
            title: 'test title',
            time: {}
        };
        result = renderService.renderHtml(res, params);
        assert.deepEqual(result, expected);
        done();
    });
    it('.renderHtml should apply default header and footer when not specified', function (done) {
        var params = {
            title: 'test title'
        };
        var result;
        result = renderService.renderHtml(res, params);
        assert.equal(result.partials.header, 'header');
        assert.equal(result.partials.footer, 'footer');
        done();
    });
    it('.renderHtml should apply specified header and footer', function (done) {
        var params = {
            templates: {
                header: 'myheader',
                footer: 'myfooter'
            },
            title: 'test title',
            time: {}
        };
        var result;
        result = renderService.renderHtml(res, params);
        assert.equal(result.partials.header, 'myheader');
        assert.equal(result.partials.footer, 'myfooter');
        done();
    });
});