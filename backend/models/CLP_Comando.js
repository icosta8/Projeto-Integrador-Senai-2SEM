const mongoose = require('mongoose');
const ComandoSchema = new mongoose.Schema({
    ack : {type: Object, default: {} },
    pedido : {type: Object, default: {}},
    status : {type: Object, default: {}},
    cmd : {type: Object, default: {}},
    criadoEm : {type: Date, default: Date.now}
});
module.exports = mongoose.model("Comando", ComandoSchema);