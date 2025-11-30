const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { z } = require('zod');
const permit = require('../middleware/permit');

const registroSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

function signToken(usuario) {
  return jwt.sign(
    { sub: usuario._id.toString(), email: usuario.email, nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

router.post('/registro', async (req, res) => {
  try {
    const { nome, email, password } = registroSchema.parse(req.body);
    const exists = await Usuario.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email já cadastrado!" });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const usuario = await Usuario.create({ nome, email, passwordHash });
    const token = signToken(usuario);
    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
      token
    });
  } catch (err) {
    if (err?.issues) {
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro ao registrar" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const ok = await bcrypt.compare(password, usuario.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = signToken(usuario);
    return res.json({
      message: "Login efetuado com sucesso!",
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
      token
    });
  } catch (err) {
    if (err?.issues) {
      return res.status(400).json({ error: "Dados inválidos", details: err.issues });
    }
    return res.status(500).json({ error: "Erro no login" });
  }
});

router.get('/me', auth, async (req, res) => {
  return res.json({ usuario: req.usuario });
});

router.post('/cadastrar-usuario', auth, permit('admin'), async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    if (!nome || !email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const novoUsuario = await Usuario.create({ nome, email, passwordHash });
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/usuarios-cadastrados',auth, permit('admin'), async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/procurar-usuario/:id', auth, permit('admin'), async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const usuarioLogado = req.usuario;
    
    if(usuarioLogado.role !== 'admin' && usuarioLogado.sub !== req.params.id){
      return res.status(403).json({ error: 'Você não pode editar outro usuário.'});
    }

    const { nome, email, password } = req.body;
    const dadosAtualizados = { nome, email };

    if (password) {
      dadosAtualizados.passwordHash = await bcrypt.hash(password, 12);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(req.params.id, dadosAtualizados, { new: true });
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    res.status(200).json(usuarioAtualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/carrinho', (req, res) => res.json(carrinho));

router.post('/adicionar', (req, res) => {
  const { produtoId, tipo, preco, quantidade } = req.body;

  if (!produtoId || !tipo || preco === undefined || quantidade === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const userId = req.usuario.sub;

  if(!carrinho[userId]){
    carrinho[userId] = [];
  } 

  const item = { produtoId, tipo, preco, quantidade, total: preco * quantidade };
  carrinho[userId].push(item);
  reciboPedido = { ...item, data: new Date().toLocaleString() };

  res.json({ message: "Produto adicionado com sucesso!", carrinho });
});

router.post('/limpar', (req, res) => {
  carrinho = {};
  reciboPedido = null;
  res.json({ message: "Carrinho esvaziado!" });
});

router.get('/recibo', (req, res) => {
  if (!reciboPedido) {
    return res.status(400).json({ error: 'Nenhum recibo disponível.' });
  }
  res.status(200).json({ recibo: reciboPedido });
});

module.exports = router;