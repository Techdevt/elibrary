import express from 'express';
let  router = express.Router();

router.post('/', (req, res) => {
    // handle a post request to this route
});

router.get('/info', (req, res) => {
    // handle a get request to this route
    res.send({name: 'Breezy'});
});

export default router;