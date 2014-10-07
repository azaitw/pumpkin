X.init = function () {
    $.cookie.json = true;
};
X.common = {
    translateSex: function (string) {
        var probe = string.indexOf('male'),
            str = '';
        switch (probe) {
        case 0: //male
            str = '男版';
            break;
        case 2: //female
            str = '女版';
            break;
        }
        return str;
    },
    fieldIsCorrect: function (node) {
        if (node.val() !== '') {
            return true;
        }
        return false;
    }
}
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
    attrs: {
        count: 0,
        toUpdateCartCount: 0
    },
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
            X.cart.attrs.count += 1;
            X.cart.updateCartCount();
        });
    },
    update: function (items, callback) {
        var ajaxParams = {
            uuid: X.uuid.read(),
            items: items
        };
        X.cart.ajax(ajaxParams, function (err, data) {
            X.cart.read(function(){});
            callback(null, data);
        });
    },
    read: function (callback) {
        var ajaxParams = {
            uuid: X.uuid.read()
        }
        X.cart.ajax(ajaxParams, function (err, data) {
            callback(null, data);
            X.cart.getItemCount(data);
        });
    },
    getItemCount: function (data) {
        var i,
            total = 0,
            cart = data.items || data;
        for (i in cart) {
            if (cart.hasOwnProperty(i)) {
                total += cart[i].count;
            }
        }
        this.attrs.count = total;
        if (this.attrs.toUpdateCartCount) {
            this.updateCartCount();
        }
    },
    updateCartCount: function () {
        var itemCount = $('.cart .items-count');
        itemCount.html(this.attrs.count);
        if (this.attrs.count > 0) {
            itemCount.removeClass('D-n');
            itemCount.addClass('anim-pop');
            setTimeout(function() {
                itemCount.removeClass('anim-pop');
            }, 201)
        } else {
            itemCount.addClass('D-n');
        }
    }
};
X.init();