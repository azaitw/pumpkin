module.exports = {
    _config: {
        server: {
            user: 'info+beardude.com',
            password: 'Aspera123_bryan!',
            host: 'mail.beardude.com',
            ssl: false
        }
    },
    
    /*
        input: {
            to: 'email',
            subject: 'text',
            body: 'html'
        }
    */
    sendMail: function (input, callback) {
        var email   = require('emailjs'),
            serverConf = this._config.server,
            server  = email.server.connect({
                user: serverConf.user,
                password: serverConf.password,
                host: serverConf.host,
                ssl: serverConf.ssl
            });

        // send the message and get a callback with an error or details of the message that was sent
        server.send({
           text: input.text,
           from: input.brand.brandName + ' <' + input.brand.email + '>',
           to: input.to,
           subject: input.subject,
           attachment: [
               {
                   data: input.body,
                   alternative: true
               }/*,
               {
                   path: 'path/to/file.zip',
                   type: 'application/zip',
                   name: 'renamed.zip'
               }*/
           ]
        }, function (err, message) {
            if (err) {
                console.log(err);
            }
            callback(null, message);
        });
    }
};
