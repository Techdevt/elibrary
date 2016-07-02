import s3rver from 's3rver';
var client;


describe("S3 storage", function() {
    let client;

    before((done) => {
        client = new S3rver({
            port: 4569,
            hostname: 'localhost',
            silent: false,
            directory: '/tmp/uploads'
        }).run(function(err, host, port) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    after(() => {
        client.close();
    });

    it("uploads a file successfully to amazon s3 bucket", () => {

    });
});