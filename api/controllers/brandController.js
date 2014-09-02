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

var Q = require('q'),
    brandController = {
        createBrand: function (brandData) {
            var deferred = Q.defer();
            brand.findOne({brandName: brandData.brandName})
            .then(function (D) {
                if (typeof D !== 'undefined') {
                    return deferred.reject('brand exists');
                }
                return brand.create(brandData);
            })
            .catch(function (E) {
                deferred.reject(E);
            })
            .then(function (D1) {
               deferred.resolve(D1);
            });
            return deferred.promise;
        },
        generateSignupForm: function () {
            var form = [{
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
                ];
            return form;
        },
        signup: function (req, res) {
            var results = req.body;
            if (typeof results !== 'undefined') {
                brandController.register(req, res);
            } else {
                renderService.html(res, 'signup', {
                    title: '註冊 Pumpkin Lab 帳號',
                    js: ['signup.js'],
                    form: brandController.generateSignupForm()
                });
            }
        },
        register: function (req, res) {
            var results = req.body;

            //brandController.readBrand({brandName: results.brandName}) // Make sure brand doesn't exist
            brand.findOne({brandName: results.brandName}) // Make sure brand doesn't exist
            .then(function (D) {
                if (typeof result !== 'undefined') {
                    return res.send({
                        status: 0,
                        message: 'brand exists'
                    });
                }
                return sails.controllers.user.createUser({ // If brand doesn't exist, create user first
                    email: results.email,
                    phone: results.phone,
                    password: results.password
                });
            })
            .catch(function (E) { // If user exists, assume user creating another brand
                return sails.controllers.user.readUser({email: results.email});
                //return res.send(E);
            })
            .then(function (D1) { // Create brand
                return brandController.createBrand({
                    brandName: results.brandName,
                    creator: D1.id,
                    email: results.email,
                    phone: results.phone,
                    bankCode: results.bankCode,
                    bankAccountNumber: results.bankAccountNumber,
                    bankAccountName: results.bankAccountName
                });
            })
            .catch(function (E1) { // If creating brand has error
                return res.send(E1);
            })
            .then(function (D2) { // Return brand
                D2.status = 1;
                return res.send(D2);
            });
        },
        managePage: function (req, res) {
            var brand = req.params.brand;
            renderService.html(res, 'manage', {
                title: brand + ' 管理頁面',
                brand: brand
            });
        }
};

module.exports = brandController;