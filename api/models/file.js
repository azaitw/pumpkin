/**
 * Brand
 *
 * @module      :: Model
 * @description :: Brand's 
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var file = {
    attributes: {
        brand: {
            model: 'brand'
        },
        id: {
            type: 'integer',
            primaryKey: true,
            required: true,
            autoIncrement: true
        },
        fd: 'string',
        size: 'string',
        type: 'string',
        filename: 'string',
        status: 'string',
        field: 'string',
        extra: 'string',
        published: {
            type: 'boolean',
            defaultsTo: false
        },
        url: 'string'
    },
    beforeCreate: function (values, next) {
        // For debugging
        next();
    }
};

module.exports = file;