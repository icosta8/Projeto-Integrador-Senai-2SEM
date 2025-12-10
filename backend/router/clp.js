const express = require('express');
const router = express.Router();
const { enviarComando } = require('../services/clp_comando');
const cache = require('../services/clp_cache');
const { escreverTag, lerTags } = require('../services/server_opc_client');
const Suco = require('../models/Suco')
let geradorOp = 0;
router.post('/escrever-pedido', async (req, res) => {
    try {
        function gerarOp(){
            geradorOp++;
            return geradorOp
        }
 
        const { produto, quantidade } = req.body;
        const op = gerarOp();
 
        const clpBanco = await Suco.create({ produto, quantidade, op});
 
        if (quantidade == null) {
            return res.status(400).json({ error: "Produto e quantidade são obrigatórios." });
        }

        if(quantidade > 3){
            return res.status(400).json({ error: "Quantidade máxima de produtos atingida!"})
        }
 
        await escreverTag("pedido", "produto", produto);
        await escreverTag("pedido", "quant", quantidade);
        await escreverTag("pedido", "op", op)
 
        console.log(`Pedido escrito no CLP => Produto: ${produto} | Quant: ${quantidade}`);
 
        return res.json({ ok: true, message: "Pedido gravado no CLP.", clpBanco});
    } catch (err) {
        console.error("Erro ao escrever pedido:", err.message);
        res.status(500).json({ error: err.message });
    }
});
 
router.post('/novo', async (req, res) => {
    try {
        await enviarComando("novoPed");
        res.json({ ok: true, message: "Comando cmd.novoPed enviado." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/buscar', async(req, res) =>{
    try{
        const suco = Suco.find();
        res.status(200).json(suco)
    }catch(err){
        res.status(500).json({ error: 'Erro ao buscar sucos!', err})
    }
})
 
router.post("/inicio", async (req, res) => {
    try {
        await enviarComando('inicio');
        res.json({ ok: true, message: "Comando cmd.inicio enviado ao CLP." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
router.post('/pedir-suco', async (req, res) => {
    try {
        const { itens } = req.body;
       
        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return res.status(400).json({ error: "Nenhum item enviado no pedido." });
        }
 
        console.log("Pedido recebido no backend:", itens);
 
        res.status(200).json({ message: 'Pedido recebido e validado no backend.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
router.post('/abortar', async (req, res) => {
    try {
        await enviarComando('abortar');
        res.status(200).json({ message: 'Comando cmd.abortar enviado ao CLP!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
router.post('/reset', async (req, res) => {
    try {
        await enviarComando('reset');
        res.status(200).json({ message: 'Comando cmd.reset enviado ao CLP!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
router.get("/status-clp", async (req, res) => {
  try {
    const dados = await lerTags();  
    res.json(dados);                
  } catch (err) {
    res.status(500).json({ erro: "Falha ao ler CLP", detalhes: err.message });
  }
});
 
router.get('/falhas', async (req, res) => {
    try {
        const falhas = await lerTags();
        res.json(falhas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
 
module.exports = router;
 