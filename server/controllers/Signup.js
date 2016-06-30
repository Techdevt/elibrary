import async from 'async';
import _ from 'lodash';

export function validate(user, keys) {
	const keyChecks = [];
	_.forEach(keys, (key) => {
		keyChecks.push(function(callback) {
			if(!Object.hasOwnProperty.call(user, key)) {
				callback(new Error(`validation error: ${key} field is required`));
			}
		});
	});

	async.parallel(keyChecks, function(err, results) {
		if(err) throw err;
		return user;
	});
}

// export function unique(db, model, field, value) {

// }