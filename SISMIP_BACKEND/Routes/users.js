const express = require ('express');
const router = express.Router();
const User = require('../model/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');
const config = require('../config/config.js');

//FUNÇÕES AUXILIARES

var createUserToken = (userid) =>{
    return jwt.sign({id: userid}, config.jwt_pass, {expiresIn: config.jwt_expires_in});
}

var encryptedPassword = (password) => {
    
    let salt = bcrypt.genSaltSync(config.bcrypt_saltRounds);
  
    let hash = bcrypt.hashSync(password, salt);

    return hash;
}

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req,res) => {
    
    try{       
        
        var user = await User.find({});
        
        if (user.length == 0) return res.status(404).send ({message: 'Nenhum Usuário Cadastrado'});

        return res.send(user);
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro na Consulta de Usuário'});

    } 
});

router.get('/email', auth, async (req,res) => {
    
    const {email} = req.body;

    try{       
        
        var user = await User.findOne({email});

        if (!user) return res.status(404).send ({message: 'Nenhum Usuário Encontrado'}); 

        return res.send(user);
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro na Consulta de Usuário'});

    } 
});

router.post('/create', auth, async (req,res) => {

    const {email, name, password} = req.body;

    if (!email || !name || !password) return res.status(400).send ({error: 'Dados inseridos invalidos e/ou insuficientes'});

    try{
        
        if (await User.findOne({email})) return res.status(400).send ({error: 'Usuário já cadastrado'});

        var user = await User.create(req.body);

        user.password = undefined;
        return res.status(201).send(user);
       
    }
    catch (err) {
        
        if (err) return res.status(500).send ({error: 'Erro no Cadastro do Usuário'});
    }
    
});
router.post('/delete', auth, async (req,res) => {
    
    const {email, name} = req.body;

    if (name == 'admin' || email == 'admin') return res.status(403).send ({message: 'Não é Possível Excluir o Administrador'});

    try{       
        
        var user = await User.deleteOne({email});

        if (user.deletedCount == 0) return res.status(410).send ({message: 'Usuário Inexistente'});
        
        return res.status(200).send ({message: 'Usuário Excluído'});
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro ao Excluir Usuário'});

    } 
});

router.post('/update', auth, async (req,res) => {
    
    const {email, password, name} = req.body;
   
    if (name == 'admin' || email == 'admin') return res.status(403).send ({message: 'Não é Possível Alterar o Administrador'});
    
    if (!email || !name || !password) return res.status(403).send ({message: 'Dados inseridos invalidos e/ou insuficientes'});     
        
    try{        
        
        var user = await User.updateOne({email}, { $set: { name: name, password: encryptedPassword(password)}});

        if (user.n == 0) return res.status(410).send ({message: 'Usuário Inexistente'});
        
        return res.status(200).send ({message: 'Usuário Alterado'});
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro ao Alterar Usuário'});

    } 
});

router.post('/auth', async (req,res) => {
    
    const {email, password} = req.body;

    if (!email || !password) return res.status(400).send ({error: 'Dados inseridos invalidos e/ou insuficientes'});
    
    try{       
        
        var user = await User.findOne({email}).select('+password');
        if (!user) return res.status(400).send ({error: 'Usuário não cadastrado'});

        var pass = bcrypt.compareSync(password, user.password);     
        
        if (!pass) return res.status(401).send ({error: 'Senha não confere'});

        user.password = undefined;
        return res.status(202).send({user, token: createUserToken(user.id)});
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro na Consulta de Usuário'});

    } 
});

module.exports = router;