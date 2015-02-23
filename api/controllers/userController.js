/**
 * userController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *
 */
var bcrypt = require('bcrypt-nodejs'),
    Q = require('q'),
    userController = {
        createUser: function (data) {
            var deferred = Q.defer();

            user.findOne({email: data.email}) // Before create, make sure the email doesn't exist
            .then(function (D) {
                if (typeof D !== 'undefined') {
                    return deferred.reject('user exists'); // If user exists, reject
                }
                return user.create({ // Otherwise, create user
                    password: data.password,
                    email: data.email,
                    phone: data.phone
                });
            })
            .catch(function (E) { // Reject if create user has error
                return deferred.reject(E);
            })
            .then(function (D1) { // If created, resolve and return user id and email
               deferred.resolve({
                   id: D1.id,
                   email: D1.email
               });
            });
            return deferred.promise;
        },
        readUser: function (data) {
            var deferred = Q.defer();
            user.findOne({email: data.email})
            .then(function (D) {
                if (typeof D === 'undefined') {
                    return deferred.reject('user not available');
                }
                return deferred.resolve(D);
            });
            return deferred.promise;
        },
        isAdmin: function (brandName, input) {
            var q = Q.defer(),
                output = {
                    isAdmin: false,
                    user: input.email,
                    brands: []
                },
                brandData;
            brand.findOne({brandName: brandName})
            .then(function (D) {
                if (D.email !== input.email) {
                    console.log('email doesnt match');
                    return q.resolve(output);
                }
                brandData = D;
                return user.findOne({email: input.email});
            })
            .then(function (D) {
                if (typeof D !== 'undefined') { // user found
                    bcrypt.compare(input.password, D.password, function (err, D1) {
                        if (err) {
                            q.reject('password does not match');
                        }
                        if (D1) { // credential correct
                            output.isAdmin = true;
                        }
                        output.brands.push(brandData.id);
                        return q.resolve(output);
                    });
                } else {
                    return q.reject('user not found');
                }
            });
            return q.promise;
        },
        loginPage: function (req, res) {
            var input = req.body,
                brandName = req.params.brand,
                credentials = req.session.credentials;

            if (credentials) { // If already authenticated, redirect to manage page
                return res.redirect('/' + brandName + '/manage');
            }
            if (typeof input === 'undefined') { // request login page
                brand.findOne({brandName: brandName})
                .then(function (D) {
                    return renderService.html(res, 'signup', {
                        title: '登入 ' + brandName,
                        brand: D,
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
                });
            }
            if (input) {
                userController.isAdmin(brandName, input)   // To authenticate
                .then(function (D) {
                    if (D.isAdmin) {
                        req.session.credentials = D; // set session credentials
                        return res.send(true);
                    }
                    return res.send(false);
                })
                .catch(function (E) {
                    console.log(E);
                });
            }
        }
    };

module.exports = userController;