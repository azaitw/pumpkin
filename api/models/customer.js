/**
 * Customer
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var customer = {
    attributes: {
        brand: {
            model: 'brand'
        },
        email: {
            type: 'string',
            required: true,
            primaryKey: true
        },
        customerName: 'string',
        phone: 'string',
        zip: 'string',
        address: 'string',
        country: 'string',
        password: 'string'
    }
};
module.exports = customer;