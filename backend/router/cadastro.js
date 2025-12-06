const express = require('express');
const Cadastro = require('../models/Cadastro');
const router = express.Router();

router.post('/cadastro-usuarios', async (req, res) => {
  try {
    const { nome, endereco } = req.body;
    const novoCadastro = await Cadastro.create({ nome, endereco });
    res.status(201).json(novoCadastro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/lista-usuarios', async (req, res) => {
  try {
    const cadastros = await Cadastro.find();
    res.json(cadastros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cadastro = await Cadastro.findById(req.params.id);
    if (!cadastro) {
      return res.status(404).json({ message: 'Cadastro não encontrado!' });
    }
    res.json(cadastro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cadastroDeletado = await Cadastro.findByIdAndDelete(req.params.id);
    if (!cadastroDeletado) {
      return res.status(404).json({ message: 'Cadastro não encontrado!' });
    }
    res.json({ message: 'Cadastro deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, endereco } = req.body;
    const cadastroAtualizado = await Cadastro.findByIdAndUpdate(
      req.params.id,
      { nome, endereco },
      { new: true } 
    );

    if (!cadastroAtualizado) {
      return res.status(404).json({ message: 'Cadastro não encontrado!' });
    }

    res.json(cadastroAtualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;