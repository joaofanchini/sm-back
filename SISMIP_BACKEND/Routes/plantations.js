const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const Plantations = require('../model/platations');
//FUNÇÕES PRINCIPAIS

router.get('/', auth, async (req, res) => {
  try {
    let plantations = await Plantations.find({ user_id: req.auth_data.userId });

    if (plantations.length == 0)
      return res.status(404).json({ message: 'Nenhuma Plantação Cadastrada' });

    return res.json(plantations);
  } catch (err) {
    console.log(err);
    return res.json({ error: 'Erro para consulta de Plantações' });
  }
});

router.get('/plantation/:name', auth, async (req, res) => {
  let name = req.params.name;

  try {
    var bug = await Plantations.findOne({
      user_id: req.auth_data.userId,
      name
    });

    if (!bug)
      return res.status(404).json({ message: 'Nenhuma Plantação Encontrada' });

    return res.json(bug);
  } catch (err) {
    return res.status(500).json({ error: 'Erro na Consulta de Plantações' });
  }
});

router.post('/create', auth, async (req, res) => {
  const { name, area, location } = req.body;

  if (
    !name ||
    !area ||
    (!location &&
      (!location.street ||
        !location.number ||
        !location.neighborhood ||
        !location.city ||
        !location.state ||
        !location.zipCode ||
        !location.geolocation ||
        !location.geolocation.coordinates ||
        !location.geolocation.coordinates.size != 2))
  ) {
    return res.status(400).json({
      error: 'Dados inseridos invalidos e/ou insuficientes'
    });
  }

  try {
    if (await Plantations.findOne({ user_id: req.auth_data.userId, name }))
      return res.status(400).json({ error: 'Plantação já cadastrada' });

    let plantationEntity = {
      user_id: req.auth_data.userId,
      name,
      area,
      location
    };

    var plantation = await Plantations.create(plantationEntity);

    return res.status(201).json(plantation);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Erro no Cadastro de Plantação' });
  }
});

router.post('/update', auth, async (req, res) => {
  const { name, area, location } = req.body;

  if (
    !name ||
    !area ||
    (!location &&
      (!location.street ||
        !location.number ||
        !location.neighborhood ||
        !location.city ||
        !location.state ||
        !location.zipCode ||
        !location.geolocation ||
        !location.geolocation.coordinates ||
        !location.geolocation.coordinates.size != 2))
  ) {
    return res.status(400).json({
      error: 'Dados inseridos invalidos e/ou insuficientes'
    });
  }
  try {
    var plantation = await Plagues.updateOne(
      { user_id: req.auth_data.userId, name },
      {
        $set: {
          area: area,
          location: location
        }
      }
    );

    if (plantation.n == 0)
      return res.status(410).json({ message: 'Plantação Inexistente' });

    return res.status(200).json({ message: 'Plantação Alterado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao Alterar Plantação' });
  }
});

module.exports = router;
