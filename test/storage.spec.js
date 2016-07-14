import { expect } from 'chai';
import request from 'supertest';
import { makeServer } from './test_server';
import {
  createBucket,
  createFile,
  startTestStorage,
  deleteBucket,
  deleteObject,
  deleteMultiple,
  getSignedURL,
  getFile,
} from '../server/helpers/storage';
import async from 'async';
import _ from 'lodash';

describe('S3 storage',
  function testStorage() {
    this.timeout(20000);
    let s3rver;

    before((done) => {
      // http://eworm.s3.amazonaws.com/
      startTestStorage((err, client) => {
        expect(err).to.not.exist();
        s3rver = client;
        createBucket('eworm', (error, bucket) => {
          expect(error).to.not.exist();
          expect(bucket.Location).to.equal('/eworm');
          done();
        });
      });
    });

    after((done) => {
      deleteBucket('eworm', (err, res) => {
        expect(err).to.not.exist();
        expect(res).to.be.empty();
        s3rver.close();
        done();
      });
    });


    describe('multer', () => {
      let server;

      before(() => {
        server = makeServer();
      });

      after(() => {
        server.close();
      });

      it('uploads files directly to amazon s3 bucket', (done) => {
        request(server)
          .post('/test/storage')
          .attach('avatar', 'test/data/avatar.jpg')
          .expect(200)
          .end((err, res) => {
            expect(err).to.not.exist();
            expect(res.body).to.exist();
            expect(res.body.originalname).to.exist();
            expect(res.body.etag).to.exist();
            expect(res.body.bucket).to.exist();
            done();
          });
      });
    });


    describe('file operations', () => {
      let file;

      it('uploads a file successfully to amazon s3 bucket', (done) => {
        const params = {
          bucket: 'eworm',
          file: 'test/data/avatar.jpg',
        };

        createFile({ bucket: params.bucket }, params.file, (err, res) => {
          expect(err).to.not.exist();
          expect(res.ETag).to.exist();
          expect(res.key).to.exist();
          file = res;
          done();
        });
      });

      it('fetches a file successfully from amazon s3 bucket', (done) => {
        getFile(file.bucket, file.key, (err, res) => {
          expect(err).to.not.exist();
          expect(res.Body).to.not.be.undefined();
          expect(res.ETag).to.exist();
          done();
        });
      });

      it('deletes a single object in bucket', (done) => {
        deleteObject(file, (err) => {
          expect(err).to.not.exist();
          done();
        });
      });

      it('deletes multiple files from bucket', (done) => {
        const filepath = 'test/data/avatar.jpg';
        const bucket = 'eworm';
        const times = 3;

        function createFileCopies(passedFile, cb) {
          const fileOperations = [];
          _.times(times, () => {
            fileOperations.push((callback) => {
              createFile({ bucket }, passedFile, callback);
            });
          });

          async.parallel(fileOperations, cb);
        }

        createFileCopies(filepath, (err, results) => {
          expect(err).to.not.exist();
          expect(results).to.be.an('array');
          expect(results.length).to.equal(times);

          deleteMultiple(bucket, results, (error, res) => {
            expect(error).to.not.exist();
            expect(res.Deleted).to.be.an('array');
            expect(res.Deleted.length).to.equal(times);
            done();
          });
        });
      });

      it('creates signed temporary download file url', (done) => {
        const options = {
          bucket: 'eworm',
          key: file.key,
        };

        getSignedURL(options, (err, res) => {
          expect(err).to.not.exist();
          expect(res).to.be.a('string');
          done();
        });
      });

      it('creates signed temporary putObject url', (done) => {
        const options = {
          bucket: 'eworm',
          key: file.key,
          type: 'putObject',
        };

        getSignedURL(options, (err, res) => {
          expect(err).to.not.exist();
          expect(res).to.be.a('string');
          done();
        });
      });
    });
  });
