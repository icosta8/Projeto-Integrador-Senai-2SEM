const express = require('express');
require("dotenv").config();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MesRoutes = require('./router/mes');
const CadastroRoutes = require('./router/cadastro');
const SucoRoutes = require('./router/suco');
const UsuarioRoutes = require('./router/usuario');
const CLPRoutes = require('./router/clp');
const { connectDB } = require('./db');
const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(morgan('dev'));

app.use('/api/mes', MesRoutes);
app.use('/api/cadastro', CadastroRoutes);
app.use('/api/suco', SucoRoutes);
app.use('/api/usuario', UsuarioRoutes);
app.use('/api/clp', CLPRoutes);

connectDB(process.env.MONGO_URI).then(() =>{app.listen(PORTA, () => console.log(`API rodando em http://localhost:${PORTA}`));}).catch((err) =>{ console.error("Erro ao conectar no MongoDB: ", err); process.exit(1);});