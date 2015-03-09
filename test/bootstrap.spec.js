/*
//var Sails = require('sails');
var Sails = require('sails/lib/app');
var app = Sails();

before(function(done) {
    app.lift({ 
        log: {
            level: 'error'
        }// configuration for testing purposes
    }, done);
});

after(function(done) {
    // here you can clear fixtures, etc.
    app.lower(done);
    sails.lower(done);
    console.log('app? ', app);
    console.log('sails? ', sails);
});
*/