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
        brandName: {
            type: 'string',
            required: true
        },
        orderNumber: {
            type: 'string',
            required: true
        },
        customer: {
            model: 'customer'
        },
        items: 'JSON',
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
        paymentType: 'string',
        bankCode: 'string',
        bankAccountTail: 'string',
        transferAmount: 'string',
        paymentVerified: 'boolean',
        note: 'string'
    }
};
module.exports = order;