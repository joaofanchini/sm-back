const express = require('express');
const router = express.Router();
const Bug = require('../model/bugs.js');
const auth = require('../middleware/auth.js');

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req, res) => {
  try {
    var bug = await Bug.find({});

    if (bug.length == 0)
      return res.status(404).send({ message: 'Nenhum Inseto Cadastrado' });

    return res.send(bug);
  } catch (err) {
    return res.status(500).send({ error: 'Erro na Consulta de Insetos' });
  }
});

router.get('/bug', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var bug = await Bug.findOne({ name });

    if (!bug)
      return res.status(404).send({ message: 'Nenhum Inseto Encontrado' });

    return res.send(bug);
  } catch (err) {
    return res.status(500).send({ error: 'Erro na Consulta de Insetos' });
  }
});

router.post('/create', auth, async (req, res) => {
  const {
    name,
    description,
    na_fase_r,
    na_fase_v,
    initial_fase,
    end_fase
  } = req.body;

  if (
    !name ||
    !description ||
    !na_fase_r ||
    !na_fase_v ||
    !initial_fase ||
    !end_fase
  ) {
    return res
      .status(400)
      .send({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }
  try {
    if (await Bug.findOne({ name }))
      return res.status(400).send({ error: 'Inseto já cadastrado' });

    var bug = await Bug.create(req.body);

    return res.status(201).send(bug);
  } catch (err) {
    if (err)
      return res.status(500).send({ error: 'Erro no Cadastro de Inseto' });
  }
});
router.post('/delete', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var bug = await Bug.deleteOne({ name });

    if (bug.deletedCount == 0)
      return res.status(410).send({ message: 'Inseto Inexistente' });

    return res.status(200).send({ message: 'Inseto Excluído' });
  } catch (err) {
    return res.status(500).send({ error: 'Erro ao Excluir Inseto' });
  }
});

router.post('/update', auth, async (req, res) => {
  const {
    name,
    description,
    na_fase_r,
    na_fase_v,
    initial_fase,
    end_fase,
    image
  } = req.body;

  if (
    !name ||
    !description ||
    !na_fase_r ||
    !na_fase_v ||
    !initial_fase ||
    !end_fase
  ) {
    return res
      .status(400)
      .send({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    var bug = await Bug.updateOne(
      { name },
      {
        $set: {
          description: description,
          na_fase_r: na_fase_r,
          na_fase_v: na_fase_v,
          initial_fase: initial_fase,
          end_fase: end_fase,
          image: image
        }
      }
    );

    if (bug.n == 0)
      return res.status(410).send({ message: 'Inseto Inexistente' });

    return res.status(200).send({ message: 'Inseto Alterado' });
  } catch (err) {
    return res.status(500).send({ error: 'Erro ao Alterar Inseto' });
  }
});

module.exports = router;
