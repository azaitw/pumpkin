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
        brandNames: 'json', // multi-language names. {zh_tw: '貝哥哥指南', en: 'Beardude', jp, 'ベルヅド'}
        logo: 'json', // urls {size_128: 'beardude-128.png', 'size_64': 'beardude-64.png', 'favicon': 'beardude.fav'}
        phone: 'string',
        url: 'string',
        address: 'string',
        email: 'string',
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