X.addProduct = {
    event: function () {
        // signup form submit event
        $('.submitBtn').click(function () {
            var productName = $('.productName').val(),
                retail = $('.retail').val(),
                sale = $('.sale').val(),
                brand = $('.brand').val(),
                brandId = $('.b_id').val(),
                url = document.URL,
                redirectUrl = url.substring(0, url.lastIndexOf('/'));

                $.post(
                    '/' + brand + '/manage/addProduct',
                    {
                        brandId: brandId,
                        productName: productName,
                        retail: retail,
                        sale: sale
                    },
                    function (data) {
                        alert('success');
                        return window.location.href = redirectUrl;
                    }
                )
        });
    }
};
X.addProduct.event();