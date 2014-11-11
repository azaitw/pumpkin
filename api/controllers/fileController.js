var Q = require('q'),
    mv = require('mv'),
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
                options = {
                    dirname: sails.config.paths.publicFile + brandName.toLowerCase() + '/'
                    //dirname: brandName.toLowerCase() + '/'
                };

            req.file(params.key)
            .upload(options, function (err, files) {
                if (err) {
                    return q.reject(err);
                }
                //create db entry
                files.forEach(function (item) {
                    item.brand = brandId;
                    item.brandName = brandName;
                    item.fd_public = item.fd.replace('uploads', 'public');
                    item.purpose = params.purpose;
                    item.published = true;
                    item.url = '/' + brandName.toLowerCase() + item.fd.substring(item.fd.lastIndexOf('/'));
                });
                file.create(files)
                .then(function (D) {
                    return q.resolve(D);                    
                });
//                return q.resolve(files);
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