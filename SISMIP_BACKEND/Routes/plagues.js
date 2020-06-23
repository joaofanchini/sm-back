const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const Plagues = require('../model/plagues.js');

//FUNÇÕES PRICIPAIS

router.get('/', auth, async (req, res) => {
  try {
    var bug = await Plagues.find({ user_id: req.auth_data.userId });

    if (bug.length == 0)
      return res.status(404).send({ message: 'Nenhum Inseto Cadastrado' });

    return res.send(bug);
  } catch (err) {
    return res.status(500).send({ error: 'Erro na Consulta de Insetos' });
  }
});

router.get('/plague/:name', auth, async (req, res) => {
  let name = req.params.name;

  try {
    var bug = await Plagues.findOne({ user_id: req.auth_data.userId, name });

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
    na_phase_r,
    na_phase_v,
    initial_phase,
    end_phase
  } = req.body;

  if (
    !name ||
    !description ||
    !na_phase_r ||
    !na_phase_v ||
    !initial_phase ||
    !end_phase
  ) {
    return res
      .status(400)
      .send({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }
  try {
    if (await Plagues.findOne({ user_id: req.auth_data.userId, name }))
      return res.status(400).send({ error: 'Inseto já cadastrado' });

    let bugDto = {
      user_id: req.auth_data.userId,
      name,
      description,
      na_phase_r,
      na_phase_v,
      initial_phase,
      end_phase
    };

    var bug = await Plagues.create(bugDto);

    return res.status(201).send(bug);
  } catch (err) {
    if (err)
      return res.status(500).send({ error: 'Erro no Cadastro de Inseto' });
  }
});
router.post('/delete', auth, async (req, res) => {
  const { name } = req.body;

  try {
    var bug = await Plagues.deleteOne({ user_id: req.auth_data.userId, name });

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
    na_phase_r,
    na_phase_v,
    initial_phase,
    end_phase,
    image
  } = req.body;

  if (
    !name ||
    !description ||
    !na_phase_r ||
    !na_phase_v ||
    !initial_phase ||
    !end_phase
  ) {
    return res
      .status(400)
      .send({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    var bug = await Plagues.updateOne(
      { user_id: req.auth_data.userId, name },
      {
        $set: {
          description: description,
          na_phase_r: na_phase_r,
          na_phase_v: na_phase_v,
          initial_phase: initial_phase,
          end_phase: end_phase,
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
