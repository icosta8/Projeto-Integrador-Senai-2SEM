const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', authRoutes);

app.listen(4000, () => {
  console.log('🚀 Servidor rodando na porta 4000');
});
