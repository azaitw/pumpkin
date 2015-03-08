/* global describe, it */

var user = require('../../../api/models/user.js');
var assert = require('assert');

describe('/models/user', function() {
    it('.beforeCreate should encrypt pasword', function (done) {
        var mockData = {
            name: 'azai',
            password: 'password'
        };
        user.beforeCreate(mockData, function () {
            assert.notEqual(mockData.password, 'password');
            done();
        });
    });

});