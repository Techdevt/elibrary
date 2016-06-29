import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { secrets } from '../../config';
import RoleManager from './RoleManager';

export default function Auth(config) {
    let { operation, params, cb, roles } = config;

    if(typeof config === "string" && arguments.length === 1) {
        operation = config;
    }
    
    return function(req, res, next) {
        function fail(message) {
            res.status(httpStatus.FORBIDDEN).send(message);
        }

        const token = extractHeaderToken(req.headers) || req.body.token || req.query.token;

        if (token) {
            deserialize(token, (err, user) => {
                if (err) console.log(err);
                doAuth(user, operation, params, cb, roles)
                    .then((result) => {
                        if (!result) fail('unauthorized to access resource');
                        req.user = user;
                        next();
                    }, err => {
                        fail('unauthorized to access resource');
                    });
            });
        } else {
            return fail('unauthorized to access resource');
        }
    }
}

export function serialize(object, callback) {
    jwt.sign(object, secrets['app:secret'], {
        algorithm: 'HS256',
        expiresIn: '7d'
    }, function(token) {
        callback(null, token);
    });
}

export function deserialize(token, callback) {
    jwt.verify(token, secrets['app:secret'], function(err, decoded) {
        if (err) callback(err);
        callback(null, decoded);
    });
}

export function extractHeaderToken(headers) {
    let token;
    if (headers.authorization) {
        token = headers.authorization.split(" ")[1];
    }
    return token || null;
}

export function doAuth(user, operation, params, cb, roles) {
    const { role } = user;
    roles = roles || loadRoles();
    const _RoleManager = new RoleManager(roles);
    return _RoleManager.can(role, operation, params, cb);
}

export function loadRoles() {
    let roles;
    try {
        roles = require('../../config/roles.json');
    } catch (err) {
        roles = {};
    }
    return roles;
}
