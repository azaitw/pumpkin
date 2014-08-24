/**
 * BrandController
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
    _config: {},
    findNameByName: function (name, next) {
        Brand.findOne({ name: name }, function (err, data) {
            if (err) {
                console.log(err);
            }
            var output;
            if (typeof data === 'undefined') {
                output = 'vacant';
            } else {
                output = 'occupied';
            }
            next(null, output);
        });
    },
    findName: function (req, res) {
        var name = req.params.id;
        BrandController.findNameByName(name, function (err, data) {
            res.send(data);
        });
    },
    signup: function (req, res) {
        res.render('index', {
            partials: {
                head: 'head',
                body: 'signup'
            },
            title: 'Register a Pumpkin Lab account'
        });
    },
    register: function (req, res) {
        var results = req.body,
            brandName = results.brandName,
            phoneNumber = results.phoneNumber,
            email = results.email,
            password = results.password;
            BrandController.findNameByName(brandName, function (err, data) {
                if (data === 'vacant') { // If vacant, create brand and default user account
                    Brand.create({
                        name: brandName,
                        phone: phoneNumber
                    }).done(function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        User.create({
                            name: 'admin',
                            password: password,
                            email: email,
                            phone: phoneNumber,
                            brand: brandName
                        }).done(function (err, data) {
                            if (err) {
                                return console.log(err);
                            }
                            res.render('index', {
                                partials: {
                                    head: 'head',
                                    body: 'portal'
                                },
                                title: 'Pumpkin Lab, your branding specialist'
                            });
                        });
                    });
                } else {
                    console.log('Spot already taken');
                    BrandController.signup(req, res);
                }
            });
    }
};

module.exports = brandController;