import { makeServer } from './test_server';
import request from 'supertest';

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

});
