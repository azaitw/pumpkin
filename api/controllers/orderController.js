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
    orderController = {
    /* 
        orderItemObj: {
            pid_4: { count: '3', retail: '1880', sale: '1680' },
            pid_5: { count: '1', retail: '1880', sale: '1680' }
        }
    */
    // Calculate order's sum
    calcSum: function (orderItemObj) {
        var i,
            placeholder,
            price,
            output = 0;

        for (i in orderItemObj) {
            placeholder = orderItemObj[i];
            output += (placeholder.price * placeholder.count);
        }
        return output;
    },
    getCustomerForOrder: function (obj) {
        var q = Q.defer(),
            recipient = obj.recipient,
            customerObj = {
                brand: obj.brand.id,
                brandName: obj.brandName,
                email: recipient.email,
                customerName: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country
            };
        sails.controllers.customer.createCustomer(customerObj)
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            return q.reject(E);
        });
        return q.promise;
    },
    create: function (obj) {
        var q = Q.defer(),
            output = obj,
            recipient = obj.recipient,
            shipping = parseInt(obj.order.shipping),
            sum = orderController.calcSum(obj.order.items),
            orderForm = {
                orderNumber: obj.order.uuid + '-' + DateTimeService.getDate(),
                brand: obj.brand.id,
                brandName: obj.brandName,
                customer: obj.customer.id,
                recipient: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country,
                sum: sum,
                shipping: shipping,
                subtotal: sum + shipping,
                paymentType: 'bank transfer',
                note: obj.order.note
            };
        order.create(orderForm)
        .then(function (D) {
            output.orderId = D.id;
            return orderController.createOrderItems(output); // create order items
        })
        .then(function (D1) {
            var i,
                items = D1,
                itemsLen = items.length,
                sum = 0,
                subtotal = 0;

            output.order.items = D1;
            for (i = 0; i < itemsLen; i += 1) {
                sum += parseInt(items[i].price) * parseInt(items[i].count);
            }
            subtotal = sum + shipping;
            output.sum = sum;
            output.subtotal = subtotal;
            return order.update({id: output.orderId}, {sum: sum, subtotal: subtotal, items: D1});
        })
        .then(function (D2) {
            return q.resolve(output);
        })
        .catch(function(E) {
            console.log('order create E: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    read: function (query) {
        var q = Q.defer();
        order.find(query)
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            console.log ('order read E: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    /*
        itemsArray.push({
            cartItemId: ph.attr('data-cartitem_id'),
            productSpecificId: ph.attr('data-ps_id'),
            count: ph.find('.count-input').val()
        });
    */
    createOrderItems: function (obj) {
        var q = Q.defer(),
            items = obj.order.items,
            itemsLen = items.length,
            i;

        for (i = 0; i < itemsLen; i += 1) {
            items[i].orderId = obj.orderId;
            items[i].itemSum = parseInt(items[i].price) * parseInt(items[i].count);
        }

        orderItem.create(items)
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            console.log('createorderitems error: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    // submit order and create customer if necessary
    /*
        order = {
            recipient: {
                email: $('.email').val(),
                name: $('.recipient').val(),
                phone: $('.phone').val(),
                zip: $('.zip').val(),
                address: $('.address').val(),
                country: $('.country').val()
            },
            brand: {
                shipping: parseInt($('.shipping').html())
            },
            order: {
                uuid: X.uuid.read(),
                items: cart,
                note: $('.note').val()
            }
        };
    */
    submitOrder: function (obj) {
        var q = Q.defer(),
            output = obj;

        brand.findOne({brandName: obj.brandName})
        .then(function (D) {
            output.brand = D;
            return orderController.getCustomerForOrder(output); // create or get customer
        })
        .then(function (D1) { // create order
            output.customer = D1;
            return orderController.create(output);
        })
        .then(function (D2) { // Close cart
            output.order.items = D2.order.items;
            return cart.update({uuid: D2.order.uuid}, {closed: true});            
        })
        .then(function (D3) {
            return q.resolve(output);
        })
        .catch(function (E1) {
            console.log('submitOrder: ', E1);
        });
        return q.promise;
    },
    submitOrderPage: function (req, res) {
        var obj = req.body,
            brandName = req.params.brand,
            output;

        obj.brandName = brandName;
        orderController.submitOrder(obj)
        .then(function (D) {
            // Send email
            output = D;
            return brand.findOne({brandName: brandName});
        })
        .then(function (D1) {
            output.brand = D1;
            output.link = req.protocol + '://' + req.header('host') + '/' + brandName + '/account?email=' + obj.recipient.email;
            return EmailService.sendOrderConfirm(output);
        })
        .then(function (D2) { // D2: sent email, return sent email address
            return res.send(D2); 
        })
        .catch(function (E) {
            console.log(E);
        });
    },

    /*
        status:
            null:  new order
            submitted: customer notified transfer
            verified: transfer verified
    */
    verifyStatus: function (input) {
        var i,
            orders = input.orders,
            output = input;
        for (i = 0; i < input.length; i += 1) {
            if (output[i].status !== null) { // When status has data, add disabled
                output[i].disabled = true;
            }
        }
        return output;
    },
    /*
        params: {
            brandName: BRANDNAME,
            email: EMAIL
        }
    */
    lookupOrder: function (params) {
        var q = Q.defer();

        customer.findOne(params)
        .then(function (D) { // D: customer
            return orderController.read({customer: D.id});
        })
        .then(function (D1) { // order
            
            return q.resolve(orderController.verifyStatus(D1));
        })
        .catch(function (E) {
            console.log('lookupOrder E: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    lookupOrderPage: function (req, res) {
        var query = req.query,
            post = req.body,
            renderParams = {
                brand: req.params.brand,
                title: '查詢訂單',
                js: ['account.js']
            },
            lookupForm = function () {
                renderParams.form = [{
                    type: 'text',
                    key: 'email',
                    label: '輸入電子信箱'
                }];
                renderService.html(res, 'signup', renderParams);
            };
        if (typeof post !== 'undefined') {
            orderController.lookupOrder(post)
            .then(function (D) {
                console.log('D: ', D);
                return res.send(D);
            })
            .catch(function (E) {
                console.log('lookup post E: ', E);
                return res.send({});
            });
        }
        query.brandName = req.params.brand;
        if (typeof query.email !== 'undefined') { // use URL to submit email
            orderController.lookupOrder(query)
            .then(function (D) {
                if (typeof D === 'undefined') { // no record found
                    return promptLookup();
                }
                renderParams.content = D;
                return renderService.html(res, 'account', renderParams);
            })
            .catch(function (E) {
                console.log('lookupOrderPage E: ', E);
                return q.reject(E);
            });
        } else { // print phone number enter field
            return lookupForm();
        }
    },
    submitVerification: function (input) {
        var q = Q.defer(),
            i,
            ordersToVerify = input.ordersToVerify,
            ordersToVerifyLen = ordersToVerify.length,
            query = [],
            updates = [],
            funcs = [],
            prepFuncs = function (i) {
                funcs.push(order.update(query[i], updates[i]));
            },
            params = input.transferInfo;
        params.status = 'submitted';

        for (i = 0; i < ordersToVerifyLen; i += 1) {
            query.push({id: ordersToVerify[i]});
            updates.push(params);
            prepFuncs(i);
        }
        Q.all(funcs)
        .then(function (D) {
            return q.resolve(D);
        })
        .catch(function (E) {
            console.log('submitVerification E: ', E);
            return q.reject(E);
        });
        return q.promise;
    },
    submitVerificationPage: function (req, res) {
        orderController.submitVerification(req.body)
        .then(function (D) {
            return res.send(D);
        })
        .catch(function (E) {
            console.log('submitVerificationPage E: ', E);
        });
    },
    manageOrderPage: function (req, res) {
        var brandName = req.params.brand,
            action = req.params.action,
            params = req.body;

        brand.findOne({brandName: brandName})
        .then(function (D1) {
            switch (action) {
            case 'create':
                console.log('create');
                break;

            case 'update':
                console.log('update');
                break;

            default: //read
                order.find({brand: D1.id})
                .then(function (D2) {
                    return res.render('index', {
                        partials: {
                            head: 'head',
                            header: 'header',
                            body: 'order'
                        },
                        title: brandName + ' 訂單管理頁面',
                        h1: brandName + ' 訂單管理頁面',
                        brand: brandName,
                        isAdmin: true,
                        body: D2,
                        js: ['manage.js'],
                        json: JSON.stringify(D2)
                    }); 
                });
            }
        });
    }
};
module.exports = orderController;