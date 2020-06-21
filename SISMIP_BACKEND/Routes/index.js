const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const config = require('../config/config.js');

router.get('/', auth, function (req,res){

    return res.send({message: 'tudo ok com o get da raiz'});

});

router.post('/', auth, function (req,res){

    return res.send({message: 'tudo ok com o post da raiz'});

});


module.exports = router;