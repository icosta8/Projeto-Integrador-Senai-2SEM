const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { z } = require("zod");
const permit = require("../middleware/permit");

let carrinho = {};
let recibos = {};

// Validações
const registroSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// Gera token incluindo role (se existir)
function signToken(usuario) {
    const secret = process.env.JWT_SECRET;
    
    // 🚨 VALIDAÇÃO CRÍTICA DO AMBIENTE
    if (!secret || secret === 'suaChaveSecretaMuitoLonga') {
        throw new Error("JWT_SECRET não está configurada ou é a chave padrão. Por favor, defina uma chave secreta no seu arquivo .env.");
    }

    return jwt.sign(
        {
            sub: usuario._id.toString(),
            email: usuario.email,
            nome: usuario.nome,
            role: usuario.role || "cliente",
        },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
}

router.post("/registro", async (req, res) => {
    try {
        const { nome, email, password } = registroSchema.parse(req.body);

        const exists = await Usuario.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: "Email já cadastrado!" });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        // Cria com role padrão 'cliente'
        const usuario = await Usuario.create({
            nome,
            email,
            passwordHash,
            role: "cliente",
        });

        const token = signToken(usuario);

        return res.status(201).json({
            message: "Usuário registrado com sucesso!",
            usuario: {
                id: usuario._id.toString(),
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            },
            token,
        });
    } catch (err) {
        if (err?.issues) {
            return res
                .status(400)
                .json({ error: "Dados inválidos", details: err.issues });
        }
        // 🚀 Alterado para imprimir o stack trace completo
        console.error("Registro error:", err.stack);
        // Retorna o erro 500 para o cliente, mas o console.error acima será mais detalhado
        return res.status(500).json({ error: "Erro ao registrar" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // 1. Busca o usuário
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario || !usuario.passwordHash) { 
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const ok = await bcrypt.compare(password, usuario.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const token = signToken(usuario);

        return res.json({
            message: "Login efetuado com sucesso!",
            usuario: {
                id: usuario._id.toString(),
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            },
            token,
        });
    } catch (err) {
        if (err?.issues) {
            return res
                .status(400)
                .json({ error: "Dados inválidos", details: err.issues });
        }
        // 🚀 Alterado para imprimir o stack trace completo
        console.error("Login error:", err.stack);
        // Retorna o erro 500 para o cliente, mas o console.error acima será mais detalhado
        return res.status(500).json({ error: "Erro no login" });
    }
});

// A partir daqui, o restante das rotas permanece o mesmo...

router.get("/me", auth, async (req, res) => {
    try {
        // req.usuario deve conter { sub, email, nome, role } conforme token
        return res.json({ usuario: req.usuario });
    } catch (err) {
        console.error("/me error:", err.stack); // 🚀 Alterado
        return res.status(500).json({ error: "Erro ao recuperar usuário" });
    }
});

router.post("/cadastrar-usuario", auth, permit("admin"), async (req, res) => {
    try {
        const { nome, email, password, role } = req.body;
        if (!nome || !email || !password) {
            return res
                .status(400)
                .json({ error: "Campos obrigatórios ausentes." });
        }

        const exists = await Usuario.findOne({ email });
        if (exists)
            return res.status(409).json({ error: "Email já cadastrado." });

        const passwordHash = await bcrypt.hash(password, 12);
        const novoUsuario = await Usuario.create({
            nome,
            email,
            passwordHash,
            role: role || "cliente",
        });

        res.status(201).json({
            message: "Usuário criado com sucesso.",
            usuario: {
                id: novoUsuario._id.toString(),
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                role: novoUsuario.role,
            },
        });
    } catch (err) {
        console.error("cadastrar-usuario error:", err.stack); // 🚀 Alterado
        res.status(400).json({ error: err.message });
    }
});

router.get("/usuarios-cadastrados", auth, permit("admin"), async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-passwordHash");
        res.status(200).json(
            usuarios.map((u) => ({
                id: u._id.toString(),
                nome: u.nome,
                email: u.email,
                role: u.role,
            }))
        );
    } catch (err) {
        console.error("usuarios-cadastrados error:", err.stack); // 🚀 Alterado
        res.status(500).json({ error: err.message });
    }
});

router.get("/procurar-usuario/:id", auth, permit("admin"), async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select(
            "-passwordHash"
        );
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }
        res.status(200).json({
            id: usuario._id.toString(),
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
        });
    } catch (err) {
        console.error("procurar-usuario error:", err.stack); // 🚀 Alterado
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const usuarioLogado = req.usuario; // { sub, email, nome, role }

        // permite se for admin ou se for o próprio usuário
        if (
            usuarioLogado.role !== "admin" &&
            usuarioLogado.sub !== req.params.id
        ) {
            return res
                .status(403)
                .json({ error: "Você não pode editar outro usuário." });
        }

        const { nome, email, password, role } = req.body;
        const dadosAtualizados = {};

        if (nome) dadosAtualizados.nome = nome;
        if (email) dadosAtualizados.email = email;

        // só admin pode alterar role
        if (role && usuarioLogado.role === "admin") {
            dadosAtualizados.role = role;
        }

        if (password) {
            dadosAtualizados.passwordHash = await bcrypt.hash(password, 12);
        }

        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            dadosAtualizados,
            { new: true }
        ).select("-passwordHash");
        if (!usuarioAtualizado) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        res.status(200).json({
            id: usuarioAtualizado._id.toString(),
            nome: usuarioAtualizado.nome,
            email: usuarioAtualizado.email,
            role: usuarioAtualizado.role,
        });
    } catch (err) {
        console.error("PUT /:id error:", err.stack); // 🚀 Alterado
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", auth, permit("admin"), async (req, res) => {
    try {
        const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioDeletado) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (err) {
        console.error("DELETE /:id error:", err.stack); // 🚀 Alterado
        res.status(500).json({ error: err.message });
    }
});

// Retorna o carrinho do usuário autenticado
router.get("/carrinho", auth, (req, res) => {
    try {
        const userId = req.usuario.sub;
        return res.json(carrinho[userId] || []);
    } catch (err) {
        console.error("GET /carrinho error:", err.stack); // 🚀 Alterado
        return res.status(500).json({ error: "Erro ao recuperar carrinho." });
    }
});

// Adiciona item ao carrinho do usuário autenticado
router.post("/adicionar", auth, async (req, res) => {
    try {
        const { produtoId, tipo, preco, quantidade } = req.body;
        const userId = req.usuario.sub;

        if (
            !produtoId ||
            !tipo ||
            preco === undefined ||
            quantidade === undefined
        ) {
            return res
                .status(400)
                .json({ error: "Campos obrigatórios ausentes." });
        }

        // inicializa carrinho do usuário se necessário
        if (!carrinho[userId]) carrinho[userId] = [];

        const item = {
            produtoId,
            tipo,
            preco: Number(preco),
            quantidade: Number(quantidade),
            total: Number(preco) * Number(quantidade),
        };
        carrinho[userId].push(item);

        // criar recibo simples (último item adicionado)
        recibos[userId] = {
            itens: [...carrinho[userId]],
            total: carrinho[userId].reduce((s, i) => s + i.total, 0),
            data: new Date().toISOString(),
        };

        return res.json({
            message: "Produto adicionado com sucesso!",
            carrinho: carrinho[userId],
        });
    } catch (err) {
        console.error("POST /adicionar error:", err.stack); // 🚀 Alterado
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
        console.error("GET /recibo error:", err.stack); // 🚀 Alterado
        return res.status(500).json({ error: "Erro ao recuperar recibo." });
    }
});

module.exports = router;