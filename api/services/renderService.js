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
        });
        return q.promise;
    },
    html: function (req, res, params) {
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
        this.returnBrandObj(req.params.brand)
        .then(function (D) {
            renderObj.brand = D;
            return res.render('layout', renderObj);
        });
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
