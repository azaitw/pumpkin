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
var Q = require('q'),
    cartController = {
    access: function (params, callback) { // Switch between read and update
        var uuid = params.uuid;
        if (typeof params.itemKey === 'undefined' && typeof params.items === 'undefined') { // read
            cartController.read(uuid, function (err, data) {
                return callback(null, data);
            });
        } else if (typeof uuid !== 'undefined') { // write
            cartController.update(params, function (err, data) {
                return callback(null, data);
            });
        } else { // bad
            return callback(null, {});
        }
    },
    create: function (params, callback) {
        var uuid = params.uuid,
            itemKey = params.itemKey,
            cartData = {
                uuid: params.uuid,
                items: {}
            };

        cartData.items[itemKey] = {
            name: params.itemName,
            count: 1
        };
        cart.create(cartData).exec(function (err, data) {
            callback(null, data);
        });
    },
    read: function (uuid, callback) {
        cart.findOne({uuid: uuid}, function (err, data) {
            callback(null, data);
        });
    },
    update: function (params, callback) {
        var uuid = params.uuid,
            itemKey = params.itemKey, // if not undefined, add entry
            items = params.items; // If not undefined, update complete items

        cartController.read(uuid, function (err, data) {
            var i;
            if (typeof data === 'undefined') { // to create uuid
                cartController.create(params, function (err, data) {
                    return callback(null, data);
                });
            } else if (typeof itemKey !== 'undefined') { // data exist
                if (typeof data.items[itemKey] === 'undefined') { // item doesn't exist
                    data.items[itemKey] = {
                        name: params.itemName,
                        count: 1
                    };
                } else { // item exists
                    data.items[itemKey].count += 1;
                }
                cart.update({uuid: uuid}, {items: data.items}).exec(function (err, data) {
                    return callback(null, data);
                });
            } else if (typeof items !== 'undefined') { // update several existing items' count
                for (i in params.items) { // remove items with 0 count
                    data.items[i].count = params.items[i].count;
                    if (params.items[i].count <= 0) {
                        delete data.items[i];
                    }
                }
                cart.update({uuid: uuid}, {items: data.items}).exec(function (err, data) {
                    return callback(null, data);
                });
            }
        });
    },
    closeCart: function (uuid, callback) {
        cart.update({uuid: uuid}, {closed: true}).exec(function (err, data) {
            callback(null, data);
        });
    },
    sanitize: function (rawObj) {
        var obj = rawObj;
        if (typeof rawObj !== 'undefined') {
            delete obj.id;
            delete obj.uuid;
            delete obj.createdAt;
            delete obj.updatedAt;
        }
        return obj;
    },
    accessPage: function (req, res) {
        cartController.access(req.body, function (err, data) {
            res.send(cartController.sanitize(data));
        });
    }
};
module.exports = cartController;