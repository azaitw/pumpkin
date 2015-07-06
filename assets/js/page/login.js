app.login = function () {
    var form = $('.form').first();
    var url = window.location.protocol + '//' + window.location.host + '/login';
    form.on('submit', function (e) {
        e.preventDefault();
        app.form.clearErrorMsg(form);
//        if (validatePassword()) {
        // post blueprint's /user/create
        $.ajax({
            type: 'POST',
            url: url,
            data: app.form.prepareSubmitVal(form),
            success: function (D) {
                app.form.handleSuccess(D, form);
            },
            error: function (E) {
                console.log('E in login: ', E);
                app.form.handleError(E, form);
            }
        });
//        }
    });
};
app.login();