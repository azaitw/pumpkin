/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var product = {
    attributes: {
        productName: {
            type: 'string',
            required: true
        },
        brand: {
            model: 'brand'
        },
        type: {
            type: 'string',
            required: true
        },
        images: 'array',
        retail: 'string',
        sale: 'string',
        onSale: 'boolean',
        shipping: 'string',
        categories: 'array'
    }
};
module.exports = product;