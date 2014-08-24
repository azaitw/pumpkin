/**
 * BrandPermission
 *
 * @module      :: Model
 * @description :: Manage brands' user permissions
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var brandPermission = {
    connection: 'localMysql',
    attributes: {
        brand: {
            model: 'brand'
        },
        user: {
            model: 'user'
        },
        isAdmin: 'boolean',
        canManageUser: 'boolean',
        canManageContent: 'boolean',
        canManageStyle: 'boolean',
        canManageTemplate: 'boolean',
        canManageColorset: 'boolean',
        canManageProduct: 'boolean'
    }
};

module.exports = brandPermission;