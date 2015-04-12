/**
 * Product
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var productGroup = {
    attributes: {
        brand: {
            model: 'brand'
        },
        id: {
            type: 'integer',
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: 'string',
            required: true
        },
        description: 'string',
        images: 'array',
        products: 'array'
    }
};
module.exports = productGroup;