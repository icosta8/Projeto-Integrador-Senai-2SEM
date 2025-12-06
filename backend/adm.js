const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario'); // Caminho para seu Schema Mongoose

// Configure suas variáveis de ambiente aqui
const MONGODB_URI = 'mongodb://localhost:27017/projetoIntegrador'; // Use process.env.MONGODB_URI no projeto real

// Credenciais padrão
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin'; 

async function seedAdminUser() {
    try {
        // Conexão com o Banco de Dados
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conexão com MongoDB estabelecida.');

        // 1. Verificar se o usuário admin já existe
        const adminExists = await Usuario.findOne({ email: ADMIN_EMAIL });

        if (adminExists) {
            console.log('🔄 Usuário admin já existe. Nenhuma ação necessária.');
            // Se o admin existir, você pode verificar se a role está correta
            if (adminExists.role !== 'admin') {
                adminExists.role = 'admin';
                await adminExists.save();
                console.log('🛠️ Role do admin corrigida para "admin".');
            }
            return;
        }

        // 2. Hash da senha
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        
        // 3. Criar o usuário admin
        const adminUser = await Usuario.create({
            nome: 'Administrador Padrão',
            email: ADMIN_EMAIL,
            passwordHash: passwordHash,
            role: 'admin', // Definir a role como 'admin'
        });

        console.log(`Usuário admin criado com sucesso! Email: ${ADMIN_EMAIL}`);

    } catch (error) {
        console.error('Erro durante o seeding do admin:', error);
    } finally {
        // Fechar a conexão
        await mongoose.connection.close();
    }
}

module.exports = {seedAdminUser};