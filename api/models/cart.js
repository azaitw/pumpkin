/**
 * Order
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var cart = {
    attributes: {
        uuid: {
            type: 'string',
            required: true
        },
        items: {
            type: 'json',
            required: true
        },
        closed: 'boolean'
    }
};
module.exports = cart;