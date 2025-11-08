<template>
  <div class="container">
    <div class="form-section">
      <div class="form-wrapper">
        <h1>Seja Bem-Vindo!</h1>
        <h2>Login</h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">E-mail ou usuário:</label>
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

          <div class="remember">
            <input 
              type="checkbox" 
              id="idRemember" 
              v-model="rememberMe" 
            />
            <label for="idRemember">Lembrar minha senha</label>
          </div>

          <button type="submit">Entrar</button>

          <p class="register">
            Não possui conta? 
            <RouterLink to="/cadastro">Cadastre-se</RouterLink>
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
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

// Refs para os dados do formulário
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const router = useRouter()

// Função para lidar com o login
const handleLogin = () => {
  console.log('Login:', email.value, password.value, rememberMe.value)
  // Futuramente, você pode redirecionar para o admin aqui:
  // router.push({ name: 'AdminDashboard' })
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh; /* min-height é mais seguro que height */
  font-family: 'Montserrat', sans-serif; /* Fonte consistente */
}

.form-section {
  flex: 1; /* Corrigido de width: 50% */
  padding: 40px; /* Um pouco menos de padding */
  background: linear-gradient(to bottom, #ffeded, #c7e4f3);
  
  /* Alinha o wrapper do formulário no centro */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Wrapper para limitar a largura do formulário */
.form-wrapper {
  width: 100%;
  max-width: 500px; /* Limita a largura para melhor leitura */
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
  margin-bottom: 30px; /* Mais espaço */
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
input[type="password"] {
  width: 100%; /* Corrigido de 80% */
  padding: 14px 20px; /* Mais padding interno */
  border: 1px solid #ccc;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  box-sizing: border-box; /* Garante que o padding não quebre o layout */
  transition: all 0.3s ease;
}

/* Efeito de Foco */
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #ff8c1a;
  box-shadow: 0 0 0 3px rgba(255, 140, 26, 0.2);
}

.remember {
  display: flex;
  align-items: center;
  margin: 10px 0 20px 0;
  color: #555;
}

.remember label {
  margin-left: 8px;
  font-size: 14px;
}

button {
  width: 100%; /* Corrigido de 150px */
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
  margin-bottom: 20px; /* Espaço antes do link de registro */
}

button:hover {
  background-color: #ff7b00;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 123, 0, 0.3);
}

.register {
  text-align: center; /* Centralizado */
  font-size: 15px;
}

.register a {
  color: #ff8c1a;
  font-weight: bold;
  text-decoration: none;
}
.register a:hover {
  text-decoration: underline;
}

.image-section {
  flex: 1; /* Corrigido de width: 75% */
  background-color: #f5f5f5;
  display: flex; /* Para centralizar a imagem */
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Perfeito */
}

/* Responsividade simples para telas pequenas */
@media (max-width: 800px) {
  .image-section {
    display: none; /* Esconde a imagem em telas muito pequenas */
  }
  .form-section {
    flex-basis: 100%; /* Ocupa a tela inteira */
  }
}
</style>