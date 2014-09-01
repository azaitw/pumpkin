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
    /* 
        orderItemObj: {
            pid_4: { count: '3', retail: '1880', sale: '1680' },
            pid_5: { count: '1', retail: '1880', sale: '1680' }
        }
    */
    // Calculate order's sum
    calcSum: function (orderItemObj, shipping) {
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
        output += shipping;
        return output;
    },
    // submit order and create customer if necessary
    submitOrder: function (obj, callback) {
        var recipient = obj.recipient,
            customerObj = {
//                brand: obj.brand,
                email: recipient.email,
                customerName: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country
            },
            shipping = parseInt(obj.shipping),
            sum = orderController.calcSum(obj.order, shipping),
            createOrder = function (orderForm, callback) {
                order.create(orderForm).exec(function (err, orderResult) {
                    sails.controllers.cart.closeCart(obj.uuid, function (err, data) {});
                    orderResult.email = customerObj.email;
                    return callback(null, orderResult);
                });
            };
        // Lookup if customer exists
        brand.findOne({brandName: obj.brand})
        .then(function (D1) {
            customerObj.brand = D1.id;
            customer.findOne({brand: D1.id, email: customerObj.email}, function (err, D2) {
                var orderForm = {
                    orderNumber: obj.uuid + '-' + DateTimeService.getDate(),
                    brand: D1.id,
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
                };

                if (typeof D2 === 'undefined') { // if customer doesn't exist, create customer
                    customer.create(customerObj).exec(function (err, D3) {
                        orderForm.customer = D3.id;
                        createOrder(orderForm, function (err, D4) {
                            return callback(null, D4);
                        });
                    });
                } else {
                    orderForm.customer = D2.id;
                    createOrder(orderForm, function (err, D4) {
                        return callback(null, D4);
                    });
                }
            });
        });
    },
    submitOrderPage: function (req, res) {
        var obj = req.body,
            brandName = req.params.brand;
            obj.brand = brandName;
        orderController.submitOrder(obj, function (err, D) {
            var i,
                key;

            brand.findOne({brandName: brandName}, function (err, D1) {
                D.brand = D1;
                D.link = req.protocol + '://' + req.header('host') + '/' + brandName + '/account?email=' + D.email;
                sails.renderView('email/order', D, function (err, html) {
                    if (err) {
                        console.log('err: ', err);
                    }
                    sails.renderView('email/order_plaintext', D, function (err, text) {

                        EmailService.sendMail({
                            to: D.email,
                            subject: '您的訂單',
                            body: html,
                            text: text,
                            brand: D.brand
                        }, function (err, D3) {
                            
                        });
                        res.send(D.email); 
                    });
                });
            });

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
        var Result,
            Result1,
            Result2;

        brand.findOne({brandName: params.brand})
        .then(function (D) {
            Result = D;
            params.brand = D.id;
            return customer.findOne(params);
        })
        .then(function (D1) {
            Result1 = D1;
            if (typeof Result1 === 'undefined') {
                return callback(null, null);
            } else {
                return order.find({brand: Result.id, customer: Result1.id});
            }
        })
        .then(function (D2) {
            var output = {
                name: Result1.customerName,
                phone: Result1.phone,
                orders: D2
            };
            output = orderController.verifyStatus(output);
            return callback(null, output);
        });
    },
    lookupOrderAjax: function (req, res) {
        var params = req.body;
        params.brand = req.params.brand;
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
        query.brand = req.params.brand;
        if (typeof query.email !== 'undefined') { // print order directly
            orderController.lookupOrder(query, function (err, result) {
                renderObj.content = result;
                renderObj.json = JSON.stringify(result);
                res.render('index', renderObj);
            });
        } else { // print phone number enter field
            renderObj.partials.body = 'signup';
            renderObj.form = [{
                    type: 'text',
                    key: 'email',
                    label: '輸入電子信箱'
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