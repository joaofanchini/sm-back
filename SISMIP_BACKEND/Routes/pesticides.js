const express = require('express');
const router = express.Router();
const Pesticide = require('../model/pesticides.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req, res) => {
  try {
    var pesticide = await Pesticide.find({ user_id: req.auth_data.userId });

    if (pesticide.length == 0)
      return res.status(404).json({ message: 'Nenhum Pesticida Cadastrado' });

    return res.json(pesticide);
  } catch (err) {
    return res.status(500).json({ error: 'Erro na Consulta de Pesticidas' });
  }
});

router.get('/pesticide/:name', auth, async (req, res) => {
  const { name } = req.params.name;

  try {
    var pesticide = await Pesticide.findOne({
      user_id: req.auth_data.userId,
      name
    });

    if (!pesticide)
      return res.status(404).json({ message: 'Nenhum Pesticida Encontrado' });

    return res.json(pesticide);
  } catch (err) {
    return res.status(500).json({ error: 'Erro na Consulta de Pesticidas' });
  }
});

router.post('/create', auth, async (req, res) => {
  const { name, description, price_per_volume } = req.body;

  if (!name || !description || !price_per_volume) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }
  try {
    if (await Pesticide.findOne({ user_id: req.auth_data.userId, name }))
      return res.status(400).json({ error: 'Pesticida já cadastrado' });

    let pesticideEntity = {
      user_id: req.auth_data.userId,
      name,
      description,
      price_per_volume
    };

    var pesticide = await Pesticide.create(pesticideEntity);

    return res.status(201).json(pesticide);
  } catch (err) {
    if (err)
      return res.status(500).json({ error: 'Erro no Cadastro de Pesticida' });
  }
});
router.post('/delete', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var pesticide = await Pesticide.deleteOne({
      user_id: req.auth_data.userId,
      name
    });

    if (pesticide.deletedCount == 0)
      return res.status(410).json({ message: 'Pesticida Inexistente' });

    return res.status(200).json({ message: 'Pesticida Excluído' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Erro ao Excluir Pesticida' });
  }
});

router.post('/update', auth, async (req, res) => {
  const { name, description, price_per_volume } = req.body;

  if (!name || !description || !price_per_volume) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    var pesticide = await Pesticide.updateOne(
      { user_id: req.auth_data.userId, name },
      { $set: { description: description, price_per_volume: price_per_volume } }
    );

    if (pesticide.n == 0)
      return res.status(410).json({ message: 'Pesticida Inexistente' });

    return res.status(200).json({ message: 'Pesticida Alterado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao Alterar Pesticida' });
  }
});

module.exports = router;
