/**
 * ProductController
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
    productController = {
        createProduct1: function (data) {
            var deferred = Q.defer();

            product.findOne({productName: data.productName})
            .then(function (D) {
                if (typeof D !== 'undefined') {
                    return deferred.reject('product exists');
                }
                return product.create(D);
            })
            .then(function (D1) {
                deferred.resolve(D1);
            });
        },
        addProductPage: function (req, res) {
            var brand = req.params.brand;
            res.render('index', {
                partials: {
                    head: 'head',
                    header: 'header',
                    body: 'signup'
                },
                brand: brand,
                title: 'Add a product',
                h1: '新增產品',
                action: 'addedProduct',
                js: ['addProduct.js'],
                form: [{
                        type: 'text',
                        key: 'productName',
                        label: '產品名稱'
                    },
                    {
                        type: 'file',
                        key: 'images[]',
                        params: 'multiple',
                        label: '上傳圖片'
                    },
                    {
                        type: 'checkbox',
                        key: 'sex',
                        label: '產品區分男女'
                    },
                    {
                        type: 'checkbox',
                        key: 'onSale',
                        value: 1,
                        label: '啟動特價'
                    },
                    {
                        type: 'number',
                        key: 'retail',
                        label: '售價'
                    },
                    {
                        type: 'number',
                        key: 'sale',
                        label: '特價'
                    },
                    {
                        type: 'text',
                        key: 'brand',
                        value: req.params.brand,
                        style: 'display: none'
                    }
                ]
            });
        },
        addedProductPage: function (req, res) {
            var result = req.body,
                data = {
                    productName: result.productName,
                    brand: req.params.brand,
                    images: ['/images/beardude/beardude2014.png', '/images/beardude/beardude2014a.png'],
                    //images: result.images,
                    onSale: result.onSale,
                    retail: result.retail,
                    sale: result.sale,
                    type: 'shirt'
                };

            productController.createProduct1(data)
            .then(function (D) {
                sails.controllers.productspecific.mockProductSpecific(D, function (categoriesData) {
                    if (err) {
                        callback(err);
                        return;
                    }
                });
                return res.render('index', {
                    body: 'form_product',
                    title: 'Product added',
                    h1: '產品新增成功'
                });
            });
        },
        createProduct: function (data, callback) {
            product.findOne({productName: data.productName}, function (err, result) {
                if (typeof result !== 'undefined') {
                    callback('product exists');
                    return;
                }
                product.create(data).exec(function(err, data) {
                    callback(null, data);
                });
            });
        },
        getProductList: function (categoryList) {
            var result = [],
                i,
                j;
            for (i in categoryList) {
                for (j = 0; j < categoryList[i].size.length; j += 1) {
                    result.push({
                        key: 'pid_' + categoryList[i].id[j],
                        name: i + ' ' + categoryList[i].size[j],
                        sex: i,
                        size: categoryList[i].size[j]
                    });
                }
            }
            return result;
        },
        listProducts: function (brandName, callback) {
            brand.findOne({brandName: brandName})
            .then(function (D) {
                product.find({brand: D.id}, function (err, result) {
                    var combineCategoryResult = function (productObj) {
                            sails.controllers.productspecific.getProductSpecific(productObj, function(err, productCatResult) {
                                var combined = productObj;
                                combined.cats = productCatResult;
                                combined.productList = productController.getProductList(productCatResult);
                                combineResultCb(combined);
                            });
                        },
                        combineResultCb = function (data) {
                            if (!data.onSale) {
                                delete data.sale;
                            }
                            processedResult.push(data);
                            counter -= 1;
                            if (counter === 0) {
                                return callback(null, processedResult);
                            }
                        },
                        resultLen = result.length,
                        counter = resultLen,
                        i,
                        processedResult = [];
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (resultLen > 0) {
                        for (i = 0; i < resultLen; i += 1) {
                            combineCategoryResult(result[i]);
                        }
                    } else {
                        return callback(null, {});
                    }
                });
            });
        },
        listProductsPage: function (req, res) {
            var brand = req.params.brand,
                uuidMod = require('node-uuid'),
                uuidCookieRaw = req.cookies.uuid,
                uuid;
            if (typeof uuidCookieRaw === 'undefined' || uuidCookieRaw === '""') {
                uuid = uuidMod.v4();
            } else {
                uuid = uuidCookieRaw.substring(1, uuidCookieRaw.length - 1);
            }
            productController.listProducts(brand, function (err, result) {
                if (err) {
                    console.log(err);
                }
                res.render('index', {
                    partials: {
                        head: 'head',
                        header: 'header',
                        body: 'products'
                    },
                    uuid: uuid,
                    brand: brand,
                    title: brand + ' products',
                    h1: brand + ' products',
                    products: result,
                    js: ['product.js']
                });
                return;
            });
        },
        generateCheckoutForm: function () {
            var form = [
                {
                    label: '電子信箱',
                    inputs: [
                        {
                            key: 'email',
                            type: 'text',
                            //errormsg: ['請填入電子郵件', '請填入正確的電子郵件格式']
                            errormsg: ['請填入電子郵件'],
                            toValidate: true
                        }
                    ],
                },
                {
                    label: '收件人姓名',
                    inputs: [
                        {
                            key: 'recipient',
                            type: 'text',
                            errormsg: ['請填入收件人姓名'],
                            toValidate: true
                        }
                    ],
                
                },
                {
                    label: '電話',
                    inputs: [
                        {
                            key: 'phone',
                            type: 'text',
                            errormsg: ['請填入電話'],
                            toValidate: true
                        }
                    ]
                }/*,
                {
                    label: '收件地址',
                    inputs: [
                        {
                            key: 'zip',
                            sublabel: '郵遞區號',
                            type: 'text',
                            errormsg: ['請填入郵遞區號']
                        },
                        {
                            key: 'address',
                            sublabel: '地址',
                            type: 'text',
                            errormsg: ['請填入寄件地址']
                        },
                        {
                            key: 'country',
                            sublabel: '國家',
                            type: 'select',
                            selectOptions: [
                                {
                                    key: 'taiwan',
                                    label: '台灣'
                                },
                                {
                                    key: 'others',
                                    label: '其他'
                                }
                            ],
                            additionalInput: [
                                {
                                    type: 'text',
                                    label: '國家',
                                    key: 'other_country',
                                    note: '國際運費約250~450元，會在確認信中加總'
                                }
                            ]
                        }
                    ]
                }*/
            ];
            return form;
        },
        getProductInfo: function (key, callback) {
            var placeholder;

            productSpecific.findOne({id: key}, function (err, data) {
                placeholder = {
                    id: key,
                    name: '',
                    sex: data.sex,
                    size: data.size,
                    count: 0,
                    retail: 0,
    //                sale: 0,
    //                onSale: true,
                    itemSum: 0
                };

                product.findOne({id: data.product}, function (err, productData) {
                    placeholder.name = productData.productName;
                    placeholder.retail = productData.retail;
                    if (productData.onSale) {
                        placeholder.sale = productData.sale;
                    }
                    callback(null, placeholder);
                });
            });
        },
        checkout: function (uuid, callback) {
            var async = require('async'),
                i,
                j,
                productSpecificIds = [],
                funcs = [];
            /*
            {
                uuid: UUID,
                items: {
                    ITEM_KEY: {
                        count: COUNT,
                        name: ITEM_NAME
                    }
                },
                closed: null
            }
            */
            sails.controllers.cart.access({uuid: uuid}, function (err, data) {
                if (typeof data !== 'undefined') {
                    var i,
                        items = data.items || {},
                        productSpecificId,
                        prepFuncs = function (i) {
                            funcs.push(function(callback){
                                productController.getProductInfo(productSpecificIds[i], callback);
                            });
                        };

                    for (i in items) {
                        productSpecificId = i.substring(i.indexOf('pid_') + 4);
                        productSpecificIds.push(productSpecificId);
                    }
                    productSpecificIds.sort();

                    for (i = 0, j = productSpecificIds.length; i < j; i += 1) {
                        prepFuncs(i);
                    }

                    async.parallel(funcs, function (err, productInfo) {
                        var i,
                            productInfoLen = productInfo.length,
                            id,
                            result = {
                                items: {}
                            };
                        for (i = 0; i < productInfoLen; i += 1) {
                            id = 'pid_' + productInfo[i].id;
                            productInfo[i].count = data.items[id].count;
                            result.items[id] = productInfo[i];
                        }
                        return callback(null, {content: productInfo, json: result});
                    });
                } else {
                    callback(null, null);
                }
            });
        },
        checkoutPage: function (req, res) {
            var uuidRaw = req.cookies.uuid,
                uuid,
                brand = req.params.brand,
                content,
                renderPage = function (result) {
                    //Shipping use model
                    content = {
                        cart: (result) ? result.content : null,
                        form: productController.generateCheckoutForm(),
                        shipping: 80
                    };
                    return res.render('index', {
                        partials: {
                            head: 'head',
                            header: 'header',
                            body: 'checkout'
                        },
                        uuid: uuid,
                        brand: brand,
                        title: 'Checkout',
                        h1: 'Checkout',
                        content: content,
                        json: (result) ? JSON.stringify(result.json) : null,
                        js: ['checkout.js'],
                        css: 'checkout.css'
                    });
                };
            if (typeof uuidRaw !== 'undefined') {
                uuid = uuidRaw.substring(1, uuidRaw.length - 1);
                productController.checkout(uuid, function (err, result) {
                    renderPage(result);
                });
            } else {
                renderPage();
            }
        }
    };

module.exports = productController;