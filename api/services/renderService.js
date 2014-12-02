module.exports = {
    _config: {

    },
    html: function (res, bodyTemplateName, params) {
        var i,
            renderObj = {
                partials: {
                    head: 'head',
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
        /*
            return res.render('index', {
                partials: {
                    head: 'head',
                    header: 'header',
                    body: 'signup'
                },
                title: 'Register a Pumpkin Lab account',
                h1: '註冊 Pumpkin Lab 帳號',
                action: 'register',
                js: ['signup.js'],
                form: brandController.generateSignupForm()
            });
        */
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
