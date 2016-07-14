import bcrypt from 'bcrypt';
import Q from 'q';
import typeOf from 'lib/typeof';

export function encrypt(str, cb) {
  const callback = cb || function fnCallback() {};

  return new Q.Promise((resolvePromise, rejectPromise) => {
    const resolve = (result) => {
      resolvePromise(result);
      callback(undefined, result);
    };

    const reject = (err = false) => {
      rejectPromise(err);
      callback(err);
    };

    if (typeOf(str) !== 'string') {
      throw new Error('Expected first argument to be a string');
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }

      return bcrypt.hash(str, salt, (hashError, hash) => {
        if (hashError) return reject(hashError);
        return resolve(hash);
      });
    });
  });
}

export function sendMail() {

}
