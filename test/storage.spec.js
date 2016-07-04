import { expect } from 'chai';
import request from 'supertest';
import { makeServer } from './test_server';
import { createBucket, createFile, startTestStorage, deleteBucket, deleteObject, deleteMultiple, getSignedURL, getFile } from '../server/helpers/storage';
import fs from 'fs';

describe("S3 storage", function() {
    this.timeout(20000);
    let s3rver;

    before((done) => {
        // http://eworm.s3.amazonaws.com/
        startTestStorage((err, client) => {
            s3rver = client;
            createBucket('eworm', (err, bucket) => {
                expect(err).to.not.exist;
                expect(bucket.Location).to.equal('/eworm');
                done();
            });
        });
    });

    after((done) => {
        deleteBucket('eworm', function(err, res) {
            expect(err).to.not.exist;
            expect(res).to.be.empty;
            s3rver.close();
            done();
        });
    });


    describe("multer", function() {
        let server;

        before(() => {
            server = makeServer();
        });

        after(() => {
            server.close();
        });

        it("uploads files directly to amazon s3 bucket", (done) => {
            request(server)
                .post('/test/storage')
                .attach('avatar', 'test/data/avatar.jpg')
                .expect(200)
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.body).to.exist;
                    expect(res.body.originalname).to.exist;
                    expect(res.body.etag).to.exist;
                    expect(res.body.bucket).to.exist;
                    done();
                });
        });
    });


    describe("file operations", function() {
        let file;

        it("uploads a file successfully to amazon s3 bucket", (done) => {
            const params = {
                bucket: 'eworm',
                file: 'test/data/avatar.jpg'
            };

            createFile({ bucket: params.bucket }, params.file, (err, res) => {
                expect(err).to.not.exist;
                expect(res.ETag).to.exist;
                expect(res.key).to.exist;
                file = res;
                done();
            });
        });

        it("fetches a file successfully from amazon s3 bucket", (done) => {
            getFile(file.bucket, file.key, (err, res) => {
                expect(err).to.not.exist;
                expect(res.Body).to.not.be.undefined;
                expect(res.ETag).to.exist;
                done();
            });
        });

        it("deletes a single object in bucket", (done) => {
            deleteObject(file, (err, res) => {
                expect(err).to.not.exist;
                done();
            });
        });

        it("deletes multiple files from bucket", (done) => {
            const filepath = 'test/data/avatar.jpg';
            const bucket = 'eworm';
            const times = 3;

            function createFileCopies(file, cb) {
                const async = require('async');
                const _ = require('lodash');
                const fileOperations = [];
                _.times(times, function() {
                    fileOperations.push(function(callback) {
                        createFile({ bucket }, file, callback);
                    });
                });

                async.parallel(fileOperations, cb);
            }

            createFileCopies(filepath, function(err, results) {
                expect(err).to.not.exist;
                expect(results).to.be.an("array");
                expect(results.length).to.equal(times);

                deleteMultiple(bucket, results, function(err, res) {
                    expect(err).to.not.exist;
                    expect(res.Deleted).to.be.an("array");
                    expect(res.Deleted.length).to.equal(times);
                    done();
                });
            });
        });

        it("creates signed temporary download file url", (done) => {
            const options = {
                bucket: 'eworm',
                key: file.key
            };

            getSignedURL(options, (err, res) => {
                expect(err).to.not.exist;
                expect(res).to.be.a("string");
                done();
            });
        });

        it("creates signed temporary putObject url", (done) => {
            const options = {
                bucket: 'eworm',
                key: file.key,
                type: 'putObject'
            };

            getSignedURL(options, (err, res) => {
                expect(err).to.not.exist;
                expect(res).to.be.a("string");
                done();
            });
        });
    });
});
