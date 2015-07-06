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
    create: function (req, res) { // POST
        var brandName = req.body.brandName;
        var brandObj = {
            name: dataService.sluggify(brandName),
            brandNames: {
                en: brandName
            },
            creator: authService.whoAmI(req)
        };
        brand.create(brandObj)
        .then(function (D) {
            // 1. success
            var brandName = D.name;
            return res.redirect('/engine/' + brandName); // for testing
        })
        .catch(function (E) {
            // 2. duplicate
            // 3. unknown error
            console.log('E: ', E);
        });
    }
};

module.exports = brandController;