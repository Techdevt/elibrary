import bcrypt from 'bcrypt';
import Q from 'q';
import typeOf from 'lib/typeof';

export function encrypt(str, cb) {
    let callback = cb || function() {}.bind(this);

    return Q.Promise((resolvePromise, rejectPromise) => {
        const resolve = (result) => {
            resolvePromise(result);
            callback(undefined, result);
        };

        const reject = (err = false) => {
            rejectPromise(err);
            callback(err);
        };

        if(typeOf(str) !== "string") {
        	throw new Error("Expected first argument to be a string");
        }

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(str, salt, function(err, hash) {
            	if(err) return reject(err);
                return resolve(hash);
            });
        });
    });
}
