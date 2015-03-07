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
        var replacePartials = ['header', 'footer'];
        var i;
        var key;
        var renderObj = {
                partials: {
                    head: 'head',
                    css: 'lib/css',
                    script: 'lib/script',
                    header: 'header',
                    footer: 'footer',
                    sourceDecoration: 'lib/sourceDecoration',
                    body: params.templates.body || 'generic/form'
                }
            };
        for (i = 0; i < replacePartials.length; i += 1) {
            key = replacePartials[i];
            if (typeof params.templates[key] !== 'undefined') {
                if (params.templates[key] !== '') {
                    renderObj.partials[key] = params.templates[key];
                } else {
                    renderObj.partials[key] = 'lib/empty';
                }
            }
        }
        console.log('renderObj: ', renderObj);
        renderObj.title = params.title;
        return res.render('index', renderObj);
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
