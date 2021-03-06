var Q = require('q'),
    s3 = require('skipper-s3'),
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
            options.adapter = s3;
            console.log('upload 1, params.key: ', params.key);
            console.log('upload 1a, options: ', options);
            req.file(params.key).upload(options, function (err, files) {
                console.log('upload 222222');
                if (err) {
                    console.log('upload 2, err: ', err);
                    return q.reject(err);
                }
                console.log('upload 2, files 1: ', files);
                //create db entry
                files.forEach(function (item) {
                    item.brand = brandId;
                    item.brandName = brandName;
                    item.url = item.extra.Location;
                    item.purpose = params.purpose;
                    item.published = true;
                });
                console.log('upload 2, files 2: ', files);
                file.create(files)
                .then(function (D) {
                    return q.resolve(D);                    
                })
                .catch(function (E) {
                    console.log(E);
                    console.log('upload error: ', E);
                    return q.reject(E);
                });
            });
            console.log('upload1, after upload command');
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