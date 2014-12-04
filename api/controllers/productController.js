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
        createProduct: function (data) {
            var q = Q.defer();

            product.findOne({productName: data.productName})
            .then(function (D) {
                if (typeof D !== 'undefined') {
                    return q.reject('product exists');
                }
                return product.create(data);
            })
            .then(function (D1) {
                return q.resolve(D1);
            })
            .catch(function (E) {
                console.log('createProduct error: ', E);
            });
            return q.promise;
        },
        generateAddProductForm: function (inputObj) {
            var form = [
                {
                    type: 'text',
                    key: 'productName',
                    label: '產品名稱'
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
                    type: 'text',
                    key: 'shortDesc',
                    label: '簡短描述'
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
                    label: 'brand',
                    value: inputObj.brandName,
                    toHide: true
                },
                {
                    type: 'file',
                    key: 'images',
                    params: 'multiple',
                    label: '上傳圖片'
                }
            ];
            return form;
        },
        prepareProductObj: function (inputObj) {
            return {
                productName: inputObj.productName,
                brand: inputObj.brandId,
                brandName: inputObj.brandName,
                shortDesc: inputObj.shortDesc,
//                images: ['/images/beardude/beardude2014.png'],
                //images: result.images,
                onSale: inputObj.onSale,
                retail: inputObj.retail,
                sale: inputObj.sale,
                type: 'shirt'
            };
        },
        addProductPage: function (req, res) {
            var result = req.body,
                data,
                brandName = req.params.brand,
                filesArray = [],
                finalResult;
            console.log('log 1: addProductPage');
            if (typeof result !== 'undefined') { // post
                result.brandName = brandName;
                console.log('log 2: addProductPage');
                brand.findOne({brandName: brandName})
                .then(function (D) {
                console.log('log 3: addProductPage, D: ', D);
                    result.brandId = D.id;
                    return sails.controllers.file.upload(req, {brand: D.id, brandName: brandName, key: 'images', purpose: 'product'});
                })
                .then(function (D) {
                    console.log('log 4: files uploaded? D: ', D);
                    D.forEach(function (item) {
                        filesArray.push(item.url);
                    });
                    data = productController.prepareProductObj(result);
                    data.images = filesArray;
                    return productController.createProduct(data);
                })
                .then(function (D) {
                    return sails.controllers.productspecific.mockProductSpecific(D);
                })
                .then(function (D) {
                    return res.send(true);
                })
                .catch(function (E) {
                    console.log('addedProduct error: ', E);
                });
                /*
                data = productController.prepareProductObj(result);
                productController.createProduct(data)
                .then(function (D) {
                    return sails.controllers.productspecific.mockProductSpecific(D);
                })
                .then(function (D) {
                    finalResult = D;
                    return sails.controllers.file.upload1(req, {brand: brandName, key: 'images'});
                })
                .then(function (D) {
                    console.log('file D? ', D);
                    return res.send(D1);
                })
                .catch(function (E) {
                    console.log('addedProduct error: ', E);
                });
                */
            }
            // get
            brand.findOne({brandName: brandName})
            .then(function (D) {
                return renderService.html(res, 'form', {
                    title: '新增產品',
                    js: ['addProduct.js'],
                    brand: D,
                    form: productController.generateAddProductForm(D)
                });
            })
            .catch(function (E) {
                console.log('E: ', E);
            });
        },
        listProducts: function (brandName) {
            var q = Q.defer(),
                products = {};

            product.find({brandName: brandName})
            .then(function (D) { // D: products
                // get each product's specific
                var DLen = D.length,
                    i,
                    key,
                    funcs = [],
                    prepFuncs = function (i) {
                        funcs.push(
                            sails.controllers.productspecific.getProductSpecific({product: D[i].id}, {organizeBySex: true})
                        );
                    };

                for (i = 0; i < DLen; i += 1) {
                    key = 'product_' + D[i].id;
                    products[key] = D[i];
                    products[key].productSpecific = [];
                    prepFuncs(i);
                }
                return Q.all(funcs);
            })
            .then(function (D1) { // D1: product specific array's array.
            /*
                [{
                    product_{id}: {
                        male: [],
                        female: [],
                        unisex: []
                }]
            */
                var i, j;
                // Put pSpecifics to products
                for (i = 0; i < D1.length; i += 1) {
                    for (j in D1[i]) {
                        products[j].productSpecific = D1[i][j];
                    }
                }
                return q.resolve(products);
            })
            .catch(function (E) {
                console.log('listProducts E: ', E);
                return q.reject(E);
            });
            return q.promise;
        },
        listProductsPage: function (req, res) {
            var brandName = req.params.brand,
                output = {
                    title: brandName + ' 產品',
                    js: ['product.js']
                },
                uuidMod = require('node-uuid'),
                uuidCookieRaw = req.cookies.uuid,
                uuid = uuidMod.v4();
//            req.setLocale('zh-tw');
            if (typeof uuidCookieRaw !== 'undefined' && uuidCookieRaw !== '""') {
                uuid = uuidCookieRaw.substring(1, uuidCookieRaw.length - 1);
            }
            output.uuid = uuid;
            brand.find({slug: brandName})
            .then(function (D) {
                if (D.length > 0) {
                    output.brand = D;
                    output.b_id = D.id;
                    return productController.listProducts(brandName);
                }
                throw new Error('已迷路, brandName: ' + brandName);
            })
            .then(function (D1) {
                output.products = D1;
                return renderService.html(res, 'products', output);
            })
            .catch(function (E) {
                console.log('listProductsPage E: ', E);
                return res.send('err');
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
                            errormsg: '請填入電子郵件',
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
                            errormsg: '請填入收件人姓名',
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
                            errormsg: '請填入電話',
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
        addCartPriceInfo: function (cartObj) {
            var q = Q.defer(),
                items = cartObj.items,
                itemsLen = items.length,
                productSpecificIds = [],
                output = cartObj,
                i;

            for (i = 0; i < itemsLen; i += 1) {
                productSpecificIds.push(items[i].productSpecific);
            }          
            productSpecific.find(productSpecificIds)
            .then(function (D) {
                var DLen = D.length,
                    itemsLen = output.items.length,
                    i,
                    ps_id,
                    ph,
                    price,
                    dataMap = {};

                for (i = 0; i < DLen; i += 1) {
                    dataMap[D[i].id] = {
                        retail: D[i].retail,
                        sale: D[i].sale,
                        onSale: D[i].onSale
                    };
                }
                for (i = 0; i < itemsLen; i += 1) { // Append price
                    ps_id = output.items[i].productSpecific;
                    ph = dataMap[ps_id];
                    output.items[i].retail = ph.retail;
                    output.items[i].sale = ph.sale;
                    output.items[i].onSale = ph.onSale;
                    price = (ph.onSale) ? ph.sale : ph.retail;
                    output.items[i].itemSum = price * output.items[i].count;
                }
                return q.resolve(output);
            })
            .catch(function (E) {
                console.log('addCartPriceInfo error: ', E);
                return q.reject(E);
            });
            return q.promise;
        },
        checkout: function (uuid) {
            var q = Q.defer(),
                output;

            sails.controllers.cart.read(uuid)
            .then(function (D) { // D: cart data.
                if (typeof D === 'undefined') {
                    return q.resolve(D);
                }
                var items = D.items,
                    sortedItems = dataService.sort(items, {key: 'productSpecific', descend: false});
                D.items = sortedItems;
                return productController.addCartPriceInfo(D); // append price info: retail, sale, itemSum
            })
            .then(function (D1) {
                return q.resolve(D1);
            })
            .catch(function (E) {
                return q.reject(E);
            });
            return q.promise;
        },
        checkoutPage: function (req, res) {
            var uuidRaw = req.cookies.uuid,
                uuid,
                brandName = req.params.brand,
                content,
                finalResult = {},
                renderPage = function (result) {
                    //Shipping use model
                    brand.findOne({brandName: brandName})
                    .then(function (D) {
                        content = {
                            cart: result,
                            form: productController.generateCheckoutForm(),
                            shipping: 80
                        };
                        renderService.html(res, 'checkout', {
                            title: '結帳',
                            js: ['checkout.js'],
                            uuid: uuid,
                            brand: D,
                            content: content
                        });  
                    })
                    .catch(function (E) {
                        console.log('checkoutPage E: ', E);
                    });
                };
            if (typeof uuidRaw !== 'undefined') {
                uuid = uuidRaw.substring(1, uuidRaw.length - 1);

                productController.checkout(uuid)
                .then(function (D) {
                    return renderPage(D);
                })
                .catch(function (E) {
                    console.log('E: ', E);
                });
            } else {
                return renderPage();
            }
        }
    };

module.exports = productController;