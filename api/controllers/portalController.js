var portal = {
    index: function (req, res) {
        renderService.html(res, 'portal', {
            title: 'Pumpkin Lab, your branding specialist'
        });
    }
};
module.exports = portal;