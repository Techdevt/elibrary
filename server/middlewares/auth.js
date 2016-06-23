import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';

export default function Auth(req, res, next) {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    token = req.body.token || req.query.token || token;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                next();
            }
        });

    } else {
        return res.status(httpStatus.FORBIDDEN).send({
            message: 'unauthorized to access resource'
        });
    }
}