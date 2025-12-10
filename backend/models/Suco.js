const mongoose = require('mongoose');
const SucoSchema = new mongoose.Schema({
    produto: {type: String, required: true},
    preco: {type: Number},
    status: {type: String},
    quantidade: {type: Number, required: true},
});

module.exports = mongoose.model('Suco', SucoSchema);