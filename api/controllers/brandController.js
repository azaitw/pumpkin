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

var Q = require('q');
var brandController = {
        createUserForm: function () {
            var form = [
                    {
                        text: 'email',
                        label: 'Email'
                    },
                    {
                        text: 'password',
                        label: '密碼'
                    }
                ];
            return form;
        },
        createBrandForm: function () {
            var form = [
                {
                    text: 'brand'
                }
            ];
            return form;
        },
        signupPage: function (req, res) {
            var results = req.body;
            if (typeof results !== 'undefined') {
                user.create(results)
                .then(function (D) {
                    console.log('D: ', D);
                    
                });
//                brandController.register(req, res);
            } else {
                renderService.html(req, res, {
                    title: '註冊 Pumpkin Lab 帳號',
                    form: brandController.createUserForm()
                });
            }
        },
        signupPageOld: function (req, res) {
            var results = req.body;
            if (typeof results !== 'undefined') {
                brandController.register(req, res);
            } else {
                renderService.htmlOld(req, res, {
                    title: '註冊 Pumpkin Lab 帳號',
                    form: brandController.generateSignupForm1()
                });
            }
        },
        register: function (req, res) {
            var results = req.body;

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
                return brand.create({
                    brandName: results.brandName,
                    brandName_cht: results.brandName_cht,
                    slug: results.brandName.toLowerCase(),
                    creator: D1.id,
                    logo: ['/images/beardude/logo/beardude.png'],
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
            return renderService.htmlOld(req, res, {
                templates: {
                    body: 'manage'
                },
                title: 'Beardude Engine 管理頁面'
            });
        }
};

module.exports = brandController;