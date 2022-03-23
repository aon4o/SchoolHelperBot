const router = require('express').Router();
const bodyParser = require("express");

router.use(bodyParser.json());

router.route('/status')
    .get((request, response) => {
        response.status(200).end();
    })

module.exports = router;