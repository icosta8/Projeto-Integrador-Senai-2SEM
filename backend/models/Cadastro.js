const mongoose = require('mongoose');
const CadastroSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    endereco: {
        cep: {type: String, required: true},
        rua: {type: String, required: true},
        numero: {type: String, required: true},
        bairro: {type: String, required: true},
        complemento: {type: String},
        cidade: {type: String, required: true},
        estado: {type: String, required: true}
    }
});
module.exports = mongoose.model('Cadastro', CadastroSchema);