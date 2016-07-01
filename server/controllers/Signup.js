import async from 'async';
import _ from 'lodash';
import { encrypt } from '../helpers/util';
import crypto from 'crypto';
import Q from 'q';

export const validate = {
    ensure: _ensure,
    isCleanDomain: _isCleanDomain
};

function _ensure(user, keys) {
    const keyChecks = [];
    _.forEach(keys, (key) => {
        keyChecks.push(function(callback) {
            if (!Object.hasOwnProperty.call(user, key)) {
                callback(`${key} field is required`);
            }
        });
    });

    async.parallel(keyChecks, function(err, results) {
        if (err) _fail(err);
        return user;
    });
}

function _isCleanDomain(user) {
	_fail("domain must be one word");
}

export function genVerificationToken(cb) {
    crypto.randomBytes(21, function(err, buf) {
        if (err) {
            return cb(err);
        }

        var token = buf.toString('hex');
        encrypt(token, (err, hash) => {
            if (err) return cb(err);
            cb(null, hash);
        });
    });
}

export function registerClient(client, cb) {
    _doValidations(client)
    	.then(() => {
    		//continue
    		cb(null);
    	}, err => {
    		cb(err);
    	});
}

function _doValidations(user, cb) {
    const validationConfig = {
        requiredFields: ['password', 'domain', 'email']
    };

    let callback = cb || function() {};

    return Q.Promise((resolvePromise, rejectPromise) => {
        function resolve(result) {
            resolvePromise(result);
            callback(null, result);
        }

        function reject(reason) {
            rejectPromise(reason);
            callback(reason);
        }

        //check for required keys
        try {
            validate.ensure(user, validationConfig.requiredFields);
            validate.isCleanDomain(user);
        } catch (err) {
            return reject(err); 
        } finally {
        	return resolve("passed");
        }
    });
}

function _fail(message) {
	throw new Error(`validation error: ${message}`);
}

// export function unique(db, model, field, value) {

// }
