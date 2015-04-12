/**
 * Order
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var cart = {
    attributes: {
        brand: {
            model: 'brand'
        },
        id: {
            type: 'string',
            required: true,
            primaryKey: true,
            autoIncrement: true
            
        },
        items: 'array',
        closed: 'boolean'
    }
};
module.exports = cart;

/*
    items: [
        {
            item: id,
            count: number,
//            name: string,
//            price
        }
    ]
*/