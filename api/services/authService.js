var bcrypt = require('bcrypt-nodejs');
var Q = require('q');
var validator = require('validator');
var authService = {
    isLoggedIn: function (req) { // TO DO: use cookie for validation
        if (req.session && req.session.credentials) {
            return true;
        }
        return false;
    },
    whoAmI: function (req) {
        if (req.session && req.session.credentials) {
            return req.session.credentials;
        }
        return '';
    }
};
module.exports = authService;