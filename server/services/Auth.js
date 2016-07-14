import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { secrets } from '../../config';
import RoleManager from './RoleManager';

export function deserialize(token, callback) {
  jwt.verify(token, secrets['app:secret'], (err, decoded) => {
    if (err) callback(err);
    callback(null, decoded);
  });
}

export function extractHeaderToken(headers) {
  let token;
  if (headers.authorization && headers.authorization !== '') {
    token = headers.authorization.split(' ')[1];
  }
  return token || null;
}

export function loadRoles() {
  /* eslint global-require: "off" */
  let roles;
  try {
    roles = require('../../config/roles.json');
  } catch (err) {
    roles = {};
  }
  return roles;
}

export function doAuth(user, operation, params, cb, roles) {
  const { role } = user;
  const $roles = roles || loadRoles();
  const $RoleManager = new RoleManager($roles);
  return $RoleManager.can(role, operation, params, cb);
}

export default function Auth(config, ...args) {
  let { operation } = config;
  const { params, roles, cb } = config;

  if (typeof config === 'string' && args.length === 0) {
    operation = config;
  }

  return (req, res, next) => {
    function fail(message) {
      res.status(httpStatus.FORBIDDEN).send(message);
    }

    const token = extractHeaderToken(req.headers) || req.body.token || req.query.token;

    if (token) {
      return deserialize(token, (err, user) => {
        if (err) debug(err);
        doAuth(user, operation, params, cb, roles)
          .then((result) => {
            if (!result) fail('unauthorized to access resource');
            req.user = user;
            next();
          }, (error) => {
            fail(`unauthorized to access resource: ${error}`);
          });
      });
    }
    return fail('unauthorized to access resource');
  };
}

export function serialize(object, callback) {
  jwt.sign(object, secrets['app:secret'], {
    algorithm: 'HS256',
    expiresIn: '7d',
  }, (token) => {
    callback(null, token);
  });
}
