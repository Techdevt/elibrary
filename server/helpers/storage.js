import AWS from 'aws-sdk';
import { secrets, config } from '../../config';
import _ from 'lodash';
import Q from 'q';
import path from 'path';
import typeOf from 'lib/typeof';
import fs from 'fs';
import S3rver from 's3rver';
import mime from 'mime';

let s3Config = {
    s3ForcePathStyle: true,
    region: config.AWSRegion,
    accessKeyId: secrets.AWSAccessKey,
    secretAccessKey: secrets.AWSSecretKey
};

let S3Client = null;

export function getS3Instance() {
    if (S3Client) {
        return S3Client;
    } else {
        S3Client = _configureS3();
        return S3Client;
    }
}

export function createBucket(name, done) {
    const S3Instance = getS3Instance();
    const params = {
        Bucket: name
    };

    S3Instance.createBucket(params, function(err, bucket) {
        if (err) {
            return done(err);
        }

        return done(null, bucket);
    });
}

export function createFile(options, buff, callback) {
    const cb = callback || function() {};
    const { bucket, key } = options;
    return Q.Promise((resolvePromise, rejectPromise) => {
        function resolve(res) {
            resolvePromise(res);
            cb(null, res);
        }

        function reject(reason) {
            rejectPromise(reason);
            cb(reason);
        }

        if (typeOf(bucket) !== "string") {
            return reject(new Error("Expected first parameter to be string but got %s", typeOf(bucket)));
        }

        if (typeof buff === "undefined" || typeOf(buff) !== "string") {
            return reject(new Error("Expected file to be buffer or string but got %s", typeOf(buff)));
        }

        if (!Buffer.isBuffer(buff)) {
            fs.stat(buff, function(err, stat) {
                if (err == null) {
                    const mimetype = mime.lookup(buff);
                    const encoding = mime.charsets.lookup(mimetype) || 'base64';

                    fs.readFile(buff, encoding, function(err, buffered) {
                        if (err) return reject(err);
                        const options = {
                            bucket: bucket,
                            key: key || (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now() + path.extname(buff),
                            metadata: {}
                        };

                        _createFile(options, buffered).then((res) => {
                            return resolve(res);
                        }, (err) => {
                            return reject(err);
                        });
                    });
                } else {
                    return reject(new Error("File not found"));
                }
            });
        } else {
            _createFile(buff).then((err, res) => {
                return resolve("file upload successfull");
            });
        }
    });
}

function _createFile(options, buff) {
    const { bucket, key, metadata } = options;

    const S3Instance = getS3Instance();
    return Q.Promise((resolve, reject) => {
        var params = {
            Bucket: bucket,
            Key: key,
            Metadata: metadata,
            Body: buff
        };

        S3Instance.putObject(params, function(err, data) {
            if (err) reject(err);
            resolve({...data, key, bucket });
        });
    });
}

export function getSignedURL(options, cb) {
    const callback = cb || function() {};
    const S3Instance = getS3Instance();
    let { key, bucket, type, expires } = options;
    expires = expires || 900; //set default download url expiration to 15mins
    type = type || 'getObject';

    return Q.Promise((resolvePromise, rejectPromise) => {

        function resolve(response) {
            resolvePromise(response);
            callback(null, response);
        }

        function reject(reason) {
            rejectPromise(reason);
            callback(reason);
        }

        if (typeOf(options) !== "object") {
            return reject(new Error("Expected first param to be object of keys bucket and key"));
        }

        if (typeOf(key) !== "string") {
            return reject(new Error("Expected key to be string but got %s", typeOf(key)));
        }

        if (typeOf(bucket) !== "string") {
            return reject(new Error("Expected bucket name to be string but got %s", typeOf(key)));
        }

        const params = {
            Bucket: bucket,
            Key: key,
            Expires: expires
        };

        S3Instance.getSignedUrl(type, params, function(err, data) {
            if (err) return reject(err);
            return resolve(data);
        });
    });
}

export function getFile(bucket, key, callback) {
    const S3Instance = getS3Instance();

    if (typeOf(key) !== "string") {
        return reject(new Error("Expected key to be string but got %s", typeOf(key)));
    }

    if (typeOf(bucket) !== "string") {
        return reject(new Error("Expected bucket name to be string but got %s", typeOf(key)));
    }

    const params = {
        Bucket: bucket,
        Key: key
    };

    S3Instance.getObject(params, function(err, data) {
    	if(err) callback(err);
    	callback(null, data);
    });
}

export function deleteMultiple(bucket, Objects, callback) {
    let S3Instance = getS3Instance();
    let params = {
        Bucket: bucket,
        Delete: {
            Objects: []
        }
    };

    _.forEach(Objects, (object) => {
        if (!Object.hasOwnProperty.call(object, 'key')) {
            callback(new Error('One or more of your objects has no key'));
        } else {
            params.Delete.Objects.push({
                Key: object.key,
                VersionId: object.VersionId || ''
            });
        }
    });

    S3Instance.deleteObjects(params, function(err, data) {
        if (err) callback(err);
        else callback(null, data);
    });
}

export function deleteBucket(bucket, callback) {
    const S3Instance = getS3Instance();
    _emptyBucket({ bucket: bucket }, (err, res) => {
        if (err) return callback(err);

        S3Instance.deleteBucket({ Bucket: bucket }, (error, response) => {
            if (error) return callback(error);
            callback(null, response);
        });
    });
}

function _emptyBucket(options, callback) {
    const { bucket, prefix } = options;

    let params = {
        Bucket: bucket,
        Prefix: prefix || ''
    };

    const S3Instance = getS3Instance();

    S3Instance.headBucket({ Bucket: bucket }, function(err, data) {
        if (err) callback(err);
        S3Instance.listObjects(params, function(err, data) {
            if (err) callback(err);

            if (data.Contents.length === 0) return callback();
            params = { Bucket: bucket };
            params.Delete = { Objects: [] };

            data.Contents.forEach(function(content) {
                params.Delete.Objects.push({ Key: content.Key });
            });

            S3Instance.deleteObjects(params, function(err, data) {
                if (err) return callback(err);
                if (data.Deleted.length == 1000) _emptyBucket({ bucket: bucket }, callback);
                else callback();
            });
        });
    });
}

export function deleteObject({ bucket, key }, callback) {
    const S3Instance = getS3Instance();
    const params = {
        Bucket: bucket,
        Key: key
    };
    S3Instance.deleteObject(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

function _configureS3() {
    if (process.env.NODE_ENV !== "production") {
        s3Config = Object.assign(s3Config, {
            endpoint: new AWS.Endpoint('http://localhost:4569')
        });
        S3Client = new AWS.S3(s3Config);

        return S3Client;
    }
    return new AWS.S3(s3Config);
}

export function startTestStorage(callback) {
    const client = new S3rver({
        port: 4569,
        hostname: 'localhost',
        silent: true,
        directory: '/tmp/eworm'
    }).run(function(err, host, port) {
        if (err) {
            return callback(err);
        }
        callback(null, client);
    });
}
