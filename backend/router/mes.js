const express = require('express');
const router = express.Router();
const MES = require('../models/MES');
const { lerTags } = require('../services/server_opc_client');

router.post('/estoque', async (req, res) => {
    try {
        const { estoqueProd } = req.body;
        if (!estoqueProd) {
            return res.status(400).json({ error: 'Parâmetro estoqueProd é obrigatório.' });
        }
        const estoque = await MES.create({ estoqueProd });
        res.status(201).json(estoque);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/consultar-estoque', async (req, res) => {
    try {
        const consultaEstoque = await MES.find();
        if(consultaEstoque.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro de estoque encontrado.' });
        }
        res.status(200).json(consultaEstoque);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/pecas-boas', async (req, res) => {
    try {
        const { mesPcsBoas } = req.body;
        if(mesPcsBoas === undefined) {
            return res.status(400).json({ error: 'Parâmetro mesPcsBoas é obrigatório.' });
        }
        const pecasBoas = await MES.create({ mesPcsBoas });
        res.status(201).json(pecasBoas);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/consultar-pecas-boas', async (req, res) => {
    try {
        const consultaPecasBoas = await MES.find({}, { mesPcsBoas: 1, _id: 0 });
        if(!consultaPecasBoas || consultaPecasBoas.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro de peças boas encontrado.' });
        }
        res.status(200).json(consultaPecasBoas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
});

router.post('/pecas-ruins', async (req, res) => {
    try {
        const { mesPcsRuins } = req.body;
        if(mesPcsRuins === undefined) {
            return res.status(400).json({ error: 'Parâmetro mesPcsRuins é obrigatório.' });
        }  
        const pecasRuins = await MES.create({ mesPcsRuins });
        res.status(201).json(pecasRuins);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/consultar-pecas-ruins', async (req, res) => {
    try {
        const consultaPecasRuins = await MES.find({}, { mesPcsRuins: 1, _id: 0 });
        if(!consultaPecasRuins || consultaPecasRuins.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro de peças ruins encontrado.' });
        }   
        res.status(200).json(consultaPecasRuins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/status-clp', async (req, res) => {
    try {
        const tags = await lerTags();
        res.status(200).json({
            stats : tags.DB_status,
            ack: tags.DB_ack,
            pedido: tags.DB_pedido
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao ler as tags do CLP" });
    }
});

module.exports = router;