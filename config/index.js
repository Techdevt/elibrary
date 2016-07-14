const config = require(`./${(process.env.NODE_ENV || 'development')}.json`);
const debug = require('debug');

const fileName = './secrets.json';
let secrets;

/* eslint global-require: "off" */
try {
  secrets = require(`${fileName}`);
} catch (err) {
  debug.log(`unable to read file ${fileName}: , ${err}`);
  debug.log('see config/secrets-sample.json for an example');
  debug.log('resetting to environment variables');
  secrets = {
    'smtp:password': process.env.SMTP_PASSWORD,
    'superAdmin:password': process.env.ADMIN_PASSWORD,
    'app:secret': process.env.SECRET_KEY,
    AWSAccessKey: process.env.AWS_ACCESS_KEY,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
  };
}

module.exports = {
  config,
  secrets,
};
