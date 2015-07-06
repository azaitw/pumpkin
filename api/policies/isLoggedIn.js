/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: Simple policy to determine if the client can access management functionalities, such as engine pages
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function isLoggedIn (req, res, callback) {
    if (req.session && req.session.credentials) { // Logged in
        return callback();
    }
    return res.redirect('/login');
};