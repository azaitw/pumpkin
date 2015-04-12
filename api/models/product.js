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
        sex: 'string',
        size: 'string',
        price: 'string',
        sale: 'string',
        specs: 'array',
        spec1: 'string',
        spec2: 'string',
        spec3: 'string',
        spec4: 'string',
        spec5: 'string',
        spec6: 'string',
        spec7: 'string',
        spec8: 'string',
        spec9: 'string',
        spec10: 'string'
    }
};
module.exports = product;