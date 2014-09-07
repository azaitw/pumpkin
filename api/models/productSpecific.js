/**
 * ProductSpecific
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var productSpecific = {
    attributes: {
        brand: {
            type: 'integer',
            required: true
        },
        brandName: {
            type: 'string',
            required: true
        },
        product: {
            model: 'product'
        },
        productName: {
            type: 'string',
            required: true
        },
        region: 'string',
        sex: 'string',
        view_order: 'integer',
        size: 'string',
        retail: 'string',
        sale: 'string',
        onSale: 'boolean',
        chest_diameter: 'string',
        waist_diameter: 'string',
        hip_diameter: 'string',
        shoulder_width: 'string',
        neck_length: 'string',
        arm_length: 'string',
        back_length: 'string'
    }
};
module.exports = productSpecific;