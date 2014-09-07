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
            var cart = that.returnUpdatedCart();
            X.cart.update(cart, function (err, data) {
                // after clicked refresh-btn
                that.getSum();
                $('.refresh-cart').addClass('D-n');
            }); 
        });
        submitOrderBtn.click(function (e) {
            that.submitOrder();
        });
        // init nodes
        this.nodes = {
            sum: $('.sum'),
            subtotal: $('.subtotal')
        };
        this.getSum();
    },
    returnUpdatedCart: function () {
        var that = this,
            i,
            items = $('.item'),
            itemsLen = items.length,
            itemsJSON = {},
            ph,
            sale,
            retail,
            price;

        for (i = 0; i < itemsLen; i += 1) {
            ph = $(items[i]);
            sale = ph.find('.sale');
            retail = ph.find('.retail');
            if (sale.length > 0) {
                price = sale.html();
            } else {
                price = retail.html();
            }

            itemsJSON[ph.attr('data-pid')] = {
                count: ph.find('.count-input').val(),
                price: parseInt(price)
            }
        }
        return itemsJSON;
    },
    updateCartVal: function (node) {
        var refreshBtn = $('.refresh-cart'),
            item = node.parents('.item'),
            count = item.find('.count-input'),
            itemSum = item.find('.item-sum'),
            countVal = parseInt(count.val()),
            sale = item.find('.sale'),
            retail = item.find('.retail'),
            price = (sale.length > 0) ? sale.html() : retail.html(); // price = sale when on sale

        if (node.hasClass('plus')) {
            countVal += 1;
        } else if (node.hasClass('minus')){
            countVal = Math.max((countVal - 1), 0);
        }
        refreshBtn.removeClass('D-n');
        count.val(countVal);
        itemSum.html(countVal * parseInt(price));
    },
    getSum: function () {
        var i,
            itemSums = $('.item-sum'),
            itemSumsLen = itemSums.length,
            ph,
            shipping = parseInt($('.shipping').html()),
            sum = 0;

            for (i = 0; i < itemSumsLen; i += 1) {
                ph = itemSums[i];
                sum += parseInt(ph.innerText);
            }
            this.nodes.sum.html(sum);
            this.nodes.subtotal.html(sum + shipping);
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
            cart = this.returnUpdatedCart(),
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
            recipient: {
                email: $('.email').val(),
                name: $('.recipient').val(),
                phone: $('.phone').val(),
                zip: $('.zip').val(),
                address: $('.address').val(),
                country: $('.country').val()
            },
            brand: {
                shipping: parseInt($('.shipping').html())
            },
            order: {
                uuid: X.uuid.read(),
                items: cart,
                note: $('.note').val()
            }
        };
        this.submitOrderAjax(order, function (err, data) {
            console.log('err: ', err);
            console.log('data: ', data);
            var msg = '訂單送出, 確認信已寄到' + order.recipient.email;
            $('.main>.bd').text(msg);
            X.uuid.delete();
            // redirect
        });
    }
};
X.checkout.event();