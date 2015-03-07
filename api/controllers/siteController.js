var site = {
    index: function (req, res) {
//        return res.redirect('/beardude');

        renderService.html(res, 'site', {
            title: 'Beardude Shop, your branding specialist'
        });
    }
};
module.exports = site;