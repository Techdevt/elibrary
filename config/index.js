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
        "smtp:password": process.env["smtp:password"],
        "superAdmin:password": process.env["superAdmin:password"],
        "app:secret": process.env["app:secret"]
    };
    console.log(secrets);
}

module.exports = {
    config: config,
    secrets: secrets
};
