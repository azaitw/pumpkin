/* global sails */
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
                bcc: inputObj.bcc,
                subject: inputObj.subject,
                text: inputObj.text,
                attachment: [{
                    data: inputObj.body,
                    alternative: true
                }]
            }, function (err, message) {
                if (err) {
                    console.log('sendMail error: ', err);
                    return q.reject(err);
                }
                return q.resolve(message);
            });
            return q.promise;
        },
        /*
            inputObj: {
                email: 'email',
                brand: {
                },
                sum:
            }  
        */
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
                        to: inputObj.recipient.email,
                        bcc: inputObj.brand.email,
                        subject: '感謝您對' + inputObj.brand.brandName_cht + '的支持，這是您的訂單',
                        body: html,
                        text: text,
                        brand: inputObj.brand
                    })
                    .then(function () {
                        return q.resolve(inputObj.email); 
                    });
                    return q.promise;
                });
            });
        },
        // {brand: brand, result: result}
        notifyPayment: function (inputObj) {
            var q = Q.defer(),
                that = this,
                html;
            sails.renderView('email/notifyPayment', inputObj, function (err, D) {
                html = D;
                that.sendMail({
                    to: inputObj.brand.email,
                    subject: '有人付錢',
                    body: html,
                    brand: inputObj.brand
                })
                .then(function () {
                    return q.resolve(inputObj.email); 
                });
                return q.promise;
            });
        }
    };
module.exports = emailService;