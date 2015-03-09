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

            customer.findOrCreate({brand: inputObj.brand, email: inputObj.email}, inputObj)
            .then(function (D) {
                return q.resolve(D);
            })
            .catch(function (E) {
                console.log('createCustomer error: ', E);
                return q.reject(E);
            });
            /*
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
            */
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
                        return renderService.html(req, res, {
                            templates: {
                                body: 'customer'
                            },
                            title: 'Beardude Engine 顧客管理頁面',
                            js: ['manage.js'],
                            brand: D1,
                            body: D2
                        });
                    });
                }
            });
        }
    };
module.exports = customerController;