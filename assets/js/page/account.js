X.account = {
    attrs: {},
    event: function () {
        var submitBtn = $('.submitBtn');
        $.get('/templates/account.js', function (data) {
            func = new Function(data);
            func();
        });
        submitBtn.click(function (e) {
            var val = $('.email').val(),
                toValidate = $('.toValidate'),
                toValidateLen = toValidate.length,
                flag = true,
                url = window.location.href,
                i;
            for (i = 0; i < toValidateLen; i += 1) {
                if (!X.account.isValid($(toValidate[i]))) {
                    flag = false;
                }
            }
            if (flag === true) {
                
                window.location.href = url + '?email=' + val;
                /*
                $.post(
                    '/' + X.params.brand + '/account',
                    {email: val},
                    function (data) {
                        if (data === '') {
                            alert('查無資料');
                            return;
                        }
                        X.account.attrs.email = val;
                        X.account.attrs.orders = data;
                        X.account.generateResult(data);
                    }
                );
                */
            }
        });
        X.account.bindVerifyEvent();
    },
    generateResult: function (input) {
        var func,
            template = JST['views/account.handlebars'],
            output;
        output = template({h1: '查詢訂單', content: input});
        $('.bd.main').html(output);
        X.account.bindVerifyEvent();
    },
    showVerifyPage: function (key) {
        var popWrap = $('.pop-wrap'),
            pop = $('.pop'),
            template = JST['views/pop.handlebars'],
            closeBtn,
            submitBtn,
            data = this.attrs.orders,
            output;

        data[key].checked = true; // Mark clicked item
        output = template(data);
        pop.html(output);        
        closeBtn = $('.close-btn');
        submitBtn = $('.verify-submit');
        popWrap.removeClass('D-n');
        closeBtn.click(function (e) {
            $('.pop-wrap').addClass('D-n');
        });
        submitBtn.click(function (e) {
            X.account.submitVerification();
        });
    },
    parseOrders: function () {
        var i,
            items = $('.account .item'),
            itemsLen = items.length,
            ph,
            orders = [];

        for (i = 0; i < itemsLen; i += 1) {
            ph = $(items[i]);
            orders.push({
                id: ph.attr('data-index'),
                subtotal: ph.attr('data-price'),
                status: ph.attr('data-disabled')
            });
        }
        this.attrs.orders = orders;
    },
    bindVerifyEvent: function () {
        var that = this,
            verifyBtns = $('.verify-btn'),
            key;

        verifyBtns.click(function (e) {
            key = $(e.currentTarget).data('index');
            if (typeof that.attrs.orders === 'undefined') {
                that.parseOrders();
            }
            X.account.showVerifyPage(key);
        });
    },
    fieldIsCorrect: function (node) {
        if (node.val() !== '') {
            return true;
        }
        return false;
    },
    isValid: function (node) {
        var inputField = node.parent().parent();
        if (this.fieldIsCorrect(node)) {
            inputField.removeClass('showErr');
            return true;
        }
        inputField.addClass('showErr');
        return false;
    },
    validateFields: function () {
        var i,
            container = $('.toValidate'),
            containerLen = container.length,
            orderToVerify = $('.order-to-verify'),
            checkboxInput = $('.checkbox-input'),
            orderToVerifyLen = orderToVerify.length,
            flag = true,
            inputCounter = 0;

        for (i = 0; i < containerLen; i += 1) {
            if (!this.isValid($(container[i]))) {
                flag = false;
            }
        }
        for (i = 0; i < orderToVerifyLen; i += 1) {
            if ($(orderToVerify[i]).is(':checked')) {
                inputCounter += 1;
            }
        }
        if (inputCounter === 0) {
            checkboxInput.addClass('showErr');
        }
        return flag;
    },
    submitVerification: function () {
        var i,
            input,
            url = location.protocol + '//' + location.host + '/' + X.params.brand + '/account/?email=' + this.attrs.email,
            placeholder,
            orderToVerify;
        ;
        if (this.validateFields()) {
            orderToVerify = $('.order-to-verify');
            orderToVerifyLen = orderToVerify.length;
            input = {
                transferInfo: {
                    bankCode: $('.bankCode').val(),
                    bankAccountTail: $('.bankAccountTail').val(),
                    transferAmount: $('.transferAmount').val()
                },
                ordersToVerify: []
            };
            for (i = 0; i < orderToVerifyLen; i += 1) {
                placeholder = $(orderToVerify[i]);
                if (placeholder.is(':checked') && !placeholder.is(':disabled')) {
                    input.ordersToVerify.push(placeholder.attr('data-index'));
                }
            }
            $.post('/' + X.params.brand + '/account/verify',
                input,
                function (data) {
                    location.reload();
            });
        }
    }
};
X.account.event();