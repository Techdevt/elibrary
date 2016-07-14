import { expect } from 'chai';
import { encrypt } from '../server/helpers/util';

describe('Utility functions', () => {
  it('encrypt() hashes a passed token', (done) => {
    const token = 'randomString';
    encrypt(token, (err, hash) => {
      expect(err).to.be.undefined();
      expect(hash).to.not.be.undefined();
      expect(hash).to.not.equal(token);
      expect(hash).to.not.be.empty();
      done();
    });
  });
});
