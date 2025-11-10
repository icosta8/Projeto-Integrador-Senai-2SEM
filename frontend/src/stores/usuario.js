import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    // Inicializa o estado a partir do localStorage, se disponível
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || null,
    tipo_usuario: localStorage.getItem('tipo_usuario') || null,
    autenticacao: localStorage.getItem('autenticacao') === 'true',
    erro: null
  }),

  getters: {
    // Verifica se o usuário está autenticado
    isCliente: (state) => state.tipo_usuario === 'Cliente',
    isOperador: (state) => state.tipo_usuario === 'Operador',
    isAdmin: (state) => state.tipo_usuario === 'Admin'
  },

  actions: {
    async login({ email, password }) {
      try {
        // faz a requisição de login
        const res = await axios.post('http://localhost:3000/api/usuarios/login', {
          email,
          password
        });

        const { usuario, token } = res.data;

        // salva no estado
        this.usuario = usuario;
        this.token = token;
        this.tipo_usuario = usuario.tipo_usuario || 'Cliente'; // padrão
        this.autenticacao = true;
        this.erro = null;

        // salva no localStorage
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('token', token);
        localStorage.setItem('tipo_usuario', this.tipo_usuario);
        localStorage.setItem('autenticacao', 'true');

        // define token para próximas requisições
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log('Login bem-sucedido:', usuario.nome);
      } catch (err) {
        this.erro = err.response?.data?.error || 'Erro ao fazer login';
        console.error('Erro ao fazer login:', this.erro);
      }
    },

    async logout() {
      this.usuario = null;
      this.token = null;
      this.tipo_usuario = null;
      this.autenticacao = false;
      this.erro = null;

      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('tipo_usuario');
      localStorage.removeItem('autenticacao');

      delete axios.defaults.headers.common['Authorization'];
      console.log('Logout realizado');
    }
  }
});