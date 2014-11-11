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
        brandName: {
            type: 'string',
            required: true
        },
        purpose: 'string',
        fd: 'string',
        fd_public: 'string',
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