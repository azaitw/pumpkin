/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require('bcrypt-nodejs');
var user = {
    attributes: {
        email: {
            type: 'email',
            required: true,
            unique: true,
            primaryKey: true
        },
        password: {
            type: 'string',
            required: true
        },
        name: 'string',
        phone: 'string',
        defaultBrand: 'string',
        language: {
            type: 'string',
            defaultsTo: 'zh_tw'
        }
    },
    beforeCreate: function (values, next) {
        bcrypt.hash(values.password, null, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
       });
    }
};
module.exports = user;