X.signup = {
    event: function () {
        // signup form submit event
        $('.submitBtn').click(function () {
            var brandName = $('.brandName').val(),
                phone = $('.phone').val(),
                email = $('.email').val(),
                password = $('.password').val(),
                bankCode = $('.bankCode').val(),
                bankAccountNumber = $('.bankAccountNumber').val(),
                bankAccountName = $('.bankAccountName').val();

                $.post(
                    '/signup',
                    {
                        brandName: brandName,
                        phone: phone,
                        email: email,
                        password: password,
                        bankCode: bankCode,
                        bankAccountNumber: bankAccountNumber,
                        bankAccountName: bankAccountName
                    },
                    function (data) {
                        alert('success');
                    }
                );
        });
    }
};
X.signup.event();