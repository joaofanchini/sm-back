const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const Plantations = require('../model/platations');
const Plagues = require('../model/plagues');

// FUNÇÕES PRINCIPAIS

router.post('/aggregate/plague', auth, async (req, res) => {
  let userId = req.auth_data.userId;
  let {
    name_plantation,
    defoliated_plants,
    plagues,
    current_plantation_phase
  } = req.body;

  if (
    !name_plantation ||
    !defoliated_plants ||
    !current_plantation_phase ||
    !plagues ||
    plagues.length == 0
  ) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  if (plagues.some(plague => !plague.plague_id || !plague.quantity)) {
    return res.status(400).json({
      error:
        'Dados inseridos invalidos e/ou insuficientes - plague_id ou quantity'
    });
  }

  try {
    let plantation = await Plantations.findOne({
      user_id: userId,
      name: name_plantation
    });

    if (plantation == null) {
      return res.status(404).json({ message: 'Plantação não encontrada' });
    }

    let plaguesFounded = await Plagues.find({
      user_id: userId,
      _id: { $in: plagues.map(p => p.plague_id) }
    });

    if (plaguesFounded.length != plagues.length) {
      return res
        .status(404)
        .json({ message: 'Alguma praga enviada não encontrada/cadastrada' });
    }

    let plantationUpdated = await Plantations.updateOne(
      { _id: plantation._id },
      {
        $push: {
          samplings: {
            defoliated_plants,
            current_plantation_phase,
            plagues
          }
        }
      }
    );

    res.json(plantationUpdated);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: 'Erro na Agregação de Dados de Amostragem' });
  }
});

module.exports = router;
