const express = require('express');
const router = express.Router();
const Suco = require('../models/Suco');

const produto = [
  { tipo: "Laranja", preco: 2.00, status: "Disponível", quantidade: 10 },
  { tipo: "Limão", preco: 2.00, status: "Disponível", quantidade: 10 },
  { tipo: "Morango", preco: 4.00, status: "Disponível", quantidade: 10 }
];

router.get('/procurar-suco', async (req, res) => {
  try {
    const sucos = await Suco.find();
    if (!sucos || sucos.length === 0) {
      return res.status(200).json(produto);
    }
    res.status(200).json(sucos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sucos: ' + err.message });
  }
});

router.post('/cadastrar-suco', async (req, res) => {
  try {
    const { tipo, preco, status, quantidade } = req.body;

    if (!tipo || preco === undefined) {
      return res.status(400).json({ error: 'Parâmetros tipo e preco são obrigatórios.' });
    }

    const novoSuco = new Suco({ tipo, preco, status, quantidade });
    await novoSuco.save();

    res.status(201).json(novoSuco);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar suco: ' + err.message });
  }
});

router.post('/pedir-suco', async (req, res) => {
  try {
    const { tipo, preco, quantidade } = req.body;

    if (!tipo || preco === undefined) {
      return res.status(400).json({ error: 'Parâmetros tipo e preco são obrigatórios.' });
    }

    if (quantidade > 3) {
      return res.status(400).json({ error: 'Limite de quantidade atingido!' });
    }

    const suco = produto.find(p => p.tipo.toLowerCase() === tipo.toLowerCase());

    if (!suco) {
      return res.status(404).json({ error: 'Suco não encontrado!' });
    }

    if (suco.quantidade <= 0) {
      return res.status(400).json({ error: 'Sem estoque!' });
    }

    if (suco.quantidade < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente!' });
    }

    suco.quantidade -= quantidade;

    const pedido = new Suco({ tipo, preco, quantidade });
    await pedido.save();

    res.status(201).json({
      message: 'Pedido realizado com sucesso!',
      pedido,
      estoqueRestante: suco.quantidade
    });

  } catch (err) {
    res.status(400).json({ error: 'Erro ao pedir suco: ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const suco = await Suco.findById(req.params.id);
    if (!suco) {
      return res.status(404).json({ error: 'Suco não encontrado' });
    }
    res.status(200).json(suco);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar suco: ' + err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sucoAtualizado = await Suco.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sucoAtualizado) {
      return res.status(404).json({ error: 'Suco não encontrado' });
    }
    res.status(200).json(sucoAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar suco: ' + err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sucoDeletado = await Suco.findByIdAndDelete(req.params.id);
    if (!sucoDeletado) {
      return res.status(404).json({ error: 'Suco não encontrado' });
    }
    res.status(200).json({ message: 'Suco deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar suco: ' + err.message });
  }
});

module.exports = router;
