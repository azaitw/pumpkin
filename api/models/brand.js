/**
 * Brand
 *
 * @module      :: Model
 * @description :: Brand's 
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var brand = {
    attributes: {
        name: { // sluggified. e.g. Beardude -> beardude
            type: 'string',
            required: true,
            unique: true,
            primaryKey: true
        },
        brandNames: 'array', // multi-language name
        logo: 'string',
        business: 'string',
        phone: 'string',
        address: 'string',
        style: 'string',
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

/*
brandNames: [
    {
        lang: 'zh-tw',
        value: '貝哥哥指南'
    },
    {
        lang: 'en',
        value: 'Beardude'
    },
];
*/