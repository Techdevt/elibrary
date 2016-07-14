import express from 'express';
import httpStatus from 'http-status';
import auth from '../../services/Auth';

const router = express.Router();

// Auth middleware also accepts operations in the form Auth('write')
// Auth:@param {operation, params, cb, roles}
router.get('/', auth('write'), (req, res) => {
  // handle a get request to this route
  res.status(httpStatus.OK).send({});
});

export default router;
