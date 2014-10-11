/**
 * Brand
 *
 * @module      :: Model
 * @description :: Brand's 
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var brand = {
    attributes: {
        brandName: {
            type: 'string',
            required: true
        },
        slug: 'string',
        brandName_cht: 'string',
        logo: 'string',
        email: {
            type: 'string',
            required: true
        },
        business: 'string',
        phone: 'string',
        address: 'string',
        style: 'string',
        colorset: 'string',
        bankCode: 'string',
        bankAccountNumber: 'string',
        bankAccountName: 'string',
        creator: {
            model: 'user'
        }
    },
    beforeCreate: function (values, next) {
        // For debugging
        next();
    }
};

module.exports = brand;