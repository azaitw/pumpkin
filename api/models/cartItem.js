/**
 * OrderItems
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var cartItem = {
    attributes: {
        cart: {
            model: 'cart'
        },
        productSpecific: {
            model: 'productSpecific'
        },
        productName: {
            type: 'string',
            required: true
        },
        sex: 'string',
        size: 'string',
        count: 'integer'
    }
};
module.exports = cartItem;