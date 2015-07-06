//var handlebars = require('handlebars');
var Q = require('q');
module.exports = {
    _config: {

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
    // To be deprecated
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

    },
/*
======================
2.0 render services
======================    
*/
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
    /* translate abcPage action to abc, and append /js/page/abc.js and /styles/page/abc.js links
    returnStaticFiles: function (actionName) {
        var jsFiles = [];
        var cssFiles = [];
        var fileName;
        if (actionName.indexOf('page') > 0) {
            fileName = actionName.substring(0, actionName.indexOf('page'));
            jsFiles.push('/js/page/' + fileName + '.js');
            cssFiles.push('/styles/page/' + fileName + '.css');
        }
        return [jsFiles, cssFiles];
    },
    */
    returnTemplates: function (templates) {
        return {
            css: 'lib/css',
            script: 'lib/script',
            header: templates.header || 'header',
            footer: templates.footer || 'footer',
            sourceDecoration: 'lib/sourceDecoration',
            body: templates.body || 'lib/form',
            form: 'lib/form'
        };
    },
    appendModuleFiles: function (renderObj, modules) {
        var i;
        var placeholder;
        if (typeof modules === 'undefined') {
            return renderObj;
        }
        for (i = 0; i < modules.length; i += 1) {
            placeholder = modules[i];
            renderObj.js.push('/js/modules/' + placeholder + '.js');
            renderObj.css.push('/styles/modules/' + placeholder + '.css');
            renderObj.partials[placeholder] = 'modules/' + placeholder;
        }
        return renderObj;
    },
    //contentObj: {}
    //options: (optional) formAction, templates and js
    /*
    options: (optional) {
        templates: {}
        js: [],
        css: [],
        module: []
    }
    */
    html: function (req, res, contentObj, options) {
        var opts = options || {};
        var q = Q.defer();
        var renderObj = JSON.parse(JSON.stringify(contentObj));
        renderObj.js = opts.js || []; // JS files
        renderObj.css = opts.css || []; // CSS files
        renderObj.partials = this.returnTemplates(opts.templates); // templates
        renderObj.time = this.returnTimeObj(); // time
        this.appendModuleFiles(renderObj, opts.modules); // modules

        if (req.params && req.params.brand) { // add brand info to contentObj if available
            this.returnBrandObj(req.params.brand)
            .then(function (D) {
                renderObj.brand = D;
                contentObj.brand = D;
                renderObj.paramsRaw = JSON.stringify(contentObj); // For client-side rendering
                return q.resolve(res.render('layout', renderObj));
            });
        } else { // render without brand obj
            renderObj.paramsRaw = JSON.stringify(contentObj); // For client-side rendering
            return q.resolve(res.render('layout', renderObj));
        }
        return q.promise;
    }
};
