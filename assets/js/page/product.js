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

        addButton.click(function () {
            var itemKey = addSelect.val(),
                itemName = $('.add-select option:selected').text(),
                uuid = X.uuid.read();
            X.cart.add({uuid: uuid, itemKey: itemKey, itemName: itemName}, function (err, data) {
                X.getCart('.cart .bd');
            });
        });
        X.getCart('.cart .bd');
    }
};
X.product.event();