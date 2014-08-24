/*
    item: {
        uuid: UUID,
        items: {
            ITEM_KEY: {
                name: ITEM_NAME,
                count: ITEM_COUNT
            }
        }
    }
*/
var customerController = {
    getCustomer: function (obj, callback) {
        customer.findOne(obj, function (err, data) {
            callback(null, data);
        });
    },
    createCustomer: function (obj, callback) {
        customer.create(obj).exec(function (err, result) {
            callback(null, result);
        });
    }
};
module.exports = customerController;