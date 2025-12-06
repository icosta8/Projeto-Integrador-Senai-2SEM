const express = require('express');
require("dotenv").config();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Necessário para a semeadura do admin
const mongoose = require('mongoose'); // Necessário para a semeadura do admin

const MesRoutes = require('./router/mes');
const CadastroRoutes = require('./router/cadastro');
const SucoRoutes = require('./router/suco');
const UsuarioRoutes = require('./router/usuario');
const CLPRoutes = require('./router/clp');
const carrinhoRutes = require('./router/carrinho');

const { connectDB } = require('./db'); 

const Usuario = require("./models/Usuario"); 

const app = express();
const PORTA = process.env.PORTA || 3000;

// Função para semear um usuário administrador (cria um se não existir)
const seedAdminUser = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@exemplo.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        // Verifica se o modelo Usuario foi carregado corretamente
        if (!Usuario) {
             console.error("O modelo Usuario não está disponível para semeadura.");
             return;
        }

        const adminExists = await Usuario.findOne({ email: adminEmail });

        if (!adminExists) {
            const passwordHash = await bcrypt.hash(adminPassword, 12);
            await Usuario.create({
                nome: "Administrador",
                email: adminEmail,
                passwordHash: passwordHash,
                role: "admin",
            });
            console.log(`Usuário Admin semeadura com sucesso: ${adminEmail}`);
        } else {
            // Se existir, apenas garante que a role é 'admin'
            if (adminExists.role !== 'admin') {
                await Usuario.findByIdAndUpdate(adminExists._id, { role: 'admin' });
            }
            console.log(`Usuário Admin já existe: ${adminEmail}`);
        }
    } catch (err) {
        console.error("Erro ao semear o usuário admin: ", err);
        throw err; 
    }
};

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
app.use('/api/carrinho', carrinhoRutes);

connectDB(process.env.MONGO_URI)
    .then(() => seedAdminUser()) 
    .then(() => {
        app.listen(PORTA, () => console.log(`API rodando em http://localhost:${PORTA}`));
    })
    .catch((err) => { 
        console.error("Erro fatal ao conectar no MongoDB: ", err); 
        process.exit(1);
    });