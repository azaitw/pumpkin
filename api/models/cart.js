/**
 * Order
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var cart = {
    attributes: {
        brandName: {
            type: 'string',
            required: true
        },
        uuid: {
            type: 'string',
            required: true
        },
        items: 'array',
        closed: 'boolean'
    }
};
module.exports = cart;