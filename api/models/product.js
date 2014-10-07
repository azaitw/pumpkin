/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var product = {
    attributes: {
        brand: {
            model: 'brand'
        },
        brandName: {
            type: 'string',
            required: true
        },
        productName: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string',
            required: true
        },
        shortDesc: 'string',
        images: 'array',
        retail: 'string',
        sale: 'string',
        onSale: 'boolean',
        shipping: 'string'
    }
};
module.exports = product;