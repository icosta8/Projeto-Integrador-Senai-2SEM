const mongoose = require('mongoose');
const SucoSchema = new mongoose.Schema({
    tipo: {type: String, required: true},
    preco: {type: Number, required: true},
    status: {type: String},
    quantidade: {type: Number, required: true},
});
module.exports = mongoose.model('Suco', SucoSchema);