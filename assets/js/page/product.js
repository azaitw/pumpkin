X.product = {
    event: function () {
        var addSelect = $('.add-select'),
            addButton = $('.add-button');

        addSelect.change(function () {
            if (this.value !== '0') {
                addButton.removeClass('D-n');
            } else {
                if (!addButton.hasClass('D-n')) {
                    addButton.addClass('D-n');
                }
            }
        });
        /*
        addButton.click(function () {
            var itemKey = addSelect.val(),
                itemName = $('.add-select option:selected').text(),
                uuid = X.uuid.read(); // read or create uuid
            X.cart.add({uuid: uuid, itemKey: itemKey, itemName: itemName}, function (err, data) {
                X.product.getCart('.cart .bd');
            });
        });
*/
        addButton.click(function () {
            var selected = addSelect.find('option:selected'),
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
                X.product.getCart('.cart .bd');
            });
        });
        X.product.getCart('.cart .bd');
    },
    getCart: function (nodeClass) {
        var node = $(nodeClass),
            populateCart = function (node, obj) {
                var i,
                    result = '<ul>',
                    cart = obj.items;
                // Use template engine for this
                /*
                    $.get('/templates/account.js', function (data) {
                        func = new Function(data);
                        func();
                        template = JST['views/account.handlebars'];
                        output = template({h1: '查詢訂單', content: input});
                        $('.bd.main').html(output);
                        X.account.bindVerifyEvent();
                    });
                */
                for (i in cart) {
                    if (cart[i].count > 0) {
                        result += '<li>';
                        result += '<span class="name">';
                        result += cart[i].productName;
                        result += '</span>';
                        result += '<span class="sex">';
                        result += cart[i].sex;
                        result += '</span>';
                        result += '<span class="size">';
                        result += cart[i].size;
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
    }
};
X.product.event();