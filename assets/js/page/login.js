X.login = {
    event: function () {
        var submitBtn = $('.submitBtn');
        submitBtn.click(function (e) {
            var input = {
                email: $('.email').val(),
                password: $('.password').val()
            };
            $.post('/' + X.params.brand + '/login',
                input,
                function (data) {
                    console.log('data: ', data);
                    if (data) { // authed
                        console.log('here');
                        window.location.href = location.protocol + '//' + location.host + '/' + X.params.brand + '/manage';
                    } else {
                        alert('bad');
                    }
                }
            );
        });
    }
};
X.login.event();