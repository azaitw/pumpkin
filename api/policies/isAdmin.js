/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function isAdmin (req, res, next) {

    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    var brand = req.params.brand,
        credentials = req.session.credentials;

    if (credentials && credentials.isAdmin) { // is admin
        return next();
    } else { // bad
        return res.redirect('/' + brand);
        //return res.redirect('/' + brand + '/login');
    }
};
