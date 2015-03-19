var portal = {
    index: function (req, res) {
        return res.redirect('/beardude');
        /*
        renderService.html(res, 'portal', {
            title: 'Pumpkin Lab, your branding specialist'
        });*/
    },
    zigzigzagzag: function (req, res) {
        return res.redirect('https://docs.google.com/forms/d/1yvBepqKfN8JXrzLveANrQgP3NkoliJ2C7R3k14gMz5o/closedform');
    }
};
module.exports = portal;