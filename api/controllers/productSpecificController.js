/**
 * ProductSpecificController
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

var productSpecificController = {
    _config: {},
    /*
        data: {
            product
            entries
        }
    */
    // For new product
    addProductSpecific: function (data, callback) {
        productSpecific.create(data, function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            callback(data);
        });
    },
    getProductSpecific: function (productObj, callback) {
        var i,
            productCat = productObj.categories || {},
            productCatLen = productCat.length || 0,
            counter = productCatLen,
            region = 'apac',
            tempResult = {
                male: [],
                female: [],
                unisex: []
            },
            finalResult = {},
            generateTable = function (sex, object) {
                var result = {
                        id: [],
                        size: [],
                        chest_diameter: [],
                        waist_diameter: [],
                        hip_diameter: []
                    },
                    keys = ['id', 'size', 'chest_diameter', 'waist_diameter', 'hip_diameter'],
                    placeholder,
                    i,
                    j;

                for (i = 0; i < object.length; i += 1) {
                    placeholder = object[i];
                    for (j = 0; j < keys.length; j += 1) {
                        result[keys[j]].push(placeholder[keys[j]]);
                    }
                }
                return result;
            },
            findProductSpecific = function (productCatId) {
                productSpecific.findOne({id: productCat[i], region: region}, function (err, data) {
                    var i,
                        sex = data.sex,
                        order = data.cat_order,
                        placeholder;
                    counter -= 1;
                    tempResult[sex][order - 1] = data;
                    if (counter === 0) {
                        if (tempResult.male.length > 0) {
                            finalResult.male = generateTable('male', tempResult.male);
                        }
                        if (tempResult.female.length > 0) {
                            finalResult.female = generateTable('female', tempResult.female);
                        }
                        if (tempResult.unisex.length > 0) {
                            finalResult.unisex = generateTable('unisex', tempResult.unisex);
                        }
                        return callback(null, finalResult);
                    }
                });
            };
        for (i = 0; i < productCatLen; i += 1) {
            findProductSpecific(productCat[i]);
        }
    },
    mockProductSpecific: function (product_data, callback) {
        var i,
            product_id = product_data.id,
            region = 'apac',
/* reed file
            fs = require('fs'),
            path = require('path'),
            filePath = path.join(__dirname, '../../staticData/productCategoryData.json'),
*/
            mockdata = [
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 1,
                    size: 'XS',
                    chest_diameter: '89-91',
                    waist_diameter: '76-79',
                    hip_diameter: '92-95'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 2,
                    size: 'S',
                    chest_diameter: '92-95',
                    waist_diameter: '80-93',
                    hip_diameter: '96-99'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 3,
                    size: 'M',
                    chest_diameter: '96-99',
                    waist_diameter: '84-87',
                    hip_diameter: '100-103'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 4,
                    size: 'L',
                    chest_diameter: '100-104',
                    waist_diameter: '88-92',
                    hip_diameter: '104-108'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 5,
                    size: 'XL',
                    chest_diameter: '105-109',
                    waist_diameter: '93-97',
                    hip_diameter: '109-113'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 6,
                    size: '2XL',
                    chest_diameter: '110-114',
                    waist_diameter: '98-102',
                    hip_diameter: '114-118'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'male',
                    cat_order: 7,
                    size: '3XL',
                    chest_diameter: '115+',
                    waist_diameter: '103+',
                    hip_diameter: '119+'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'female',
                    cat_order: 1,
                    size: 'S',
                    chest_diameter: '84-87',
                    waist_diameter: '67-70',
                    hip_diameter: '93-96'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'female',
                    cat_order: 2,
                    size: 'M',
                    chest_diameter: '88-91',
                    waist_diameter: '71-74',
                    hip_diameter: '97-100'
                },
                {
                    product: product_id,
                    region: region,
                    sex: 'female',
                    cat_order: 3,
                    size: 'L',
                    chest_diameter: '92-95',
                    waist_diameter: '75-80',
                    hip_diameter: '101-104'
                }
            ],
            mockdataLen = mockdata.length,
            counter = mockdataLen,
            categories = [],
            addProductSpecificEntry = function (data) {
                sails.controllers.productspecific.addProductSpecific(mockdata[i], function (data) {
                    counter -= 1;
                    categories.push(data.id);

                    // When done, update product's categories entry with productSpecific entry list
                    if (counter === 0) {
                        callback(categories);
                        product.update({id: product_id}, {categories: categories}).exec(function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }
                });
            };

        // Add productSpecific entries
        for (i = 0; i < mockdataLen; i += 1) {
            addProductSpecificEntry(mockdata[i]);
        }
    },
    getid: function (catIdString) {
        //cat_{id_number}. Extract id_number
        return catIdString.substr(itemKeyRaw.indexOf('pid_' + 4));
    }
};
module.exports = productSpecificController;