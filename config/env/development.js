/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
    connections: {
        localMongo: {
           adapter: 'sails-mongo',
           host: 'localhost',
           database: 'x1'
        },
        /*  keys:
            • Brand: slug

            • brand permission: brand + email

            • cart: brand + number
            • order: brand + number

            • customer: brand + email

            • file: brand + filename + appendix

            • product: brand + number
                -> change name: product grouping

            • productspecific: brand + number
                -> change name: product

            • shipping:
                • brand + number

            • site
                • parameter as key

            • User: email
                -> change name: siteUser
                
        */
        localMongo_PrimaryKey: {
           adapter: 'sails-mongo',
           host: 'localhost',
           database: 'x1'
        }
    },
    models: {
        connection: 'localMongo',
        migrate: 'alter'
    },
    log: {
        level: 'verbose'
    }
};
