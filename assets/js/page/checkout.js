X.checkout = {
    attrs: {},
    event: function () {
        var countBtns = $('.count-btn'),
            submitOrderBtn = $('.submit-order'),
            refreshCartBtn = $('.refresh-cart'),
            countInputs = $('.count-input'),
            that = this;
        this.translateCartSex($('.cart .item .sex'));

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
                $('.refresh-cart').addClass('disabled');
                $('.refresh-cart').prop('disabled', true);
                $('.cart-calc').removeClass('toUpdate');
                that.attrs.valueChanged = false;
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
    translateCartSex: function (node) {
        var nodeLen = node.length,
            i,
            ph;
        for (i = 0; i < nodeLen; i += 1) {
            ph = node[i].innerHTML;
            node[i].innerHTML = X.common.translateSex(ph.trim());
        }
    },
    returnUpdatedCart: function () {
        var that = this,
            i,
            items = $('.item'),
            itemsLen = items.length,
            itemsArray = [],
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
            itemsArray.push({
                productName: ph.find('.name').html().trim(),
                sex: ph.find('.sex').html().trim(),
                size: ph.find('.size').html().trim(),
                price: price,
                cartItemId: ph.attr('data-cartitem_id'),
                productSpecificId: ph.attr('data-ps_id'),
                count: ph.find('.count-input').val()
            });
        }
        return itemsArray;
    },
    updateCartVal: function (node) {
        var refreshBtn = $('.refresh-cart'),
            cartCalc = $('.cart-calc'),
            item = node.parents('.item'),
            count = item.find('.count-input'),
            itemSum = item.find('.item-sum'),
            countVal = parseInt(count.val()),
            sale = item.find('.sale'),
            retail = item.find('.retail'),
            price = (sale.length > 0) ? sale.html() : retail.html(); // price = sale when on sale

        this.attrs.valueChanged = true;
        if (node.hasClass('plus')) {
            countVal += 1;
        } else if (node.hasClass('minus')){
            countVal = Math.max((countVal - 1), 0);
        }
        refreshBtn.removeClass('disabled');
        refreshBtn.removeAttr('disabled');
        cartCalc.addClass('toUpdate');
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
                sum += parseInt(ph.innerHTML);
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
    validatePrice: function () {
        if (this.attrs.valueChanged) {
            alert('請更新購物車');
            return;
        }
        //TO DO: validate if on sale
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
        this.validatePrice();
        order = {
            recipient: {
                email: $('.email').val(),
                name: $('.recipient').val(),
                phone: $('.phone').val(),
                zip: $('.zip').val(),
                address: $('.address').val(),
                country: $('.country').val()
            },
            order: {
                uuid: X.uuid.read(),
                items: cart,
                shipping: parseInt($('.shipping').html()),
                note: $('.note').val()
            }
        };

        this.submitOrderAjax(order, function (err, data) {
            var msg = '<p class="Pt-30 Mt-30 Ta-c Row">訂單送出, 確認信已寄到' + order.recipient.email + '</p>';
            $('.main>.bd').html(msg);
            X.uuid.delete();
            // redirect
        });

    }
};
X.checkout.event();