const mongoose = require('mongoose');
const UsuarioSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    carrinho: [{
        produtoId: String,
        tipo: String,
        preco: Number,
        quantidade: Number
    }]
});
module.exports = mongoose.model('Usuario', UsuarioSchema);