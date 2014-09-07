/**
 * orderController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Q = require('q'),
    orderItemController = {
    _config: {},
    /* 
        stored data:
        orderItemObj: {
            pid_4: {
                "id":"4",
                "name":"Beardude 2014",
                "sex":"male",
                "size":"M",
                "retail":"1880",
                "sale":"1680"
                "count":1,
                "itemSum":0,
            }
        }

        model:
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

    */
    createOrderItem: function (inputObj) {
        var i,
            q = Q.defer(),
            items = inputObj.items;
            console.log('here');
        orderitem.create(items)
        .then(function (D) {
            console.log('orderitem: D: ', D);
            return q.resolve(D);
        });
        return q.promise;
    }
};
module.exports = orderItemController;