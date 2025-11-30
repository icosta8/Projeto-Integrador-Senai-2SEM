const express = require('express');
const router = express.Router();
const {enviarComando} = require('../services/clp_comando');
const cache = require('../services/clp_cache');
const { escreverTag } = require('../services/server_opc_client');

router.post('/escrever-pedido', async(req, res) =>{
    const { produto, quantidade } = req.body;
    await escreverTag("pedido", "produto", produto);
    await escreverTag("pedido", "quant", quantidade);
    return res.json({ ok: true });
});

router.post('/novo', async(req, res) =>{
    await enviarComando("novoPed");
    res.json({ ok: true });
});

router.post("/inicio", async(req, res) =>{
    await enviarComando('inicio');
    res.json({ ok: true });
});

router.post('/pedir-suco', async(req, res) =>{
    try{
        await enviarComando('inicio');
        res.status(200).json({ message: 'Comando cmd.inicio enviado ao CLP!' });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/abortar', async(req, res) =>{
    try{
        await enviarComando('abortar');
        res.status(200).json({ message: 'Comando cmd.abortar enviado para ao CLP!'});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/reset', async(req, res) =>{
    try{
        await enviarComando('reset');
        res.status(200).json({ message: 'Comando cmd.reset enviado ao CLP!'});
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.get('/status-clp', async(req, res) =>{
    try{
        const status ={
            geral: cache.valores[`"status"."geral"`],
            accSinc: cache.valores[`"status"."accSinc"`],
            opAtual: cache.valores[`"status"."opAtual"`],
            estoqueProd: cache.valores[`"status"."estoqueProd"`],
            mesProd: cache.valores[`"status"."mesProd"`],
            mesFalt: cache.valores[`"status"."mesFalt"`],
            mesUltimoCiclo: cache.valores[`"status"."mesUltimoCiclo"`],
            mesTempInicio: cache.valores[`"status.mesTempInicio"`],
            mesTempFim: cache.valores[`"status"."mesTempFim"`],
            mesPCsBoas: cache.valores[`"status"."mesPCsBoas"`],
            mesPCsRuins: cache.valores[`"status"."mesPCsRuins"`]
        };
        res.json(status);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.get('/falhas', async(req, res) =>{
    try{
        const falhas = {
            falhaAtiva: cache.valores[`"status"."falhaAtiva"`],
            falhaAtivaCod: cache.valores[`"status"."falhaAtivaCod"`]
        };
        res.json(falhas);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;