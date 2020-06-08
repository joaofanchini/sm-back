const express = require('express');
const router = express.Router();
const User = require('../model/users.js');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const config = require('../config/config.js');

//FUNÇÕES AUXILIARES

var createUserToken = (Userid) => {
    return jwt.sign({ id: Userid }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
}

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req, res) => {

    try {

        var user = await User.find({});

        if (user.length == 0) return res.send({ message: 'Nenhum Usuário Cadastrado' });

        return res.send(user);
    }

    catch (err) {
        return res.status(500).send({ error: 'Erro na Consulta de Usuário' });

    }
});

router.get('/username', auth, async (req, res) => {

    const { username, password } = req.body;

    try {

        var user = await User.findOne({ username });

        return res.send(user);
    }

    catch (err) {
        return res.status(500).send({ error: 'Erro na Consulta de Usuário' });

    }
});


router.get('/auth', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send({ error: 'Dados inseridos invalidos e/ou insuficientes' });

    try {

        var user = await User.findOne({ username }).select('+password');
        if (!user) return res.status(400).send({ error: 'Usuário não cadastrado' });

        var pass = bcrypt.compareSync(password, user.password);

        if (!pass) return res.status(401).send({ error: 'Senha não confere' });

        user.password = undefined;
        return res.status(202).send({ user, token: createUserToken(user.id) });
    }

    catch (err) {
        return res.status(500).send({ error: 'Erro na Consulta de Usuário' });

    }
});

router.post('/create', auth, async (req, res) => {

    const { username, name, password } = req.body;

    if (!username || !name || !password) return res.status(400).send({ error: 'Dados inseridos invalidos e/ou insuficientes' });

    try {

        if (await User.findOne({ username })) return res.status(400).send({ error: 'Usuário já cadastrado' });

        var user = await User.create(req.body);

        user.password = undefined;
        return res.status(201).send(user);

    }
    catch (err) {

        if (err) return res.status(500).send({ error: 'Erro no Cadastro do Usuário' });
    }

});


module.exports = router;