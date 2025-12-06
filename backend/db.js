const mongoose = require('mongoose');

/**
 * Tenta estabelecer uma conexão com o MongoDB.
 * @param {string} uri - A URI de conexão do MongoDB (deve vir do process.env.MONGO_URI).
 * @returns {Promise<void>} Uma Promise que resolve quando a conexão é bem-sucedida.
 */
async function connectDB(uri) {
    if (!uri) {
        throw new Error("A URI do MongoDB (MONGO_URI) não está definida. Verifique seu arquivo .env.");
    }
    mongoose.set("strictQuery", true); 

    try {
        // mongoose.connect retorna uma Promise. 
        // A espera (await) garante que a função só continue após a conexão ser feita.
        await mongoose.connect(uri);
        console.log('Mongoose: Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Mongoose: Erro fatal na conexão:', error.message);
        // Lança o erro para ser capturado pelo .catch() no server.js
        throw error; 
    }
}

mongoose.connection.on('error', err => {
    console.error(`🚨 Mongoose: Erro na conexão: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose: Desconectado do banco de dados.');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Servidor encerrado. Conexão Mongoose fechada.');
    process.exit(0);
});


module.exports = { connectDB };