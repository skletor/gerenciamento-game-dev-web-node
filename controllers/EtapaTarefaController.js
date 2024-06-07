const express = require('express');
const router = express.Router();
//const EtapaTarefa = require('../models/EtapaTarefa');

// Criar uma nova etapa para uma tarefa específica
router.post('/tarefas/:tarefaId/etapas', async (req, res) => {
  const { tarefaId } = req.params;
  try {
    //const etapa = await EtapaTarefa.create({ ...req.body, tarefaId });
    res.json(etapa);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
