

var config = require('./' + (process.env.NODE_ENV || 'development') + '.json');

var fileName = "./secrets.json",
	secrets;

try {
  secrets = require(`${fileName}`);
}
catch (err) {
  secrets = {};
  console.log("unable to read file '" + fileName + "': ", err);
  console.log("see config/secrets-sample.json for an example");
}

module.exports = {
	config: config,
	secrets: secrets
};