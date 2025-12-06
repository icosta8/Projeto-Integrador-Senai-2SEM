<template>
    <div class="container">
        <div class="form-section">
            <div class="form-wrapper">
                <h1>Crie sua Conta!</h1>
                <h2>Cadastro</h2>
                <form @submit.prevent="handleCadastro">
                    <div class="form-group">
                        <label for="nome">Nome Completo:</label>
                        <input type="text" id="nome" v-model="nome" required />
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            v-model="email"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="senha">Senha:</label>
                        <input
                            type="password"
                            id="senha"
                            v-model="password"
                            required
                        />
                    </div>
                    <button type="submit">Cadastrar</button>
                    <p class="login">
                        Já possui conta?
                        <RouterLink to="/login">Faça Login</RouterLink>
                    </p>
                </form>
            </div>
        </div>
        <div class="image-section">
            <img src="/src/assets/loginsucos.png" alt="Sucos" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUsuarioStore } from "../stores/usuario";

const nome = ref("");
const email = ref("");
const password = ref("");

const store = useUsuarioStore();
const router = useRouter();

async function handleCadastro() {
    try {
        const ok = await store.register({
            nome: nome.value,
            email: email.value,
            password: password.value,
            tipo_usuario: "cliente",
        });

        if (!ok) {
            alert("Erro ao realizar o cadastro");
            return;
        }
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
    } catch (err) {
        console.error("Erro no cadastro:", error);
        store.showAlert("Erro ao realizar cadastro.");
    }
}
</script>

<style scoped>
.container {
    display: flex;
    min-height: 100vh;
    font-family: "Montserrat", sans-serif;
}

.form-section {
    flex: 1;
    padding: 40px;
    background: linear-gradient(to bottom, #ffeded, #c7e4f3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.form-wrapper {
    width: 100%;
    max-width: 500px;
}

h1 {
    font-size: 32px;
    font-weight: 700;
    color: #ff8c1a;
    margin-bottom: 10px;
}

h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
}

form {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.form-group label {
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
}

input[type="email"],
input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 14px 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
    outline: none;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #ff8c1a;
    box-shadow: 0 0 0 3px rgba(255, 140, 26, 0.2);
}

button {
    width: 100%;
    padding: 14px;
    border: none;
    background-color: #ff8c1a;
    color: white;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 20px;
}

button:hover {
    background-color: #ff7b00;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(255, 123, 0, 0.3);
}

.login {
    text-align: center;
    font-size: 15px;
}

.login a {
    color: #ff8c1a;
    font-weight: bold;
    text-decoration: none;
}

.login a:hover {
    text-decoration: underline;
}

.image-section {
    flex: 1;
    background-color: #f5f5f5;
    display: flex;
}

.image-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (max-width: 800px) {
    .image-section {
        display: none;
    }
    .form-section {
        flex-basis: 100%;
    }
}
</style>
