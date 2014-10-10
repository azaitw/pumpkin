var portal = {
    index: function (req, res) {
        return res.redirect('/beardude');
        /*
        renderService.html(res, 'portal', {
            title: 'Pumpkin Lab, your branding specialist'
        });*/
    }
};
module.exports = portal;