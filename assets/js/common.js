X.init = function () {
    $.cookie.json = true;
    this.event();
    this.getCartItemCount('.itemCount');
};
X.event = function () {
    var cartBtn = $('.cart-btn'),
        cart = $('.cart');
    cartBtn.click(function () {
        cart.toggleClass('D-n');
        X.cart.getItemCount();
    });
};
X.getCartItemCount = function (nodeClass) {
        var indicator  = $(nodeClass),
            count = this.cart.getItemCount();
        indicator.html(count);
};
X.getCart = function (nodeClass) {
    var node = $(nodeClass),
        populateCart = function (node, obj) {
            var i,
                result = '<ul>',
                cart = obj.items;
            // Use template engine for this
            for (i in cart) {
                if (cart[i].count > 0) {
                    result += '<li>';
                    result += '<span class="name">';
                    result += cart[i].name;
                    result += '</span>';
                    result += '<span class="count">';
                    result += cart[i].count;
                    result += '</span>';
                    result += '</li>';
                } else {
                    X.cart.update(i, 0)
                }
            }
            result += '</ul>';
            node.html(result);
        };

    X.cart.read(function (err, cart) {
        populateCart(node, cart);
    });
};
X.uuid = {
    create: function (uuid) {
        $.cookie('uuid', uuid, {path: '/' + X.params.brand, expires: 30});
        return true;
    },
    read: function () {
        var uuid = $.cookie('uuid');
        if (typeof uuid === 'undefined' && typeof X.params.uuid !== 'undefined') { //create
            X.uuid.create(X.params.uuid);
            return X.params.uuid;
        } else if (uuid === ''){
            X.uuid.create(X.params.uuid);
        } else {
            return uuid;
        }
    },
    delete: function () {
        $.removeCookie('uuid', {path: '/' + X.params.brand});
        delete X.params.uuid;
        return true;
    }
};
X.cart = {
    ajax: function (params, callback) {
        $.post(
            '/' + X.params.brand + '/updateCart',
            params,
            function (data) {
                callback(null, data);
            }
        );
    },
    add: function (params, callback) {
        /*
            If post itemKey, it's add
        */
        var itemKey = params.itemKey,
            ajaxParams = {
                uuid: params.uuid,
                itemName: params.itemName,
                itemKey: itemKey
            };
        X.cart.ajax(ajaxParams, function (err, data) {
            callback(null, data);
        });
    },
    update: function (callback) {
        var ajaxParams = {
            uuid: X.uuid.read(),
            items: X.params.cart
        };
        X.cart.ajax(ajaxParams, function (err, data) {
            callback(null, data);
        });
    },
    read: function (callback) {
        var ajaxParams = {
            uuid: X.uuid.read()
        }
        X.cart.ajax(ajaxParams, function (err, data) {
            callback(null, data);
        });
    },
    getItemCount: function () {
        var cart = $.cookie('cart') || {},
            i,
            count = 0;
        for (i in cart) {
            count += cart[i].count;
        }
        return count;
    }
};
X.init();