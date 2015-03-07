var site = {
    index: function (req, res) {
//        return res.redirect('/beardude');
        renderService.renderHtml(res, {
            templates: {
                body: 'site'
            },
            title: 'Beardude Shop, your branding specialist'
        });
    }
};
module.exports = site;