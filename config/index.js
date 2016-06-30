var config = require('./' + (process.env.NODE_ENV || 'development') + '.json');

var fileName = "./secrets.json",
    secrets;

try {
    secrets = require(`${fileName}`);
} catch (err) {
    console.log("unable to read file '" + fileName + "': ", err);
    console.log("see config/secrets-sample.json for an example");
    console.log("resetting to environment variables");
    secrets = {
        "smtp:password": process.env.SMTP_PASSWORD,
        "superAdmin:password": process.env.ADMIN_PASSWORD,
        "app:secret": process.env.SECRET_KEY
    };
    console.log(secrets);
}

module.exports = {
    config: config,
    secrets: secrets
};
