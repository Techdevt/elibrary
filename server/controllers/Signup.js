import async from 'async';
import _ from 'lodash';
import { encrypt } from '../helpers/util';
import crypto from 'crypto';
import Q from 'q';

function $fail(message) {
  throw new Error(`validation error: ${message}`);
}

function $ensure(user, keys) {
  const keyChecks = [];
  _.forEach(keys, (key) => {
    keyChecks.push((callback) => {
      if (!Object.hasOwnProperty.call(user, key)) {
        callback(`${key} field is required`);
      }
    });
  });

  async.parallel(keyChecks, (err) => {
    if (err) $fail(err);
    return user;
  });
}

function $isCleanDomain() {
  $fail('domain must be one word');
}

export const validate = {
  ensure: $ensure,
  isCleanDomain: $isCleanDomain,
};

function $doValidations(user, cb) {
  const validationConfig = {
    requiredFields: ['password', 'domain', 'email'],
  };

  const callback = cb || function fnCallback() {};

  return new Q.Promise((resolvePromise, rejectPromise) => {
    function resolve(result) {
      resolvePromise(result);
      callback(null, result);
    }

    function reject(reason) {
      rejectPromise(reason);
      callback(reason);
    }

    // check for required keys
    try {
      validate.ensure(user, validationConfig.requiredFields);
      validate.isCleanDomain(user);
      return resolve('passed');
    } catch (err) {
      return reject(err);
    }
  });
}

export function genVerificationToken(cb) {
  crypto.randomBytes(21, (err, buf) => {
    const token = buf.toString('hex');
    if (err) {
      return cb(err);
    }

    return encrypt(token, (encryptErr, hash) => {
      if (encryptErr) return cb(encryptErr);
      return cb(null, hash);
    });
  });
}

export function registerClient(client, cb) {
  $doValidations(client)
    .then(() => {
      // continue
      cb(null);
    }, err => {
      cb(err);
    });
}

// export function unique(db, model, field, value) {

// }
