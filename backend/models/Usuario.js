const mongoose = require('mongoose');
const UsuarioSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    role: {type: String, required: true},
    carrinho: [{
        produtoId: String,
        tipo: String,
        preco: Number,
        quantidade: Number,
        data: String
    }]
});
module.exports = mongoose.model('Usuario', UsuarioSchema);