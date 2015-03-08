var user = require('../../../api/models/user.js');
var sinon = require('sinon');
var assert = require('assert');

describe('/models/user', function() {
    it('.beforeCreate should encrypt pasword', function (done) {
        var mockData = {
            name: 'azai',
            password: 'password'
        };
        user.beforeCreate(mockData, function (err, D) {
            assert.notEqual(mockData.password, 'password');
            done();
        });
    });

});