const express = require('express');
const router = express.Router();
const MES = require('../models/MES');
const cache = require('../services/clp_cache');
const { lerTags } = require('../services/server_opc_client');

router.post('/estoque', async (req, res) => {
    try {
        const estoque = cache.valores[`"status"."estoqueProd"`];
        if (!estoque) {
            return res.status(400).json({ error: 'Parâmetro estoqueProd é obrigatório.' });
        }
        const novoEstoque = await MES.create({ estoque });
        res.status(201).json(novoEstoque);
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
        const mesPCsBoas = cache.valores[`"status"."mesPCsBoas"`];
        if(mesPCsBoas === undefined) {
            return res.status(400).json({ error: 'Parâmetro mesPcsBoas é obrigatório.' });
        }
        const novoPecasBoas = await MES.create({ mesPCsBoas });
        res.status(201).json(novoPecasBoas);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/consultar-pecas-boas', async (req, res) => {
    try {
        const consultaPecasBoas = await MES.find({}, { mesPCsBoas: 1, _id: 0 });
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
        const mesPCsRuins = cache.valores[`"status"."mesPCsRuins"`];
        if(mesPCsRuins === undefined) {
            return res.status(400).json({ error: 'Parâmetro mesPcsRuins é obrigatório.' });
        }  
        const novoPecasRuins = await MES.create({ mesPCsRuins });
        res.status(201).json(novoPecasRuins);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/consultar-pecas-ruins', async (req, res) => {
    try {
        const consultaPecasRuins = await MES.find({}, { mesPCsRuins: 1, _id: 0 });
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
            status : tags.cache.valores[`"status"`],
            ack: tags.cache.valores[`"ack"`],
            pedido: tags.cahce.valores[`"pedido"`]
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao ler as tags do CLP" });
    }
});

module.exports = router;