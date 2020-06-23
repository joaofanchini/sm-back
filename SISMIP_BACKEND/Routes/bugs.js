const express = require('express');
const router = express.Router();
const Plagues = require('../model/plagues.js');
const auth = require('../middleware/auth.js');

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req, res) => {
  try {
    var bug = await Plagues.find({})
      .where('user_id')
      .equals(req.auth_data);

    if (bug.length == 0)
      return res.status(404).send({ message: 'Nenhum Inseto Cadastrado' });

    return res.send(bug);
  } catch (err) {
    return res.status(500).send({ error: 'Erro na Consulta de Insetos' });
  }
});

router.get('/plague', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var bug = await Plagues.findOne({ name })
      .where('user_id')
      .equals(req.auth_data);

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
    if (
      await Plagues.findOne({ name })
        .where('user_id')
        .equals(req.auth_data)
    )
      return res.status(400).send({ error: 'Inseto já cadastrado' });

    var bug = await Plagues.create(req.body)
      .where('user_id')
      .equals(req.auth_data);

    return res.status(201).send(bug);
  } catch (err) {
    if (err)
      return res.status(500).send({ error: 'Erro no Cadastro de Inseto' });
  }
});
router.post('/delete', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var bug = await Plagues.deleteOne({ name })
      .where('user_id')
      .equals(req.auth_data);

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
    var bug = await Plagues.updateOne(
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
    )
      .where('user_id')
      .equals(req.auth_data);

    if (bug.n == 0)
      return res.status(410).send({ message: 'Inseto Inexistente' });

    return res.status(200).send({ message: 'Inseto Alterado' });
  } catch (err) {
    return res.status(500).send({ error: 'Erro ao Alterar Inseto' });
  }
});

module.exports = router;
