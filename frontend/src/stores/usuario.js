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
    isCliente: (state) => state.tipo_usuario === 'cliente',
    isOperador: (state) => state.tipo_usuario === 'Operador',
    isAdmin: (state) => state.tipo_usuario === 'admin',
    usurioLength: (state) => state.usuario ? state.usuario.nome.length : 0
  },

  actions: {
    async login({ email, password }) {
      try {
        // faz a requisição de login
        const res = await axios.post('http://localhost:3000/api/usuario/login', {
          email,
          password
        });

        const { usuario, token } = res.data;

        // salva no estado
        this.usuario = usuario;
        this.token = token;
        this.tipo_usuario = usuario.tipo_usuario || 'cliente'; // padrão
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
    },
    async register({ nome, email, password, tipo_usuario }) {
      try {
        // faz a requisição de registro
        const res = await axios.post('http://localhost:3000/api/usuario/registro', {
          nome,
          email,
          password,
          tipo_usuario
        });

        console.log('Registro bem-sucedido:', res.data);
        return res.data;
      } catch (err) {
        this.erro = err.response?.data?.error || 'Erro ao registrar usuário';
        console.error('Erro ao registrar usuário:', this.erro);
        return this.erro;
      }
    },
    async showAlert (message) {
      const result = await this.register(message);
      return confirm(result);
    },
    async carregarUsuario() {
      if (this.token) {
        try {
          const res = await axios.get('http://localhost:3000/api/usuario/usuarios-cadastrados');
          this.usuario = res.data;
          console.log('Usuário carregado:', this.usuario.nome);
        } catch (err) {
          this.erro = err.response?.data?.error || 'Erro ao carregar usuário';
          console.error('Erro ao carregar usuário:', this.erro);
        }
      }
    }
  }
});