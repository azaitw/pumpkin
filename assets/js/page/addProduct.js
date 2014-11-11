X.addProduct = {
    event: function () {
        // signup form submit event
        $('.submitBtn').click(function () {
            var productName = $('.productName').val(),
                retail = $('.retail').val(),
                sale = $('.sale').val(),
                brand = $('.brand').val(),
                brandId = $('.b_id').val(),
                files = $('.images')[0].files,
                url = document.URL,
                redirectUrl = url.substring(0, url.lastIndexOf('/')),
                formData = new FormData($('.form')[0]);

            $.ajax({
                url: '/' + brand + '/manage/addProduct',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (returndata) {
                  console.log('returndata: ', returndata);
                }
            });
                /*
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
                );
                */

        });
        /*
        $('.form').submit(function (event) {
            event.preventDefault();
            var formData = new FormData(),
            files = $('.images')[0].files;

            jQuery.each($('.images')[0].files, function(i, file) {
                formData.append('file-'+i, file);
            });

            console.log('formData:', formData);
            console.log('formData files: ', formData.files);
        });
        */
    }
};
X.addProduct.event();