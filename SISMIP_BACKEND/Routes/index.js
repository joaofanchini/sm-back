const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const config = require('../config/config.js');

router.get('/', function (req, res) {

    return res.json({ message: 'Application start' });

});

router.post('/', auth, function (req, res) {

    return res.send({ message: 'tudo ok com o post da raiz' });

});


module.exports = router;