import { defineStore } from "pinia";
import axios from "axios";

export const useUsuarioStore = defineStore("usuario", {
    state: () => ({
        usuario: JSON.parse(localStorage.getItem("usuario")) || null,
        usuarios: [],
        token: localStorage.getItem("token") || null,
        tipo_usuario: (
            localStorage.getItem("tipo_usuario") || ""
        ).toLowerCase(),
        autenticacao: localStorage.getItem("autenticacao") === "true",
        erro: null,
        isLoading: false, // <-- Novo estado para feedback de carregamento
    }),

    getters: {
        isCliente: (state) => state.tipo_usuario === "cliente",
        isOperador: (state) => state.tipo_usuario === "operador",
        isAdmin: (state) => state.tipo_usuario === "admin",

        usuarioLength: (state) =>
            state.usuario ? state.usuario.nome.length : 0,
        totalUsuarios: (state) => state.usuarios?.length || 0,
    },

    actions: {
        // REMOVIDA: A ação showAlert foi removida porque 'window.confirm()' é bloqueado.
        
        async login({ email, password }) {
            this.erro = null; // Limpa erros anteriores
            try {
                const res = await axios.post(
                    "http://localhost:3000/api/usuario/login",
                    {
                        email,
                        password,
                    }
                );

                const { usuario, token } = res.data;

                this.usuario = usuario;
                this.token = token;
                this.tipo_usuario = (
                    usuario.tipo_usuario ||
                    usuario.role ||
                    "cliente"
                ).toLowerCase();
                this.autenticacao = true;
                this.erro = null;

                // Salvar no localStorage (Mantenho o localStorage, mas o Firestore seria melhor para produção)
                localStorage.setItem("usuario", JSON.stringify(usuario));
                localStorage.setItem("token", token);
                localStorage.setItem("tipo_usuario", this.tipo_usuario);
                localStorage.setItem("autenticacao", "true");

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                console.log("Login bem-sucedido:", usuario.nome);

                return true;
            } catch (err) {
                this.erro = err.response?.data?.error || "Erro ao fazer login (Verifique a API)";
                console.error("Erro ao fazer login:", this.erro);
                return false;
            }
        },

        async logout() {
            this.usuario = null;
            this.token = null;
            this.tipo_usuario = null;
            this.autenticacao = false;
            this.erro = null;

            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            localStorage.removeItem("tipo_usuario");
            localStorage.removeItem("autenticacao");

            delete axios.defaults.headers.common["Authorization"];
            console.log("Logout realizado");
        },

        async register({ nome, email, password, tipo_usuario }) {
            this.erro = null; // Limpa erros anteriores
            this.isLoading = true; // Inicia o carregamento
            try {
                const res = await axios.post(
                    "http://localhost:3000/api/usuario/registro",
                    {
                        nome,
                        email,
                        password,
                        tipo_usuario: tipo_usuario.toLowerCase(),
                    }
                );

                console.log("Registro bem-sucedido:", res.data);
                // Chama carregarUsuarios para atualizar a lista automaticamente
                await this.carregarUsuarios(); 
                return true;
            } catch (err) {
                this.erro =
                    err.response?.data?.error || "Erro ao registrar usuário (Verifique a API)";
                console.error("Erro ao registrar usuário:", this.erro);
                return false;
            } finally {
                this.isLoading = false; // Finaliza o carregamento
            }
        },

        async admin({ email, password }) {
            this.erro = null; // Limpa erros anteriores
            try {
                const res = await axios.post(
                    "http://localhost:3000/api/usuario/admin",
                    {
                        email,
                        password,
                    }
                );

                const { usuario, token } = res.data;

                this.usuario = usuario;
                this.token = token;
                this.tipo_usuario = (usuario.role || "admin").toLowerCase();
                this.autenticacao = true;
                this.erro = null;

                localStorage.setItem("usuario", JSON.stringify(usuario));
                localStorage.setItem("token", token);
                localStorage.setItem("tipo_usuario", this.tipo_usuario);
                localStorage.setItem("autenticacao", "true");

                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                console.log("Admin logado:", usuario.nome);

                return true;
            } catch (err) {
                this.erro = err.response?.data?.error || "Erro ao fazer login Admin (Verifique a API)";
                console.error("Erro ao fazer login Admin:", this.erro);
                return false;
            }
        },

        async carregarUsuarios() {
            this.erro = null; // Limpa erros anteriores
            this.isLoading = true; // Inicia o carregamento
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/usuario/usuarios-cadastrados"
                );
                this.usuarios = res.data;
                console.log("Usuários carregados:", this.usuarios.length);
                return true;
            } catch (err) {
                this.erro =
                    err.response?.data?.error || "Erro ao carregar usuários (Verifique a API)";
                console.error("Erro ao carregar usuários:", this.erro);
                return false;
            } finally {
                this.isLoading = false; // Finaliza o carregamento
            }
        },
    },
});

// Carrega token no axios ao iniciar o app
if (localStorage.getItem("token")) {
    axios.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${localStorage.getItem("token")}`;
}