const mongoose = require('mongoose');

const CarrinhoItemSchema = new mongoose.Schema({
    produtoId: { type: String, required: true },
    tipo: { type: String, required: true },
    preco: { type: Number, required: true },
    quantidade: { type: Number, required: true },
}, { _id: false }); 

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },  
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: 'cliente' },
    carrinho: [CarrinhoItemSchema]
});

module.exports = mongoose.model('Usuario', UsuarioSchema);