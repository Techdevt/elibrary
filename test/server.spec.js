import { makeServer } from './test_server';
import request from 'supertest';
import { expect } from 'chai';

describe('loading express', function() {
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

    describe('database connections', function() {
        this.timeout(20000);
        it('passes requests of top level domain to default database', () => {
            request(server)
                .get('/test/dbconn')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.deep.equal({database: 'eworm'});
                });
        });
    });

    // it('passes requests of subdomains to client databases', )
});
