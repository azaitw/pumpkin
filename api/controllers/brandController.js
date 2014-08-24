/**
 * brandController
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

var brandController = {
    signup: function (req, res) {
        res.render('index', {
            partials: {
                head: 'head',
                header: 'header',
                body: 'signup'
            },
            title: 'Register a Pumpkin Lab account',
            h1: '註冊 Pumpkin Lab 帳號',
            action: 'register',
            js: ['signup.js'],
            form: [{
                    type: 'text',
                    key: 'brandName',
                    label: '品牌名稱'
                },
                {
                    type: 'text',
                    key: 'phone',
                    label: '電話'
                },
                {
                    type: 'text',
                    key: 'email',
                    label: 'Email'
                },
                {
                    type: 'password',
                    key: 'password',
                    label: '密碼'
                },
                {
                    type: 'text',
                    key: 'bankCode',
                    label: '銀行代碼'
                },
                {
                    type: 'text',
                    key: 'bankAccountNumber',
                    label: '銀行帳號'
                },
                {
                    type: 'text',
                    key: 'bankAccountName',
                    label: '銀行帳戶名稱'
                }
            ]
        });
        return;
    },
    createBrand: function (data, callback) {
        brand.findOne({brandName: data.brandName}, function (err, result) {
            if (typeof result !== 'undefined') {
                return callback('brand exists');
            }
            brand.create({
                brandName: data.brandName,
                phone: data.phone,
                creator: data.creator
            }).exec(function (err, data) {
                if (err) {
                    callback(err);
                }
                callback(null, data);
            });
        });
    },
    managePage: function (req, res) {
        res.send('manage page: ' + req.params.brand);
    },
    register: function (req, res) {
        var results = req.body,
            password = results.password,
            email = results.email,
            phone = results.phone,
            brandName = results.brandName,
            brandData,
            userData;
        brand.findOne({brandName: brandName}, function (err, result) {
            if (typeof result !== 'undefined') {
                res.send({
                    status: 0,
                    message: 'brand exists'
                });
                return;
            }
            userData = {
                email: email,
                password: password,
                phone: phone
            };
            sails.controllers.user.createUser(userData, function (err, userData) {
                if (err) {
                    res.send({
                        status: 0,
                        message: 'user exists'
                    });
                    return;
                }
                brandData = {
                    brandName: brandName,
                    phone: phone,
                    bankCode: bankCode,
                    bankAccountNumber: bankAccountNumber,
                    bankAccountName: bankAccountName,
                    creator: userData.id
                };
                brandController.createBrand(brandData, function (err, brandData) {
                    var response;
                    if (err) {
                        console.log('Create brand error: ', err);
                    }
                    response = {
                        status: 1,
                        email: userData.email,
                        brandName: brandData.brandName,
                        phone: brandData.phone
                    };
                    res.send(response);
                });
            });
        });
    }
};

module.exports = brandController;