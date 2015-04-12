/**
 * Order
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var order = {
    attributes: {
        brand: {
            model: 'brand'
        },
        customer: {
            model: 'customer'
        },
        orderNumber: {
            type: 'string',
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        items: {
            type: 'array',
            required: true
        },
        recipient: {
            type: 'string',
            required: true
        },
        phone: {
            type: 'string',
            required: true
        },
        zip: 'string',
        address: 'string',
        country: 'string',
        sum: 'string',
        shipping: 'string',
        subtotal: 'string',
        status: 'string',
        note: 'string'
    }
};
module.exports = order;