var handlebars = require('handlebars');

module.exports = {
    _config: {

    },
    html: function (res, bodyTemplateName, params) {
        var i,
            renderObj = {
                partials: {
                    head: 'head',
                    css: 'lib/css',
                    script: 'lib/script',
                    sourceDecoration: 'lib/sourceDecoration',
                    header: 'header',
                    footer: 'footer',
                    body: bodyTemplateName
                }
            };
        for (i in params) {
            if (params.hasOwnProperty(i)) {
                renderObj[i] = params[i];
            }
        }
        return res.render('index', renderObj);
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
        var renderObj = {
                partials: {
                    css: 'lib/css',
                    script: 'lib/script',
                    header: params.templates.header || 'header',
                    footer: params.templates.footer || 'footer',
                    sourceDecoration: 'lib/sourceDecoration',
                    body: params.templates.body || 'lib/form'
                }
            };
        for (i in params) {
            if (params.hasOwnProperty(i) && i !== 'templates') { // data
                renderObj[i] = params[i];
            }
        }
        return res.render('index-new', renderObj);
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
