const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

const Plantations = require('../model/platations');
const Plagues = require('../model/plagues');
const Pesticides = require('../model/pesticides');

// FUNÇÕES PRINCIPAIS

router.post('/sampling', auth, async (req, res) => {
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
        .status(400)
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

    return res.status(201).json(plantationUpdated);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: 'Erro na Agregação de Dados de Amostragem' });
  }
});

router.post('/pesticides', auth, async (req, res) => {
  let userId = req.auth_data.userId;
  let { name_plantation, pesticides: pesticideDto } = req.body;

  if (
    !name_plantation ||
    !pesticideDto ||
    pesticideDto.length == 0 ||
    pesticideDto.some(p => !p.pesticide_id || !p.volume_applied)
  ) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    let plantation = await Plantations.findOne({
      user_id: userId,
      name: name_plantation
    });

    if (plantation == null) {
      return res.status(404).json({ message: 'Plantação não encontrada' });
    }

    let pesticidesFounded = await Pesticides.find({
      user_id: userId,
      _id: { $in: pesticideDto.map(p => p.pesticide_id) }
    });

    if (pesticidesFounded.length != pesticideDto.length) {
      return res
        .status(400)
        .json({ message: 'Algum pesticida enviada não encontrada/cadastrada' });
    }

    let plantationUpdated = await Plantations.updateOne(
      { _id: plantation._id },
      {
        $push: {
          pesticides_applied: pesticideDto
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

// FUNÇÕES DE DELEÇÃO
router.post('/delete/pesticides', auth, async (req, res) => {
  let userId = req.auth_data.userId;
  let { name_plantation, pesticide_applied_id } = req.body;

  if (!name_plantation || !pesticide_applied_id) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    let plantation = await Plantations.findOne({
      user_id: userId,
      name: name_plantation
    });

    if (plantation == null) {
      return res.status(400).json({ message: 'Plantação não encontrada' });
    }

    if (
      !plantation.pesticides_applied ||
      plantation.pesticides_applied.length == 0
    ) {
      return res
        .status(400)
        .json({ message: 'Não a nenhum pesticida aplicado a plantação' });
    }

    let pesticidesAppliedFiltered = plantation.pesticides_applied.filter(
      p => p._id == pesticide_applied_id
    );

    if (!pesticidesAppliedFiltered || pesticidesAppliedFiltered.length == 0) {
      return res
        .status(400)
        .json({ message: 'Pesticida aplicado enviado não encontrado' });
    }

    plantation.pesticides_applied.pull(pesticide_applied_id);
    let result = await plantation.save();

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Erro ao deletar dados de agregação de pesticidas aplicados'
    });
  }
});

router.post('/delete/sampling', auth, async (req, res) => {
  let userId = req.auth_data.userId;
  let { name_plantation, sampling_id } = req.body;

  if (!name_plantation || !sampling_id) {
    return res
      .status(400)
      .json({ error: 'Dados inseridos invalidos e/ou insuficientes' });
  }

  try {
    let plantation = await Plantations.findOne({
      user_id: userId,
      name: name_plantation
    });

    if (plantation == null) {
      return res.status(400).json({ message: 'Plantação não encontrada' });
    }

    if (!plantation.samplings || plantation.samplings.length == 0) {
      return res
        .status(400)
        .json({ message: 'Não a nenhuma amostragem para esta plantação' });
    }

    let samplingFiltered = plantation.samplings.filter(
      s => s._id == sampling_id
    );

    plantation.samplings.pull(sampling_id);
    let result = await plantation.save();

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Erro ao deletar dados de agregação de pesticidas aplicados'
    });
  }
});

module.exports = router;
