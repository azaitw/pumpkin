/**
 * Page
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var page = {
    connection: 'localMysql',
    attributes: {
        site: 'string',
        style: 'string',
        title: 'string',
        content: 'text'
    }
};

module.exports = page;