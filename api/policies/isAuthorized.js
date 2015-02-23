/**
 * isAuthorized
 *
 * @module      :: Policy
 * @description :: Simple policy to allow an authenticated user that has permissions to a brand
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function isAuthorized (req, res, callback) {
    var authorizedBrands;
    var isVerified;
    var returnResult = function (brandId, authorizedBrands) {
        var i;
        for (i = 0; i < authorizedBrands.length; i += 1) {
            if (authorizedBrands[i] === brandId) {
                return callback();
            }
        }
        return res.send(403);
    };

    if (req.session.credentials) { // Logged in
        authorizedBrands = req.session.credentials.brands; // brands: [ '5481e06ac5a8fc020033aaf8' ] } }
        if (typeof req.params.id !== 'undefined') {
            returnResult(req.params.id, authorizedBrands);
        } else if (typeof req.params.brand !== 'undefined') {
            brand.findOne({slug: req.params.brand})
            .then(function (D) {
                returnResult(D.id, authorizedBrands);
            });
        }
    } else { // Not logged in
        return res.send(403);
    }
};