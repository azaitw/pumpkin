var email = require('emailjs'),
    Q = require('q'),
    emailService = {
        _config: {
            server: {
                user: 'info+beardude.com',
                password: 'Aspera123_bryan!',
                host: 'mail.beardude.com',
                ssl: false
            }
        },
        // Prepare email server
        returnEmailServer: function (emailServer) {
            var serverConf = (emailServer) ? emailServer : this._config.server;
            return email.server.connect({
                user: serverConf.user,
                password: serverConf.password,
                host: serverConf.host,
                ssl: serverConf.ssl
            });
        },
        /*
            inputObj: {
                brand: {
                    brandName
                    email
                },
                to: 'email',
                subject: 'text',
                body: 'html body'
                text: 'text body'
            }
        */
        sendMail: function (inputObj, emailServer) {
            var q = Q.defer(),
                server = this.returnEmailServer(emailServer);

            server.send({
               from: inputObj.brand.brandName + ' <' + inputObj.brand.email + '>',
               to: inputObj.to,
               subject: inputObj.subject,
               text: inputObj.text,
               attachment: [{
                   data: inputObj.body,
                   alternative: true
               }]
            }, function (err, message) {
                if (err) {
                    return q.reject(err);
                }
                return q.resolve(message);
            });
            return q.promise;
        },
        sendOrderConfirm: function (inputObj) {
            var q = Q.defer(),
                that = this,
                html,
                text;
            sails.renderView('email/order', inputObj, function (err, D) {
                html = D;
                sails.renderView('email/order_plaintext', inputObj, function (err, D1) {
                    text = D1;
                    that.sendMail({
                        to: inputObj.email,
                        subject: '您的訂單',
                        body: html,
                        text: text,
                        brand: inputObj.brand
                    })
                    .then(function (D2) {
                        return q.resolve(inputObj.email); 
                    });
                    return q.promise;
                });
            });
        }
    };
module.exports = emailService;