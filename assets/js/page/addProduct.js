X.addProduct = {
    event: function () {
        // signup form submit event
        $('.submitBtn').click(function () {
            var productName = $('.productName').val(),
                retail = $('.retail').val(),
                sale = $('.sale').val(),
                brand = $('.brand').val();
                $.post(
                    '/' + brand + '/manage/addedProduct',
                    {
                        productName: productName,
                        retail: retail,
                        sale: sale
                    },
                    function (data) {
                        alert('success');
                    }
                )
        });
    }
};
X.addProduct.event();