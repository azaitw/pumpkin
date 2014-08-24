/**
 * userController
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
var bcrypt = require('bcrypt-nodejs'),
    userController = {
        createUser: function (data, callback) {// password, email, phone
            var output;
            user.findOne({email: data.email}).exec(function (err, result) {
                if (typeof result !== 'undefined') {
                    return callback('user exists');
                }
                user.create({
                    password: data.password,
                    email: data.email,
                    phone: data.phone
                }).exec(function (err, data) {
                    if (err) {
                        callback(err);
                    }
                    output = {
                        id: data.id,
                        email: data.email
                    };
                    callback(null, output);
                });
            });
        },
        isAdmin: function (input, callback) {
            var output;
            user.findOne({email: input.email}, function (err, data1) {
                if (typeof data1 !== 'undefined') { // user found
                    bcrypt.compare(input.password, data1.password, function (err, data2) {
                        if (data2) { // credential correct
                            output = {
                                isAdmin: true,
                                user: input.email
                            };
                        }
                        callback(output);
                    });
                } else {
                    callback(output);
                }
            });
        },
        loginPage: function (req, res) {
            var input = req.body,
                brand = req.params.brand;

            if (typeof input === 'undefined') { // request login page
                res.render('index', {
                    partials: {
                        head: 'head',
                        header: 'header',
                        body: 'signup'
                    },
                    brand: brand,
                    title: '登入 ' + brand,
                    h1: '登入 ' + brand,
                    action: '',
                    js: ['login.js'],
                    form: [{
                            type: 'text',
                            key: 'email',
                            label: '輸入註冊電子信箱'
                        },
                        {
                            type: 'password',
                            key: 'password',
                            label: '輸入密碼'
                        }
                    ]
                });
            } else { // To authenticate
                userController.isAdmin(input, function (data) {
                    if (typeof data !== 'undefined') {
                        req.session.credentials = data; // set session credentials
                        res.send(true);
                    } else {
                        res.send(false);
                    }
                });
            }
        }
    };

module.exports = userController;