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
            return X.params.uuid;
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
        X.cart.ajax(params, function (err, data) {
            callback(null, data);
        });
    },
    update: function (items, callback) {
        var ajaxParams = {
            uuid: X.uuid.read(),
            items: items
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