/**
* Shipping.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var shipping = {
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
//            enum: ['post', 'pickup', 'express', 'post-collect']
        },
        rule: {
            type: 'string',
            enum: ['fixed', 'incremental']
        },
        basePrice: {
            type: 'integer',
            required: true
        },
        incrementPrice: 'integer',
        description: 'string'
    }
};
module.exports = shipping;