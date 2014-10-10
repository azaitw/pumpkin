X.product = {
    attrs: {
        transition: 0
    },
    event: function () {
        var cartBtn = $('.cart-btn'),
            cart = $('.cart .bd');
        // Load handlebar template
        $.get('/templates/product.js', function (data) {
            var func = new Function(data);
            func();
        });
        X.cart.attrs.toUpdateCartCount = 1;
        this.translateSexSelect();
        this.bindCartActions();
        this.bindCheckoutAction();
        // Bind cart button event
        cartBtn.click(function () {
            if (X.product.attrs.enabledCheckout) {
                X.common.anim.dissolve(cart);
            }
        });
        X.product.getCart('.cart .bd .bd-ul');
    },
    bindCartActions: function () {
        var addButton = $('.add-button'),
            that = this;
        addButton.click(that.addItemToCart);
    },
    bindCheckoutAction: function (e) {
        var checkoutBtns = $('.checkout-btn'),
            validateCheckout = function (e) {
                var flag = X.product.attrs.enabledCheckout;
                if (flag) {
                    return;
                } else {
                    e.preventDefault();
                }
            };
        checkoutBtns.click(function (e) {validateCheckout(e)});
    },
    addItemToCart: function () {
        var addSelect = $('.add-select'),
            selected = addSelect.find('option:selected'),
            output = {
                uuid: X.uuid.read(),
                add: {
                    productSpecific: selected.data('ps_id'),
                    productName: selected.data('p_name'),
                    sex: selected.data('ps_sex'),
                    size: selected.data('ps_size')
                }
            };

        X.cart.add(output, function (err, data) {
            X.product.attrs.enabledCheckout = 0;
            X.product.getCart('.cart .bd .bd-ul');
        });
    },
    translateSexSelect: function () {
        var node = $('.add-select option'),
            nodeLen = node.length,
            i,
            ph,
            probe,
            str;
        for (i = 0; i < nodeLen; i += 1) {
            ph = $(node[i]).html();
            probe = ph.indexOf('male');
            if (probe >= 0) {
                str = X.common.translateSex(ph) + ph.substring(probe + 4);
                node[i].innerText = str;
            }
        }
    },
    enableCheckout: function () {
        var that = this,
            checkoutBtn = $('.checkout-btn'),
            countBtns = $('.count-btn'),
            countInputs = $('.count-input');

        // Bind cart calc buttons event
        countBtns.click(function (e) {
            that.updateCartVal($(e.currentTarget));
        });
        countInputs.blur(function (e) {
            that.updateCartVal($(e.currentTarget));
        });
        // Mark flag
        this.attrs.enabledCheckout = 1;
    },
    updateCartVal: function (node) {
        var that = this,
            refreshBtn = $('.refresh-cart'),
            item = node.parents('.item'),
            count = item.find('.count-input'),
            countVal = parseInt(count.val());

        this.attrs.valueChanged = true;
        if (node.hasClass('plus')) {
            countVal += 1;
        } else if (node.hasClass('minus')){
            countVal = Math.max((countVal - 1), 0);
        }
        count.val(countVal);
        refreshBtn.removeClass('disabled');
        refreshBtn.removeAttr('disabled');

        refreshBtn.click(function (e) {
            var cart = that.returnUpdatedCart();

            X.cart.update(cart, function (err, data) {
                // after clicked refresh-btn
                refreshBtn.addClass('disabled');
                refreshBtn.prop('disabled', true);
                that.attrs.valueChanged = false;
            }); 
        });
    },
    returnUpdatedCart: function () {
        var that = this,
            i,
            items = $('.item'),
            cart = $('.cart .bd'),
            itemsLen = items.length,
            itemsArray = [],
            ph,
            sale,
            retail,
            price,
            count;

        for (i = 0; i < itemsLen; i += 1) {
            ph = $(items[i]);
            sale = ph.find('.sale');
            retail = ph.find('.retail');
            count = ph.find('.count-input').val();
            if (sale.length > 0) {
                price = sale.html();
            } else {
                price = retail.html();
            }
            if (count <= 0) { // remove cart item with 0 count
                $(items[i]).remove();
            }
            itemsArray.push({
                productName: ph.find('.name').html().trim(),
                sex: ph.find('.sex').html().trim(),
                size: ph.find('.size').html().trim(),
                price: price,
                cartItemId: ph.attr('data-cartitem_id'),
                productSpecificId: ph.attr('data-ps_id'),
                count: count
            });
        }
        if ($('.item').length === 0) {
            this.attrs.enabledCheckout = 0;
            cart.addClass('Op-0');
            cart.addClass('D-n');
        }
        return itemsArray;
    },
    getCart: function (nodeClass) {
        var node = $(nodeClass),
            that = this,
            populateCart = function (node, obj) {
                var template = JST['views/cart.handlebars'],
                    i,
                    ph = [],
                    cart = obj.items;

                for (i in cart) {
                    if (cart[i].count > 0) {
                        ph.push({
                            ps_id: cart[i].productSpecific,
                            cartitem_id: cart[i].id,
                            productName: cart[i].productName,
                            sex: X.common.translateSex(cart[i].sex),
                            size: cart[i].size,
                            count: cart[i].count,
                        });
                    } else {
                        X.cart.update(i, 0)
                    }
                }
                node.html(template(ph));
            };

        X.cart.read(function (err, cart) {
            if (cart && cart.items && cart.items.length > 0) {
                populateCart(node, cart);
                if (!that.attrs.enabledCheckout) {
                    that.enableCheckout();
                    X.product.attrs.enabledCheckout = 1;
                }
            }
        });
    }
};
X.product.event();