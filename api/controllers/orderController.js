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

var async = require('async'),
    orderController = {
    _config: {},
    /*
        data: {
            product
            entries
        }
    */
    createOrder: function (params, callback) {
        
    },
    /* 
        orderItemObj: {
            pid_4: { count: '3', retail: '1880', sale: '1680' },
            pid_5: { count: '1', retail: '1880', sale: '1680' }
        }
    */
    calcSum: function (orderItemObj) {
        var i,
            placeholder,
            sum,
            output = 0;

        for (i in orderItemObj) {
            placeholder = orderItemObj[i];
            if (typeof placeholder.sale !== 'undefined') {
                sum = placeholder.sale * placeholder.count;
            } else {
                sum = placeholder.retail * placeholder.count;
            }
            output += sum;
        }
        return output;
    },
    submitOrder: function (obj, callback) {
        var recipient = obj.recipient,
            customer = {
                email: recipient.email,
                customerName: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country
            },
            sum = orderController.calcSum(obj.order),
            shipping = parseInt(obj.shipping),
            orderForm = {
                orderNumber: obj.uuid,
                items: obj.order,
                recipient: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country,
                sum: sum,
                shipping: shipping,
                subtotal: sum + shipping,
                paymentType: 'bank transfer',
                note: obj.note
            },
            getDate = function () {
                var appendZero = function (input) {
                        return ((input < 10) ? '0' : '') + input;
                    },
                    date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day  = date.getDate(),
                    hour = date.getHours(),
                    min  = date.getMinutes(),
                    sec  = date.getSeconds();

                month = appendZero(month);
                day = appendZero(day);
                hour = appendZero(hour);
                min =  appendZero(min);
                sec = appendZero(sec);
                return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
            };
            createOrder = function (customerId, callback) {
                orderForm.orderNumber = orderForm.orderNumber + '-' + getDate();
                order.create(orderForm).exec(function (err, orderResult) {
                    sails.controllers.cart.closeCart(obj.uuid, function (err, cart) {
                        return callback(null, orderResult);
                    });
                    // TO DO: send confirmation email
                });
            };

        sails.controllers.customer.getCustomer(customer, function (err, customerData) {
            if (typeof data === 'undefined') { // if customer doesn't exist
                sails.controllers.customer.createCustomer(customer, function (err, customerData) {
                    createOrder(customerData.id, function (err, result) {
                        return callback(null, result);
                    });
                });
            } else {
                createOrder(customerData.id, function (err, result) {
                    return callback(null, result);
                });
            }
        });
    },
    submitOrderPage: function (req, res) {
        var obj = req.body;
        orderController.submitOrder(obj, function (err, data) {
            res.send('success');
        });
    },
    verifyStatus: function (input) {
        var i,
            orders = input.orders,
            output = input;
        for (i in input.orders) {
            if (orders[i].status !== null) { // When status has data, add disabled
                orders[i].disabled = true;
            }
        }
        output.orders = orders;
        return output;
        
        /*
            status:
                null:  new order
                submitted: customer notified transfer
                verified: transfer verified

        */
    },
    lookupOrder: function (params, callback) {
        sails.controllers.customer.getCustomer(params, function (err, data) {
            if (typeof data !== 'undefined') {
                var customerId = data.id || '';
                order.find({customer: customerId}, function (err, orderData) {
                    var output = {
                        name: data.customerName,
                        phone: data.phone,
                        orders: orderData
                    };
                    output = orderController.verifyStatus(output);
                    return callback(null, output);
                });
            } else {
                return callback(null, null);
            }
        });
    },
    lookupOrderAjax: function (req, res) {
        var params = req.body;
        orderController.lookupOrder(params, function (err, result) {
            res.send(result);
        });
    },
    lookupOrderPage: function (req, res) {
        var query = req.query,
            renderObj = {
                partials: {
                    head: 'head',
                    header: 'header',
                    body: 'account'
                },
                brand: req.params.brand,
                title: '查詢訂單',
                h1: '查詢訂單',
                action: '',
                js: ['account.js']
            };

        if (typeof query.phone !== 'undefined') { // print order directly
            orderController.lookupOrder(query, function (err, result) {
                renderObj.content = result;
                renderObj.json = JSON.stringify(result);
                res.render('index', renderObj);
            });
        } else {
            renderObj.partials.body = 'signup';
            renderObj.form = [{
                    type: 'text',
                    key: 'phone',
                    label: '輸入電話號碼'
                }
            ];
            res.render('index', renderObj);
        }
    },
    submitVerification: function (input, callback) {
        var i,
            ordersToVerify = input.ordersToVerify,
            ordersToVerifyLen = ordersToVerify.length,
            funcs = [],
            placeholder,
            markOrderVerified = function (inputUuid, callback) {
                order.findOne({orderNumber: inputUuid}, function (err, orderOutput) {
                    var toUpdate = {
                        bankCode: input.transferInfo.bankCode,
                        bankAccountTail: input.transferInfo.bankAccountTail,
                        transferAmount: input.transferInfo.transferAmount,
                        status: 'submitted'
                    };
                    order.update({orderNumber: inputUuid}, toUpdate).exec(function (err, result) {
                        callback(null, result);
                    });
                });
            },
            prepFuncs = function (orderNumber) {
                funcs.push(function(callback){
                    markOrderVerified(orderNumber, callback);
                });
            };

        for (i = 0; i < ordersToVerifyLen; i += 1) {
            prepFuncs(ordersToVerify[i]);
        }
        async.parallel(funcs, function (err, output) {
            callback(null, output);
        });

    },
    submitVerificationPage: function (req, res) {
        orderController.submitVerification(req.body, function (err, data) {
            res.send(data);
        });
    }
};
module.exports = orderController;