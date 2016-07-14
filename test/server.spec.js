import { makeServer } from './test_server';
import request from 'supertest';
import { expect } from 'chai';
import _request from 'axios';
import { config } from '../config';

describe('loading express', function testServer() {
  let server;
  this.timeout(20000);

  beforeEach(() => {
    server = makeServer();
  });

  afterEach(() => {
    server.close();
  });

  it('responds to requests', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('404 on everything else', (done) => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });

  describe('database connections', () => {
    it('passes requests of top level domain to default database', (done) => {
      const defaultDb = 'eworm';
      _request
        .get(`http://eworm.com:${config.port}/test/dbconn`)
        .then((res) => {
          expect(res.data).to.deep.equal({ database: defaultDb });
          done();
        });
    });

    it('passes requests of subdomains to client databases', (done) => {
      const domain = 'knust';
      _request
        .get(`http://${domain}.eworm.com:${config.port}/test/dbconn`)
        .then((res) => {
          expect(res.data).to.deep.equal({ database: domain });
          done();
        });
    });
  });
});
