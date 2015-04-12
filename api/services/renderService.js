//var handlebars = require('handlebars');
var Q = require('q');
module.exports = {
    _config: {

    },
    returnTimeObj: function () {
        if (typeof dateTimeService !== 'undefined') {
            return {
                year: dateTimeService.getYear(),
                month: dateTimeService.getMonth(),
                day: dateTimeService.getDay()
            };
        }
        return {};
    },
    returnBrandObj: function (brandName) {
        var q = Q.defer();
        brand.findOne({slug: brandName})
        .then(function (D) {
            delete D.createdAt;
            delete D.updatedAt;
            return q.resolve(D);
        })
        .catch(function (E) {
            return q.resolve(false);
        });
        return q.promise;
    },
    htmlOld: function (req, res, params) {
        var i;
        var renderObj = {};
        var brandName = req.params.brand;
        var actionName = req.options.action;
        var jsFile;
        var q = Q.defer();
        for (i in params) {
            if (params.hasOwnProperty(i) && i !== 'templates') { // populate data
                renderObj[i] = params[i];
            }
        }
        if (typeof params.templates === 'undefined') { // create empty template obj when not present
            params.templates = {};
        }
        if (typeof params.js === 'undefined') {
            if (actionName.indexOf('page') > 0) {
                jsFile = actionName.substring(0, actionName.indexOf('page'));
                renderObj.js = jsFile + '.js';
            }
        }
        renderObj.partials = {
            css: 'lib/css',
            script: 'lib/script',
            header: params.templates.header || 'header',
            footer: params.templates.footer || 'footer',
            sourceDecoration: 'lib/sourceDecoration',
            body: params.templates.body || 'lib/form'
        };
        renderObj.time = this.returnTimeObj();
        if (typeof brandName !== 'undefined') {
            
        }
        if (renderObj.partials.body === 'lib/form') {
            renderObj.formAction = req.route.path;
            renderObj.partials.preForm = params.templates.preForm || 'lib/empty';
            renderObj.partials.postForm = params.templates.postForm || 'lib/empty';
        }
        if (typeof params.brand === 'undefined') {
            this.returnBrandObj(req.params.brand)
            .then(function (D) {
                if (D) {
                    renderObj.brand = D;
                }
                return q.resolve(res.render('layout', renderObj));
            });
        } else {
            return resolve(res.render('layout', renderObj));
        }
        return q.promise;
    },
    /*
    Use this with index-new.handlebars
    params: {
        templates: {
            header: 'HEADER',
            body: 'BODY',
            footer: 'FOOTER'
        },
        sourceDecoration: true/false,
        title: 'TITLE'
    }
    */
    renderHtml: function (res, params) {
        var i;
        var renderObj = {};
        for (i in params) {
            if (params.hasOwnProperty(i) && i !== 'templates') { // populate data
                renderObj[i] = params[i];
            }
        }
        if (typeof params.templates === 'undefined') { // create empty template obj when not present
            params.templates = {};
        }
        renderObj.partials = {
            css: 'lib/css',
            script: 'lib/script',
            header: params.templates.header || 'header',
            footer: params.templates.footer || 'footer',
            sourceDecoration: 'lib/sourceDecoration',
            body: params.templates.body || 'lib/form'
        };
        renderObj.time = this.returnTimeObj();
        return res.render('layout', renderObj);
    },
    //params for data, options for templates
    // auto-load page-specific js
    html: function (req, res, params, options) {
        var renderObj = params;
        var brandName;
        var actionName = req.options.action;
        var templates = options.templates || {};
        var jsFile;
        var q = Q.defer();
        // brand name
        if (req.params && req.params.brand) {
            brandName = req.params.brand;
        }
        // js file
        if (actionName.indexOf('page') > 0) {
            jsFile = actionName.substring(0, actionName.indexOf('page'));
            renderObj.js = jsFile + '.js';
        }
        // template
        renderObj.partials = {
            css: 'lib/css',
            script: 'lib/script',
            header: templates.header || 'header',
            footer: templates.footer || 'footer',
            sourceDecoration: 'lib/sourceDecoration',
            body: templates.body || 'lib/form'
        };
        if (renderObj.partials.body === 'lib/form') {
            renderObj.formAction = req.route.path;
        }
        // time
        renderObj.time = this.returnTimeObj();

        if (typeof brandName !== 'undefined') {
            // render with brand obj
            this.returnBrandObj(req.params.brand)
            .then(function (D) {
                if (D) {
                    renderObj.brand = D;
                }
                return q.resolve(res.render('layout', renderObj));
            });
        } else {
            // render without brand obj
            return q.resolve(res.render('layout', renderObj));
        }
        return q.promise;
    },
    email: function (res, templateName, params) {
        var i,
            renderObj = {};
        for (i in params) {
            if (params.hasOwnProperty(i)) {
                renderObj[i] = params[i];
            }
        }
        return res.render(templateName, renderObj);

    }
};
