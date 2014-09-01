/**
 * OrderItems
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var orderItems = {
    attributes: {
        order: {
            model: 'order'
        },
        itemName: {
            type: 'string',
            required: true
        },
        sex: 'string',
        size: 'string',
        retail: 'string',
        sale: 'string',
        count: 'integer'

    }
};
module.exports = orderItems;