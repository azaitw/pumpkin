X.signup = {
    event: function () {
        // signup form submit event
        $('.submitBtn').click(function () {
            var i,
                entries = $('.signup .entry'),
                entriesLen = entries.length,
                ph,
                output = {};
            for (i = 0; i < entriesLen; i += 1) {
                ph = $(entries[i]);
                output[ph.attr('name')] = ph.val();
            }

            $.post(
                '/signup',
                output,
                function (data) {
                    alert('success');
                }
            );
        });
    }
};
X.signup.event();