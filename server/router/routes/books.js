import express from 'express';
import httpStatus from 'http-status';
import Auth from '../../services/Auth';

let  router = express.Router();

// Auth middleware also accepts operations in the form Auth('write')
// Auth:@param { operation, params, cb, roles }
router.get('/', Auth('write'), (req, res) => {
    // handle a get request to this route
    res.status(httpStatus.OK).send({});
});

export default router;