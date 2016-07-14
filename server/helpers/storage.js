import AWS from 'aws-sdk';
import { secrets, config } from '../../config';
import _ from 'lodash';
import Q from 'q';
import path from 'path';
import typeOf from 'lib/typeof';
import fs from 'fs';
import S3rver from 's3rver';
import mime from 'mime';
import mkdirp from 'mkdirp';

let s3Config = {
  s3ForcePathStyle: true,
  region: config.AWSRegion,
  accessKeyId: secrets.AWSAccessKey,
  secretAccessKey: secrets.AWSSecretKey,
};

let S3Client = null;

function $configureS3() {
  if (process.env.NODE_ENV !== 'production') {
    s3Config = Object.assign(s3Config, {
      endpoint: new AWS.Endpoint('http://localhost:4569'),
    });
    S3Client = new AWS.S3(s3Config);

    return S3Client;
  }
  return new AWS.S3(s3Config);
}

export function getS3Instance() {
  if (S3Client) {
    return S3Client;
  }
  S3Client = $configureS3();
  return S3Client;
}

export function createBucket(name, done) {
  const S3Instance = getS3Instance();
  const params = {
    Bucket: name,
  };

  S3Instance.createBucket(params, (err, bucket) => {
    if (err) {
      return done(err);
    }

    return done(null, bucket);
  });
}

function $createFile(options, buff) {
  const { bucket, key, metadata } = options;

  const S3Instance = getS3Instance();
  return new Q.Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
      Metadata: metadata,
      Body: buff,
    };

    S3Instance.putObject(params, (err, data) => {
      if (err) reject(err);
      resolve({ ...data, key, bucket });
    });
  });
}

export function createFile(options, buff, callback) {
  const cb = callback || function fnCallback() {};
  const { bucket, key } = options;
  return new Q.Promise((resolvePromise, rejectPromise) => {
    function resolve(res) {
      resolvePromise(res);
      cb(null, res);
    }

    function reject(reason) {
      rejectPromise(reason);
      cb(reason);
    }

    if (typeOf(bucket) !== 'string') {
      return reject(new Error('Expected first parameter to be string but got %s', typeOf(bucket)));
    }

    if (typeof buff === 'undefined' || typeOf(buff) !== 'string') {
      return reject(new Error('Expected file to be buffer or string but got %s', typeOf(buff)));
    }

    if (!Buffer.isBuffer(buff)) {
      return fs.stat(buff, (err) => {
        if (err == null) {
          const mimetype = mime.lookup(buff);
          const encoding = mime.charsets.lookup(mimetype) || 'base64';

          return fs.readFile(buff, encoding, (fsErr, buffered) => {
            if (fsErr) return reject(fsErr);
            const $file = {
              bucket,
              key: key || `${(Math.random().toString(36) + 0).slice(2, 10)}
                ${Date.now()}${path.extname(buff)}`,
              metadata: {},
            };

            return $createFile($file, buffered)
              .then(resolve, fileCreateErr => reject(fileCreateErr));
          });
        }
        return reject(new Error('File not found'));
      });
    }
    return $createFile(buff).then(() => resolve('file upload successfull'));
  });
}

export function getSignedURL(options, cb) {
  const callback = cb || function fnCallback() {};
  const S3Instance = getS3Instance();
  const { key, bucket } = options;
  let { type, expires } = options;
  expires = expires || 900; // set default download url expiration to 15mins
  type = type || 'getObject';

  return new Q.Promise((resolvePromise, rejectPromise) => {
    function resolve(response) {
      resolvePromise(response);
      callback(null, response);
    }

    function reject(reason) {
      rejectPromise(reason);
      callback(reason);
    }

    if (typeOf(options) !== 'object') {
      return reject(new Error('Expected first param to be object of keys bucket and key'));
    }

    if (typeOf(key) !== 'string') {
      return reject(new Error('Expected key to be string but got %s', typeOf(key)));
    }

    if (typeOf(bucket) !== 'string') {
      return reject(new Error('Expected bucket name to be string but got %s', typeOf(key)));
    }

    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expires,
    };

    return S3Instance.getSignedUrl(type, params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

export function getFile(bucket, key, callback) {
  const S3Instance = getS3Instance();

  if (typeOf(key) !== 'string') {
    return callback(new Error('Expected key to be string but got %s', typeOf(key)));
  }

  if (typeOf(bucket) !== 'string') {
    return callback(new Error('Expected bucket name to be string but got %s', typeOf(key)));
  }

  const params = {
    Bucket: bucket,
    Key: key,
  };

  return S3Instance.getObject(params, (err, data) => {
    if (err) callback(err);
    callback(null, data);
  });
}

export function deleteMultiple(bucket, Objects, callback) {
  const S3Instance = getS3Instance();
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: [],
    },
  };

  _.forEach(Objects, (object) => {
    if (!Object.hasOwnProperty.call(object, 'key')) {
      callback(new Error('One or more of your objects has no key'));
    } else {
      params.Delete.Objects.push({
        Key: object.key,
        VersionId: object.VersionId || '',
      });
    }
  });

  S3Instance.deleteObjects(params, (err, data) => {
    if (err) callback(err);
    else callback(null, data);
  });
}

function $emptyBucket(options, callback) {
  const { bucket, prefix } = options;

  let params = {
    Bucket: bucket,
    Prefix: prefix || '',
  };

  const S3Instance = getS3Instance();

  S3Instance.headBucket({ Bucket: bucket }, (err) => {
    if (err) callback(err);
    return S3Instance.listObjects(params, (error, data) => {
      if (error) return callback(error);

      if (data.Contents.length === 0) return callback();
      params = { Bucket: bucket };
      params.Delete = { Objects: [] };

      data.Contents.forEach((content) => {
        params.Delete.Objects.push({ Key: content.Key });
      });

      return S3Instance.deleteObjects(params, (deleteError, deletedData) => {
        if (deleteError) return callback(deleteError);
        if (deletedData.Deleted.length === 1000) return $emptyBucket({ bucket }, callback);
        return callback();
      });
    });
  });
}

export function deleteBucket(bucket, callback) {
  const S3Instance = getS3Instance();
  $emptyBucket({ bucket }, (err) => {
    if (err) return callback(err);

    return S3Instance.deleteBucket({ Bucket: bucket }, (error, response) => {
      if (error) return callback(error);
      return callback(null, response);
    });
  });
}

export function deleteObject({ bucket, key }, callback) {
  const S3Instance = getS3Instance();
  const params = {
    Bucket: bucket,
    Key: key,
  };
  S3Instance.deleteObject(params, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
}

export function startTestStorage(callback) {
  mkdirp('/tmp/eworm', (err) => {
    if (err) callback(err);
    const client = new S3rver({
      port: 4569,
      hostname: 'localhost',
      silent: true,
      directory: '/tmp/eworm',
    }).run((s3rverError) => {
      if (err) {
        return callback(s3rverError);
      }
      return callback(null, client);
    });
  });
}
