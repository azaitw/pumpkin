var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
var Q = require('q');
var siteController = {
    indexPage: function (req, res) {
        var features = [
            {
                title: '客製化',
                desc: 'Beardude Engine 提供完全的頁面客製化自由度，讓您打造符合品牌風格的網站門面。我們也提供額外的客製化服務，為您精製專為電腦、平板與手機優化的網站。'
            },
            {
                title: '月租費',
                desc: '單一商店月租費僅 ? 元，單件商品依付款方式收5~7%手續費。同時以最合理實惠的方式提供各種客製化的服務。'
            },
            {
                title: '購物車',
                desc: '購物車除了方便顧客使用，同時提供追蹤尚未結帳的購物車。'
            },
            {
                title: '各種付款',
                desc: '信用卡, Paypal, 貨到付款, 便利商店, 銀行轉帳。'
            },
            {
                title: '促銷工具',
                desc: '可以依需求設定各種促銷方案，發送商店專屬的促銷郵件'
                /*
                coupon:
                    unlimited
                    單一
                    多個
                限時折扣
                買滿 x 元打 y 折
                買滿 x 元折 y 元
                買滿 x 件 免運費
                */
            },
            {
                title: '庫存管理',
                desc: '提供簡易的庫存管理'
            },
            {
                title: '運費管理',
                desc: '可設定不同的運費規則，例如使用不同的郵寄服務與跨國寄送的運費計算'
            },
            {
                title: '獨立的網址',
                desc: '可申請您專屬的網址'
            },
            {
                title: 'Facebook整合',
                desc: '粉絲團/帳號自動上架'
            }
        ];
        var isLoggedIn = authService.isLoggedIn(req);
        var params = {
            title: 'Beardude Engine 建立您專屬的網路商店',
            features: features,
            isLoggedIn: isLoggedIn
        };
        var options = {
            templates: {
                body: 'index'
            },
            css: ['/styles/pages/index.css'],
            modules: ['signupForm']
        };
        renderService.html(req, res, params, options);
    },
    renderSignupPage: function (req, res, value) { // Generic signup page rendering
        var params = {
            title: '註冊 Beardude Engine 帳號'
        };
        var options = {
            modules: ['signupForm'],
            templates: {
                body: 'signup'
            }
        };
        if (typeof value !== 'undefined') {
            params.email = value.email;
            params.errors = value.errors;
        }
        return renderService.html(req, res, params, options);
    },
    signup: function (req, res) { // POST
        user.create(req.body)
        .then(function (D) {
            req.session.credentials = email;
            return res.redirect('/engine');
        })
        .catch(function (E) {
            var value = {
                email: req.body.email || undefined,
                errors: errorService.returnErrorMessages(E)
            };
            return siteController.renderSignupPage(req, res, value);
        });
    },
    signupPage: function (req, res) { // Login page
        if (authService.isLoggedIn(req)) { // redirect to engine if logged in
            return res.redirect('/engine');
        }
        return this.renderSignupPage(req, res);
    },
    renderLoginPage: function (req, res, value) {
        var params = {
            title: '登入 Beardude Engine'
        };
        var options = {
            modules: ['loginForm'],
            templates: {
                body: 'login'
            }
        };
        if (typeof value !== 'undefined') {
            params.email = value.email;
            params.errors = value.errors;
        }
        return renderService.html(req, res, params, options);
    },
    validateLoginInput: function (req, res, email, password) {
        var value = {errors: {}};
        var hasError = false;
        if (typeof email === 'undefined' || email === '') {
            value.errors.email = '欄位為必填';
            hasError = true;
        } else {
            value.email = email;
            if (!validator.isEmail(email)) {
                value.errors.email = '電子信箱的格式錯誤';
                hasError = true;
            }
        }
        if (typeof password === 'undefined' || password === '') {
            value.errors.password = '欄位為必填';
            hasError = true;
        }
        if (hasError) { // If either is not entered correctly, return error
            siteController.renderLoginPage(req, res, value);
            return false;
        }
        return true;
    },
    login: function (req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var returnError = function (req, res, type) {
            var value = {
                email: email,
                errors: {}
            };
            if (type === 'value') {
                value.errors.general = '帳號或密碼錯誤';
            }
            if (type === 'unknown') {
                value.errors.general = '未知的錯誤';
            }
            return siteController.renderLoginPage(req, res, value);
        };
        var isValid = siteController.validateLoginInput(req, res, email, password);
        
        if (isValid) {
            user.findOne({email: email}) // authenticate user
            .then(function (D) {
                if (typeof D === 'undefined') { // user not found
                    return returnError(req, res, 'value');
                }
                bcrypt.compare(password, D.password, function (E, D1) {
                    if (E) {
                        console.log('login E: ', E);
                        return returnError(req, res, 'unknown');
                    }
                    if (!D1) { // password incorrect
                        return returnError(req, res, 'value');
                    }
                    req.session.credentials = email;
                    return res.redirect('/engine');
                });
            })
            .catch(function (E) {
                console.log('login E: ', E);
                return returnError(req, res, 'unknown');
            });
        }
    },
    loginPage: function (req, res) {
        if (authService.isLoggedIn(req)) {
            return res.redirect('/engine');
        }
        return this.renderLoginPage(req, res);
    },
    engineIgnitePage: function (req, res) {
        var email = req.session.credentials;
        brand.find({creator: email})
        .then(function (D) {
            var brandCount = D.length;
            var brandName;
            var params;
            var options;
            if (brandCount === 1) {
                brandName = D[0].name;
                return res.redirect('/engine/' + brandName);
            } else if (brandCount === 0) {
                params = {
                    title: '建立您的第一個品牌'
                };
                options = {
                    modules: ['createBrandForm'],
                    templates: {
                        body: 'engineIndex'
                    }
                };
                if (typeof value !== 'undefined') {
                    params.email = value.email;
                    params.errors = value.errors;
                }
                return renderService.html(req, res, params, options);
            } else { // More than one brand
                console.log('to be completed')
            }       
        });
    },
    engineIndexPage: function (req, res) {
        
    }
};
module.exports = siteController;