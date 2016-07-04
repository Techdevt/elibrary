import express from 'express';
import httpStatus from 'http-status';
import { getDb } from '../server/helpers/database';

let router = express.Router();

const getRoutes = (upload) => {
    router.get('/dbconn', (req, res) => {
        res.status(httpStatus.OK).send({ database: getDb().name });
    });

    router.post('/storage', upload.single('avatar'), (req, res) => {
    	res.status(200).send(req.file);
    });

    return router;
};

export default getRoutes;