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
            price = placeholder.retail;
            if (typeof placeholder.sale !== 'undefined') {
                price = placeholder.sale;
            }
            output += (price * placeholder.count);
        }
        return output;
    },
    getCustomerForOrder: function (obj) {
        var q = Q.defer(),
            recipient = obj.recipient,
            customerObj = {
                brand: obj.brandId, // TO DO: we only need brand id, maybe add brand id in form to skip this query
                email: recipient.email,
                customerName: recipient.name,
                phone: recipient.phone,
                zip: recipient.zip,
                address: recipient.address,
                country: recipient.country
            };
        sails.controllers.customer.createCustomer(customerObj)
        .then(function (D) {
            console.log('customer created');
            return q.resolve(D);
        })
        .catch(function (D) {
            console.log('customer exist');
            return q.resolve(D);
        });
        return q.promise;
    },
    // submit order and create customer if necessary
    submitOrder: function (obj) {
        var q = Q.defer(),
            recipient = obj.recipient,
            shipping = parseInt(obj.shipping),
            sum = orderController.calcSum(obj.order);

        this.getCustomerForOrder(obj) // create or get customer
        .then(function (D) { // create order
            var orderForm = {
                orderNumber: obj.uuid + '-' + DateTimeService.getDate(),
                brand: D.brand,
                customer: D.id,
                items: obj.order, // TO DO: use orderItem
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
            return order.create(orderForm);
        })
        .then(function (D1) { // Close cart
            sails.controllers.cart.closeCart(obj.uuid, function (err, data) {});
            D1.email = recipient.email;
            return q.resolve(D1); // return customer email
        })
        .catch(function (E1) {
            console.log(E1);
        });
        return q.promise;
    },
    submitOrderPage: function (req, res) {
        var obj = req.body,
            brandName = req.params.brand,
            orderInfo,
            emailHtml;
        obj.brand = brandName;

        orderController.submitOrder(obj)
        .then(function (D) {
            // Send email
            orderInfo = D;
            return brand.findOne({brandName: brandName});
        })
        .then(function (D1) {
            orderInfo.brand = D1;
            orderInfo.link = req.protocol + '://' + req.header('host') + '/' + brandName + '/account?email=' + orderInfo.email;
            return EmailService.sendOrderConfirm(orderInfo);
        })
        .then(function (D2) { // D2: sent email, return sent email address
            res.send(D2); 
        })
        .catch(function (E) {
            console.log(E);
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