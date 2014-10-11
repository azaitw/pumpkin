/**
 * OrderItems
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var orderItem = {
    attributes: {
        orderId: {
            model: 'order'
        },
        productName: {
            type: 'string',
            required: true
        },
        sex: 'string',
        size: 'string',
        price: 'string',
        count: 'integer',
        itemSum: 'integer'
    }
};
module.exports = orderItem;