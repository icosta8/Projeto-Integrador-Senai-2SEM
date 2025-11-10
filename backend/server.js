const express = require('express');
const mongoose = require('mongoose');
const MesRoutes = require('./router/mes');
const CadastroRoutes = require('./router/cadastro');
const SucoRoutes = require('./router/suco');
const UsuarioRoutes = require('./router/usuario');
const app = express();
const port = 3000;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/projetoIntegrador', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Conectado ao MongoDB")).catch(err => console.error("Erro so conectar:", err));
app.use('/api/mes', MesRoutes);
app.use('/api/cadastro', CadastroRoutes);
app.use('/api/suco', SucoRoutes);
app.use('/api/usuario', UsuarioRoutes);
app.listen(port, () =>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});