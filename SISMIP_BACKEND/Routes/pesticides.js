const express = require ('express');
const router = express.Router();
const Pesticide = require('../model/pesticides.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req,res) => {
    
    try{       
        
        var pesticide = await Pesticide.find({});
        
        if (pesticide.length == 0) return res.status(404).send ({message: 'Nenhum Pesticida Cadastrado'});

        return res.send(pesticide);
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro na Consulta de Pesticidas'});

    } 
});

router.get('/pesticide', auth, async (req,res) => {
    
    const {name} = req.body;

    try{       
        
        var pesticide = await Pesticide.findOne({name});

        if (!pesticide) return res.status(404).send ({message: 'Nenhum Pesticida Encontrado'}); 
        
        return res.send(pesticide);
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro na Consulta de Pesticidas'});

    } 
});

router.post('/create', auth, async (req,res) => {

    const {name, description, volum} = req.body;

    if (!name || !description || !volum)
    {
        return res.status(400).send ({error: 'Dados inseridos invalidos e/ou insuficientes'});
    }
    try{
        
        if (await Pesticide.findOne({name})) return res.status(400).send ({error: 'Pesticida já cadastrado'});

        var pesticide = await Pesticide.create(req.body);

        return res.status(201).send(pesticide);
       
    }
    catch (err) {
        
        if (err) return res.status(500).send ({error: 'Erro no Cadastro de Pesticida'});
    }
    
});
router.post('/delete', auth, async (req,res) => {
    
    const {name} = req.body;

    try{       
        
        var pesticide = await Pesticide.deleteOne({name});

        if (esticide.deletedCount == 0) return res.status(410).send ({message: 'Pesticida Inexistente'});
        
        return res.status(200).send ({message: 'Pesticida Excluído'});
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro ao Excluir Pesticida'});

    } 
});

router.post('/update', auth, async (req,res) => {
    
    const {name, description, volum, price} = req.body;
    
    if (!name || !description || !volum || !price)
    {
        return res.status(400).send ({error: 'Dados inseridos invalidos e/ou insuficientes'});
    }    
        
    try{        
        
        var pesticide = await Pesticide.updateOne({name}, { $set: {description: description, volum: volum, price: price}});

        if (pesticide.n == 0) return res.status(410).send ({message: 'Pesticida Inexistente'});
        
        return res.status(200).send ({message: 'Pesticida Alterado'});
    }
    
    catch (err) {
        return res.status(500).send ({error: 'Erro ao Alterar Pesticida'});

    } 
});

module.exports = router;