var Q = require('q'),
    cartController = {
    access: function (params) { // Switch between read and update

        var q = Q.defer(),
            uuid = params.uuid;
        if (typeof params.add === 'undefined' && typeof params.items === 'undefined') { // read
            cartController.read(uuid)
            .then(function(D) {
                return q.resolve(D);
            })
            .catch(function (E) {
                console.log('access error: ', E);
                return q.reject(E);
            });
            return q.promise;

        } else if (typeof uuid !== 'undefined') { // write: add one or update all
            cartController.update(params)
            .then(function(D) {
                return q.resolve(D);
            })
            .catch(function (E) {
                console.log('access error: ', E);
                return q.reject(E);
            });
            return q.promise;

        } else { // bad
            return (null, {});
        }
    },
    create: function (params) {
        var q = Q.defer(),
            uuid = params.uuid,
            itemToAdd = params.add,
//            itemKey = 'ps_id_' + itemToAdd.productSpecific,
            cartData = {
                uuid: params.uuid,
                brandName: params.brandName,
            };
        cart.create(cartData)
        .then(function (D) { // D.uuid, D.id
            return createCartItem(itemToAdd, D.id);
            /*
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
            */
        })
        .then(function (D1) {
            return q.resolve(D1);
        })
        .catch(function (E) {
            return q.reject(E);
        });
        return q.promise;
    },
    read: function (uuid) {
        var q = Q.defer(),
            output;
        
        cart.findOne({uuid: uuid})
        .then(function (D) { //D.id
            output = D;
            return cartController.readCartItem(output.id);
        })
        .then(function (D1) {
            output.items = D1;
            return q.resolve(output);
        })
        .catch(function (E) {
            return q.reject(E);
        });
        return q.promise;
    },
    readCartItem: function (cartId) {
        var q = Q.defer();
        cartItem.find({cart: cartId})
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            console.log('readCartItem E: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    /*
    add one:
        {
            uuid: UUID,
            add: {
                productSpecific: '',
                productName: '',
                sex: '',
                size: ''
            }
        }
    update: 
        {
            uuid: UUID,
            items: {
                
            }
        }
    */
    createCartItem: function (input, cartId) {
        var q = Q.defer(),
            output = input;

        output.cart = cartId;
        output.count = 1;

        cartItem.create(output)
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            console.log('error: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    // Add or update a cartItem entry
    addCartItem: function (params, cartId) {
        var q = Q.defer(),
            item = params.add,
            count;

        cartItem.findOne({cart: cartId, productSpecific: item.productSpecific})
        .then(function (D) {
            if (typeof D === 'undefined') { // cart doesn't have item
                item.cart = cartId;
                item.count = 1;
                return cartItem.create(item);
            }
            count = D.count + 1;
            return cartItem.update({id: D.id}, {count: count});
        })
        .then(function (D1) {
            return q.resolve(D1);
        })
        .catch(function (E) {
            console.log('addCartItem error: ', E);
            q.reject(E);
        });
        return q.promise;
    },
    updateAllItems: function (params, cartId) {
        var q = Q.defer(),
            i,
            items = params.items;

        /*
        cartItem = D.items || {};
        itemObj = cartItem[itemKey] || {};
        cartItemCount = itemObj.count || 0;
        if (typeof itemKey !== 'undefined') { // data exist
            D.items[itemKey] = {
                name: params.itemName,
                count: cartItemCount + 1
            };
        }
        if (typeof items !== 'undefined') { // update multiple items
            for (i in items) { // remove items with 0 count
                if (params.items[i].count >= 0) {
                    D.items[i].count = params.items[i].count;
                } else {
                    delete D.items[i];
                }
            }
        }
        */
        //return cart.update({uuid: uuid}, {items: D.items});  
    },
    update: function (params) {
        var q = Q.defer(),
            uuid = params.uuid,
            items = params.items, // If not undefined, update complete items
            itemKey;

        cartController.read(uuid)
        .then(function (D) {
            var i,
                items,
                funcs;

            if (typeof D === 'undefined') { // not data. to create and add an item
                return cartController.create(params);
            } else { // has record
                // case 1: add: {}
                // case 2: items: {}

                if (typeof params.add !== 'undefined') { // add one entry
                    return cartController.addCartItem(params, D.id);
                }
                return cartController.updateAllItems(params, D.id);
            }
        })
        .then(function (D1) {
            console.log('D1: ', D1);
            return q.resolve(D1);
        })
        .catch(function (E) {
            console.log('update error: ', E);
            return q.reject(E);
        });
        return q.promise;
    },


    // NOT YET REFACTORED
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
        /*
        cartController.access(req.body, function (err, data) {
            res.send(cartController.sanitize(data));
        });
        */
        var cart =  req.body;
        cart.brandName = req.params.brand;
        cartController.access(cart)
        .then(function (D) {
            res.send(cartController.sanitize(D));
        })
        .catch(function (E) {
            console.log('accessPage error: ', E);
        });
    }
};
module.exports = cartController;