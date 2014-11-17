var Q = require('q'),
    fileController = {
        upload: function (req, params) {
            /*
            params: {
                brand
                brandName
                key
                purpose
            }
            */
            var q = Q.defer(),
                brandId = params.brand,
                brandName = params.brandName,
                options = sails.config.connections.s3;
/*                options = {
                    dirname: sails.config.paths.local.public + brandName.toLowerCase() + '/'
                    //dirname: brandName.toLowerCase() + '/'
                };
*/
            req.file(params.key)
            .upload(options, function (err, files) {
                if (err) {
                    return q.reject(err);
                }
                //create db entry
                files.forEach(function (item) {
                    item.brand = brandId;
                    item.brandName = brandName;
                    item.url = item.extra.Location;
                    item.purpose = params.purpose;
                    item.published = true;
                });
                file.create(files)
                .then(function (D) {
                    return q.resolve(D);                    
                })
                .catch(function (E) {
                    console.log(E);
                    return q.reject(E);
                });
            });
            return q.promise;
        }
            /*
        },
        toPublish: function (queryParams) {
            var q = Q.defer();
            file.findOne(queryParams)
            .then(function (D) {
                mv(D.fd, D.fd_public);
                return file.update(queryParams, {published: true});
            })
            .then(function (D) {
                return q.resolve(D);
            })
            .catch(function (E) {
                return q.reject(E);
            });
            return q.promise;
        },
        toUnpublish: function (queryParams) {
            var q = Q.defer();
            file.findOne(queryParams)
            .then(function (D) {
                mv(D.fd, D.fd_public);
                return file.update(queryParams, {published: true});
            })
            .then(function (D) {
                return q.resolve(D);
            })
            .catch(function (E) {
                return q.reject(E);
            });
            return q.promise;
        }
            */
    };

module.exports = fileController;