import express from 'express';
import httpStatus from 'http-status';
import { getDb }         from '../server/helpers/database';

let  router = express.Router();

router.get('/dbconn', (req, res) => {
    res.status(httpStatus.OK).send({database: getDb().name});
});

export default router;