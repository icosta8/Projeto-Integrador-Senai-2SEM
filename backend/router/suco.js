const express = require('express');
const router = express.Router();
const Suco = require('../models/Suco');
const cache = require('../services/clp_cache');
const axios = require('axios');

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

router.get('/menu', async(req, res) =>{
  try{
    res.status(201).json(produto);
  }catch(err){
    res.status(500).json({ error: 'Erro ao buscar sucos: ' + err.message });
  }
})

router.post('/pedir-suco', async (req, res) => {
  try {
    const { tipo, preco, quantidade } = req.body;

    if (!tipo || !preco || !quantidade === undefined) {
      return res.status(400).json({ error: 'Parâmetros tipo, preco e quantidade são obrigatórios.' });
    }
    const falha = cache.valores[`"status"."falhaAtiva"`];
    const status = cache.valores[`"status"."geral"`];
    const estoque = cache.valores[`"status"."estoqueProd"`];

    if(falha === true){
      return res.status(400).json({ error: "Máquina em falha. Reinicie o sistema." });
    }
    if(status !== 0){
      return res.status(400).json({ error: "Máquina ocupada."});
    }
    if(!estoque){
      return res.status(400).json({ error: "Máquina sem estoque!" });
    }

    const prod = {"Laranja" : 0, "Limão": 1, "Morango" : 2};
    const prodIndex = prod[tipo];

    if(prodIndex === undefined){
      return res.status(400).json({ error: "Tipo inválido." });
    }
    if(estoque[prodIndex] < quantidade){
      return res.status(400).json({ error: "Estoque insuficiente no CLP." });
    }

    await axios.post("http://localhost:3000/api/clp/escrever-pedido", {
      produto: prodIndex,
      quantidade
    });

    await axios.post("http://localhost:3000/api/clp/novo");

    await axios.post("http://localhost:3000/api/clp/inicio");

    return res.status(201).json({
      message: "Pedido enviado com sucesso!",
      tipo,
      quantidade,
      estoqueAntes: estoque[prodIndex],
      estoqueApos: estoque[prodIndex] - quantidade
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar pedido ao CLP: ' + err.message });
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