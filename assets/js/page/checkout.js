X.checkout = {
    event: function () {
        var countBtns = $('.count-btn'),
            submitOrderBtn = $('.submit-order'),
            refreshCartBtn = $('.refresh-cart'),
            countInputs = $('.count-input'),
            that = this;
        countBtns.click(function (e) {
            var node = $(e.currentTarget);
            that.updateCartVal(node);
        });
        countInputs.blur(function (e) {
            var node = $(e.currentTarget);
            that.updateCartVal(node);
        });
        refreshCartBtn.click(function (e) {
           X.cart.update(function (err, data) {
               // after clicked refresh-btn
           }); 
        });
        submitOrderBtn.click(function (e) {
            that.submitOrder();
        });
        // init nodes
        this.nodes = {
            retailSum: $('.retailSum'),
            saleSum: $('.saleSum'),
            subtotal: $('.subtotal')
        };
        this.initCartCalc();
    },
    initCartCalc: function () {
        var i,
            obj = X.params.json.items || {},
            resultObj = {},
            placeholder;
        for (i in obj) {
            placeholder = obj[i];
            resultObj[i] = {
                name: placeholder.name,
                sex: placeholder.sex,
                size: placeholder.size,
                count: placeholder.count,
                retail: placeholder.retail,
                sale: placeholder.sale
            };
        }
        X.params.cart = resultObj;
        X.params.shipping = parseInt($('.shipping').text());
        this.getSum();
    },
    updateCartVal: function (node) {
        var count  = node.parent().children('.count-input'),
            countVal = parseInt(count.val());
        if (node.hasClass('plus')) {
            countVal += 1;
        } else if (node.hasClass('minus')){
            countVal = Math.max((countVal - 1), 0);
        }
        count.val(countVal);
        X.checkout.updateCartObj(node);
    },
    updateCartObj: function (node) {
        var countWrapper = node.parent(),
            pid = node.closest('.item').data('pid'),
            calculator = $('.calculator'),
            count = countWrapper.children('.count-input').val();
            X.params.cart[pid].count = count;
            X.checkout.getSum();
            calculator.addClass('needRefresh');
    },
    getSum: function () {
        var i,
            obj = X.params.cart,
            placeholder,
            retailSum = 0,
            saleSum = 0,
            sale,
            retail,
            subtotal = X.params.shipping;
        for (i in obj) {
            retail = parseInt(obj[i].retail) * parseInt(obj[i].count);
            retailSum += retail;
            if (typeof obj[i].sale !== 'undefined') { //on sale
                sale = parseInt(obj[i].count) * parseInt(obj[i].sale)
                saleSum += sale;
                subtotal += sale;
            } else {
                subtotal += retail
            }
        }
        this.nodes.retailSum.text(retailSum);
        this.nodes.saleSum.text(saleSum);
        this.nodes.subtotal.text(subtotal);
    },
    calcItemSum: function (node) {
        var item = node.parent(),
            sale = parseInt($('.sale', item).html()),
            count = $('.count', item),
            countVal = parseInt(count.html()),
            pid = item.data('pid'),
            result = $('.item-sum', item),
            shipping = parseInt($('.shipping').html()),
            sum = $('.sum'),
            sumVal = parseInt(sum.html());
        if (node.hasClass('plus')) {
            countVal += 1;
            sumVal += sale;
        } else {
            countVal = Math.max(0, countVal - 1);
            if (countVal >= 0) {
                sumVal -= sale;
            }
        }
        count.text(countVal);
        result.text(countVal * sale);
        sum.text(sumVal);
        //Update cookie
        //X.cart.update(pid, countVal, {keepEntry: true});
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
    submitOrderAjax: function (obj, callback) {
        $.post(
            '/' + X.params.brand + '/order',
            obj,
            function (data) {
                callback(null, data);
            }
        );
    },
    submitOrder: function () {
        var i,
            flag = true,
            container = $('.toValidate'),
            containerLen = container.length,
            cart = X.params.cart,
            order;

        for (i = 0; i < containerLen; i += 1) {
            if (!this.isValid($(container[i]))) {
                flag = false;
            }
        }
        if (flag === false) {
            return;
        }
        order = {
            uuid: X.uuid.read(),
            recipient: {
                email: $('.email').val(),
                name: $('.recipient').val(),
                phone: $('.phone').val(),
                zip: $('.zip').val(),
                address: $('.address').val(),
                country: $('.country').val()
            },
            shipping: X.params.shipping,
            order: cart,
            note: $('.note').val()
        }
        this.submitOrderAjax(order, function (err, data) {
            var msg = '訂單送出, 確認信已寄到' + order.recipient.email;
            $('.main>.bd').text(msg);
            X.uuid.delete();
            // redirect
        });
    }
};
X.checkout.event();