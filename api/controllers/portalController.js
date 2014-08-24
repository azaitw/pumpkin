var portal = {
    index: function (req, res) {
        res.render('index', {
            partials: {
                head: 'head',
                header: 'header',
                body: 'portal'
            },
            title: 'Pumpkin Lab, your branding specialist'
        });
    }
};
module.exports = portal;