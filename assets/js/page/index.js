app.index = {};
app.signup = function () {
    var form = $('.form').first();
/*
    form.on('submit', function (e) {
        e.preventDefault();
        app.form.clearErrorMsg(form);
        $.ajax({
            type: 'POST',
            url: window.location.protocol + '//' + window.location.host + '/signup',
            data: app.form.prepareSubmitVal(form),
            success: function (D) {
                app.form.handleSuccess(D, form);
            },
            error: function (E) {
                app.form.handleError(E, form);
            }
        });
    });
*/
}
app.signup();