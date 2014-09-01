X.account = {
    event: function () {
        var submitBtn = $('.submitBtn');
        if (X.params.json !== '') {
            X.account.generateResult(X.params.json);
        }
        submitBtn.click(function (e) {
            var val = $('.email').val();
            X.account.getOrderData({email: val}, function (err, data) {
                X.account.generateResult(data);
            });
        });
    },
    getOrderData: function (input, callback) {
        $.post(
            '/' + X.params.brand + '/account/post',
            input,
            function (output) {
                callback(null, output);
            }
        );
    },
    generateResult: function (input) {
        var func,
            template,
            output;
        if (input === '') {
            alert('查無資料');
            return;
        }
        X.params.json = input;
        $.get('/templates/account.js', function (data) {
            func = new Function(data);
            func();
            template = JST['views/account.handlebars'];
            output = template({h1: '查詢訂單', content: input});
            $('.bd.main').html(output);
            X.account.bindVerifyEvent();
        });
    },
    showVerifyPage: function (key) {
        var pop = $('.pop'),
            template = JST['views/pop.handlebars'],
            closeBtn,
            submitBtn,
            data = JSON.parse(JSON.stringify(X.params.json)),
            output;

        data.orders[key].checked = true; // Mark clicked item
        output = template(data);
        pop.html(output);        
        closeBtn = $('.close-btn');
        submitBtn = $('.verify-submit');
        pop.removeClass('D-n');
        closeBtn.click(function (e) {
            $('.pop').addClass('D-n');
        });
        submitBtn.click(function (e) {
            X.account.submitVerification();
        });
    },
    bindVerifyEvent: function () {
        var verifyBtns = $('.verify-btn'),
            key;

        verifyBtns.click(function (e) {
            key = $(e.currentTarget).data('index');
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
        if (flag === false) {
            return;
        }
    },
    submitVerification: function () {
        var i,
            input,
            url = location.protocol + '//' + location.host + '/' + X.params.brand + '/account/?phone=' + X.params.json.phone,
            placeholder,
            orderToVerify;
        this.validateFields();
        orderToVerify = $('.order-to-verify'),
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
                input.ordersToVerify.push(X.params.json.orders[i].orderNumber);
            }
        }
        $.post('/' + X.params.brand + '/account/verify',
            input,
            function (data) {
                window.location.href = url;
        });
    }
};
X.account.event();