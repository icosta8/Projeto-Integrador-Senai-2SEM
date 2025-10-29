const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    // Pega email e senha do corpo da requisição
    let { email, senha } = req.body;

    console.log('Recebido do frontend:', { email, senha }); // 🔹 log de depuração

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Normaliza os valores: remove espaços e transforma email em minúsculas
    email = email.trim().toLowerCase();
    senha = senha.trim();

    console.log('Valores normalizados:', { email, senha });

    // Busca usuário no MongoDB
    const user = await User.findOne({ email, senha });
    console.log('Usuário encontrado no MongoDB:', user); 

    if (!user) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    res.json({ message: 'Login bem-sucedido', user });

  } catch (error) {
    console.error('Erro no backend:', error);
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};
