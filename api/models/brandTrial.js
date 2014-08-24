/**
 * Brand
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var brandTrial = {
    connection: 'localMysql',
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        business: 'string',
        phone: 'string',
        address: 'string',
        style: 'string',
        colorset: 'string',
        creator: {
            model: 'user'
        }
    }
};

module.exports = brandTrial;