const mongoose = require('mongoose');
const MesSchema = new mongoose.Schema({
    estoqueProd : {type: Object, default: {}},
    mesProd : {type: Object, default: {}},
    mesFalt : {type: Object, default: {}},
    mesUltimoCiclo : {type: Object, default: {}},
    mesTempInicio : {type: Date, default: Date.now},
    mesTempFim : {type : Date, default: Date.now},
    mesPcsBoas : {type: Object, default: {}},
    mesPcsRuins : {type: Object, default: {}}
});
module.exports = mongoose.model('MES', MesSchema);