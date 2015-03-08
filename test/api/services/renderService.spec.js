var renderService = require('../../../api/services/renderService.js');
var sinon = require('sinon');
var assert = require('assert');

describe('services/renderService', function() {
    it('.html should inject partials', function (done) {
        var res = {
            render: function (key, data) {
                return data;
            }
        };
        var params = {
            title: 'test title' 
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
            title: 'test title'
        }; 
        sinon.mock(res);
        result = renderService.html(res, 'test', params);
        assert.deepEqual(result, expected);
        done();
    });
});