const express = require('express');
const router = express.Router();
const Comando = require('../models/CLP_Comando');
const { enviarComando } = require('../services/clp_comando');
const tagsCLP = require('../services/clp_tags');

router.post('/pedir-suco', async (req, res) => {
  try {
    const { ack, pedido, cmd, status } = req.body;
    const pedidoNovo = await Comando.create({ ack, pedido, cmd, status });

    if (pedidoNovo) {
      ack.pedidoACK = true;
      await enviarComando('cmd.inicio');
    }

    res.status(201).json({
      message: 'Pedido enviado ao CLP!',
      pedido: pedidoNovo,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/status-pedido', async (req, res) => {
  try {
    const consulta = await Comando.find().sort({ criadoEm: -1 }).limit(10);
    res.status(200).json(consulta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/atualizar-relatorio-falhas', async (req, res) => {
  try {
    const { status } = req.body;
    const falhaAtualizada = await Comando.findOneAndUpdate(
      {},
      { $set: { status } },
      { new: true, upsert: true }
    );
    res.status(200).json({
      message: 'Relatório de falhas atualizado!',
      status: falhaAtualizada,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/consultar-falhas', async (req, res) => {
  try {
    const consultarFalha = await Comando.find(
      { 'status.falhaAtiva': true },
      { status: 1 }
    ).sort({ criadoEm: -1 });
    res.status(200).json({ consultarFalha });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/abortar', async (req, res) => {
  try {
    const { ack, pedido, cmd, status } = req.body;
    const abortar = await Comando.create({ ack, pedido, cmd, status });
    await enviarComando('cmd.abortar');
    res.status(201).json({
      message: 'Pedido cancelado com sucesso!',
      pedido: abortar,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { ack, pedido, cmd, status } = req.body;
    const reset = await Comando.create({ ack, pedido, cmd, status });
    await enviarComando('cmd.reset');
    res.status(201).json({
      message: 'Sistema resetado!',
      pedido: reset,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;