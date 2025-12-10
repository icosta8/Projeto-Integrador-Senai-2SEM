const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Suco = require('../models/Suco');
const axios = require('axios');
const { lerTags } = require('../services/server_opc_client');

const MAPA_PRODUTOS = {
  "cereja": 0,
  "laranja": 1,
  "ameixa": 2
};

const PRODUTOS_DEFAULT = [
  { tipo: "cereja", preco: 2.00, status: "Disponível", quantidade: 10 },
  { tipo: "laranja", preco: 2.00, status: "Disponível", quantidade: 10 },
  { tipo: "ameixa", preco: 4.00, status: "Disponível", quantidade: 10 }
];

router.get('/procurar-suco', async (req, res) => {
  try {
    const sucos = await Suco.find();
    res.status(200).json(sucos.length > 0 ? sucos : PRODUTOS_DEFAULT);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar sucos: ' + err.message });
  }
});

router.get('/menu', async (req, res) => {
  try {
    res.status(200).json(PRODUTOS_DEFAULT);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar menu: ' + err.message });
  }
});

router.post('/pedir-suco', async (req, res) => {
  try {
    const { tipo, quantidade } = req.body;

    if (!tipo || quantidade == null) {
      return res.status(400).json({ error: 'Parâmetros tipo e quantidade são obrigatórios.' });
    }

    // validar tipo
    const produtoIndex = MAPA_PRODUTOS[tipo.toLowerCase()];
    if (produtoIndex === undefined) {
      return res.status(400).json({ error: "Tipo de suco inválido." });
    }

    // Status do CLP
    const falha = await lerTags("status", "falhaAtiva");
    const status = await lerTags("status", "geral");
    const estoque = await lerTags("status", "estoqueProd")

    /*
    if (falha === true) {
      return res.status(400).json({ error: "Máquina em falha. Reinicie o sistema." });
    }

    if (status !== 0) {
      return res.status(400).json({ error: "Máquina ocupada." });
    }

    if (!Array.isArray(estoque)) {
      return res.status(500).json({ error: "CLP não retornou estoque válido." });
    }

    */
    if (estoque[produtoIndex] < quantidade) {
      return res.status(400).json({ error: "Estoque insuficiente no CLP." });
    }
    

    await axios.post("http://localhost:3000/api/clp/escrever-pedido", {
      produto: produtoIndex,
      quantidade
    });

    await axios.post("http://localhost:3000/api/clp/novo");

    return res.status(201).json({
      message: "Pedido registrado no CLP com sucesso!",
      tipo,
      quantidade,
      estoqueAntes: estoque[produtoIndex],
      estoqueApos: estoque[produtoIndex] - quantidade
    });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar pedido ao CLP: ' + err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const suco = await Suco.findById(req.params.id);
    if (!suco) return res.status(404).json({ error: 'Suco não encontrado' });
    res.status(200).json(suco);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar suco: ' + err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sucoAtualizado = await Suco.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sucoAtualizado) return res.status(404).json({ error: 'Suco não encontrado' });
    res.status(200).json(sucoAtualizado);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar suco: ' + err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sucoDeletado = await Suco.findByIdAndDelete(req.params.id);
    if (!sucoDeletado) return res.status(404).json({ error: 'Suco não encontrado' });
    res.status(200).json({ message: 'Suco deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar suco: ' + err.message });
  }
});

module.exports = router;
