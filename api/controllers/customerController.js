var Q = require('q'),
    customerController = {
        /*  
        inputObj: {     
            brand
            email
            customerName
            phone
            zip
            address
            country
        }
        */
        createCustomer: function (inputObj) {
            var q = Q.defer();
            customer.findOne({brand: inputObj.brand, email: inputObj.email})
            .then(function(D) {
                if (typeof D !== 'undefined') { // customer exist
                   return q.reject(D);
                }
                return customer.create(inputObj);
            })
            .then(function (D1) {
                return q.resolve(D1);
            });
            return q.promise;
        },
        manageCustomerPage: function (req, res) {
            var brandName = req.params.brand,
                action = req.params.action,
                params = req.body;
            brand.findOne({brandName: brandName})
            .then(function (D1) {
                switch (action) {
                case 'create':
                    break;

                case 'update':
                    customer.update({id: params.id}, params, function (err, D2) {
                        return res.send(D2[0]);
                    });
                    break;

                default: //read
                    customer.find({brand: D1.id}, function (err, D2) {
                        return res.render('index', {
                            partials: {
                                head: 'head',
                                header: 'header',
                                body: 'customer'
                            },
                            title: brandName + ' 客戶管理頁面',
                            h1: brandName + ' 客戶管理頁面',
                            brand: brandName,
                            isAdmin: true,
                            body: D2,
                            js: ['manage.js']
                        }); 
                    });
                }
            });
        }
    };
module.exports = customerController;