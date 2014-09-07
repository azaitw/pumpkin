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

var Q = require('q'),
    productSpecificController = {
        _config: {},
        /*
            data: {
                product
                entries
            }
        */
        // For new product
        createProductSpecific: function (inputObj) {
            var q = Q.defer();
            productSpecific.create(inputObj)
            .then(function (D) {
                return q.resolve(D);
            })
            .catch(function(E) {
                return q.reject(E);
            });
            return q.promise;
        },
        organizeBySex: function (inputObj) {
            var i,
                inputObjLen = inputObj.length,
                sexPlaceHolder,
                catOrder,
                output = {
                    male: [],
                    female: [],
                    unisex: []
                };

            for (i = 0; i < inputObjLen; i += 1) {
                sexPlaceHolder = inputObj[i].sex;
                catOrder = inputObj[i].view_order - 1;
                output[sexPlaceHolder][catOrder] = inputObj[i];
            }
            return output;
        },
        getProductSpecific: function (pSpecificQuery, params) {
            var q = Q.defer(),
                output = {};

            productSpecific.find(pSpecificQuery)
            .then(function (D) {
                if (params.organizeBySex) {
                    output['product_' + pSpecificQuery.product] = productSpecificController.organizeBySex(D);
                    return q.resolve(output);
                }
                return q.resolve(D);
            })
            .catch(function (E) {
                return q.reject(E);
            });
            return q.promise;
        },
        mockProductSpecific: function (product_data) {
            var q = Q.defer(),
                i,
                product_id = product_data.id,
                region = 'apac',
                mockdata = [
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 1,
                        size: 'XS',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '89-91',
                        waist_diameter: '76-79',
                        hip_diameter: '92-95'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 2,
                        size: 'S',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '92-95',
                        waist_diameter: '80-93',
                        hip_diameter: '96-99'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 3,
                        size: 'M',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '96-99',
                        waist_diameter: '84-87',
                        hip_diameter: '100-103'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 4,
                        size: 'L',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '100-104',
                        waist_diameter: '88-92',
                        hip_diameter: '104-108'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 5,
                        size: 'XL',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '105-109',
                        waist_diameter: '93-97',
                        hip_diameter: '109-113'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 6,
                        size: '2XL',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '110-114',
                        waist_diameter: '98-102',
                        hip_diameter: '114-118'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'male',
                        view_order: 7,
                        size: '3XL',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '115+',
                        waist_diameter: '103+',
                        hip_diameter: '119+'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'female',
                        view_order: 1,
                        size: 'S',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '84-87',
                        waist_diameter: '67-70',
                        hip_diameter: '93-96'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'female',
                        view_order: 2,
                        size: 'M',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '88-91',
                        waist_diameter: '71-74',
                        hip_diameter: '97-100'
                    },
                    {
                        product: product_id,
                        productName: product_data.productName,
                        brand: product_data.brand,
                        brandName: product_data.brandName,
                        region: region,
                        sex: 'female',
                        view_order: 3,
                        size: 'L',
                        retail: product_data.retail,
                        sale: product_data.sale,
                        onSale: product_data.onSale,
                        chest_diameter: '92-95',
                        waist_diameter: '75-80',
                        hip_diameter: '101-104'
                    }
                ],
                productSpecific = [];

            productSpecificController.createProductSpecific(mockdata)
/*            .then(function (D) {
                for (i = 0, j = D.length; i < j; i += 1) {
                    productSpecific.push(D[i].id);
                }
                return product.update({id: product_id}, {productSpecific: productSpecific});
            })
*/            .then(function (D1) {
                return true;
            })
            .catch(function (E) {
               console.log('mockProductSpecific Error: ', E);
            });
        },
        getid: function (catIdString) {
            //cat_{id_number}. Extract id_number
            return catIdString.substr(itemKeyRaw.indexOf('pid_' + 4));
        }
    };
module.exports = productSpecificController;