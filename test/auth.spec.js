import { expect } from 'chai';
import {
  serialize,
  deserialize,
  extractHeaderToken,
  loadRoles,
  doAuth,
} from '../server/services/Auth';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { makeServer } from './test_server';

describe('Auth Middleware', function testAuth() {
  this.timeout(20000);
  describe('tokens', () => {
    let token;
    const user = {
      name: 'Breezy',
    };

    it('serializes a token', () => {
      serialize(user, (error, hash) => {
        token = hash;
        const decoded = jwt.decode(token, { complete: true });
        expect(error).to.not.exist();
        expect(decoded.payload.name).to.equal(user.name);
      });
    });

    it('deserializes a token', () => {
      deserialize(token, (err, deserialized) => {
        expect(err).to.not.exist();
        expect(deserialized.name).to.equal(user.name);
      });
    });

    it('extractHeaderToken() retrieves token from request headers', () => {
      const Header = { authorization: `Bearer ${token}` };
      const retrievedToken = extractHeaderToken(Header);
      expect(retrievedToken).to.equal(token);
    });
  });

  it('loadRoles() returns a set of roles', () => {
    const roles = loadRoles();
    expect(roles).to.be.an('object');
    expect(roles).to.not.be.empty();
  });

  it('doAuth() allows a user for authorized operations', () => {
    const user = {
      role: 'school',
    };
    doAuth(user, 'write').then(result => expect(result).to.equal(true));
  });

  it('doAuth() rejects a user for unauthorized operations', () => {
    const user = {
      role: 'school',
    };
    doAuth(user, 'dance').catch(result => expect(result).to.equal(false));
  });

  describe('Auth Middleware', () => {
    let server;
    const user = {
      role: 'student',
      name: 'Kofi',
    };

    const university = {
      role: 'school',
      name: 'KNUST',
    };

    beforeEach(() => {
      server = makeServer();
    });
    afterEach(() => {
      server.close();
    });

    it('blocks unauthorized users from accessing an endpoint', (done) => {
      serialize(user, (err, token) => {
        request(server)
          .get('/books')
          .set('Authorization', `Bearer ${token}`)
          .expect(403, done);
      });
    });

    it('allows authorized users to access route', (done) => {
      serialize(university, (err, token) => {
        request(server)
          .get('/books')
          .set('Authorization', `Bearer ${token}`)
          .expect(200, done);
      });
    });
  });
});
