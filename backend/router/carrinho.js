const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); 
let carrinho = {}; 
let recibos = {}; 

// Retorna o carrinho do usuário autenticado
router.get("/", auth, (req, res) => {
    try {
        const userId = req.usuario.sub;
        // Retorna o carrinho do usuário atual ou um array vazio
        return res.json(carrinho[userId] || []);
    } catch (err) {
        console.error("GET /carrinho error:", err.stack); 
        return res.status(500).json({ error: "Erro ao recuperar carrinho." });
    }
});

// Adiciona item ao carrinho do usuário autenticado
router.post("/adicionar", auth, (req, res) => {
    try {
        const userId = req.usuario.sub;
        let { produtoId, tipo, preco, quantidade } = req.body; // 'let' para reatribuir 'preco'

        // 1. Limpeza da string 'preco' (para tratar formatos com vírgula e R$)
        if (typeof preco === 'string') {
            // Remove R$, espaços e separadores de milhar (ponto)
            preco = preco.replace(/[^0-9,.]/g, '')
                         .replace(/\./g, '') // Remove pontos de milhar
                         .replace(/,/g, '.'); // Troca vírgula decimal por ponto decimal
        }

        // 2. Converte e Valida
        const numPreco = Number(preco);
        const numQuantidade = Number(quantidade);

        if (!produtoId || !tipo || isNaN(numPreco) || isNaN(numQuantidade) || numQuantidade <= 0) {
            console.error(`Validação falhou para preco: ${preco}, quantidade: ${quantidade}`);
            return res.status(400).json({ 
                error: "Campos 'preco' e 'quantidade' devem ser números válidos maiores que zero, e 'produtoId' e 'tipo' são obrigatórios." 
            });
        }

        if (!carrinho[userId]) carrinho[userId] = [];

        // 3. Verifica se item já existe
        const existente = carrinho[userId].find(i => i.produtoId === produtoId);

        if (existente) {
            // Soma a quantidade já convertida
            existente.quantidade += numQuantidade;
            existente.total = existente.preco * existente.quantidade;
        } else {
            // Adiciona novo item
            carrinho[userId].push({
                produtoId,
                tipo,
                preco: numPreco, 
                quantidade: numQuantidade, 
                total: numPreco * numQuantidade,
                image: null 
            });
        }

        // 4. Atualiza o recibo (última versão)
        recibos[userId] = {
            itens: [...carrinho[userId]], 
            total: carrinho[userId].reduce((s, i) => s + i.preco * i.quantidade, 0),
            data: new Date().toISOString()
        };

        return res.json({
            message: "Produto adicionado/atualizado com sucesso!",
            carrinho: carrinho[userId]
        });

    } catch (err) {
        console.error("POST /adicionar error:", err.stack); 
        return res
            .status(500)
            .json({ error: "Erro ao adicionar ao carrinho." });
    }
});

// Limpa o carrinho do usuário autenticado
router.post("/limpar", auth, (req, res) => {
    try {
        const userId = req.usuario.sub;
        carrinho[userId] = [];
        recibos[userId] = null;
        return res.json({ message: "Carrinho esvaziado!" });
    } catch (err) {
        console.error("POST /limpar error:", err.stack); 
        return res.status(500).json({ error: "Erro ao limpar carrinho." });
    }
});

// Retorna recibo do usuário autenticado (última versão)
router.get("/recibo", auth, (req, res) => {
    try {
        const userId = req.usuario.sub;
        const recibo = recibos[userId];
        if (!recibo) {
            return res.status(400).json({ error: "Nenhum recibo disponível." });
        }
        return res.status(200).json({ recibo });
    } catch (err) {
        console.error("GET /recibo error:", err.stack); 
        return res.status(500).json({ error: "Erro ao recuperar recibo." });
    }
});

module.exports = router;