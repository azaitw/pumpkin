/**
 * OrderItems
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var orderItem = {
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
        count: 'integer',
        itemSum: 'integer'
    }
};
module.exports = orderItem;