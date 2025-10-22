<template>
  <div class="container">
    <div class="form-section">
      <h1>Seja Bem-Vindo!</h1>
      <h2>Login</h2>

      <form>
        <label for="email">E-mail ou usuário:</label>
        <input type="email" id="email" name="email" required/>

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required/>

        <div class="remember">
          <input type="checkbox" id="idRemember" name="remember"/>
          <label for="idRemember">Lembrar minha senha</label>
        </div>

        <button type="submit">Entrar</button>

        <p class="register">
          Não possui conta? <a href="#">Cadastre-se</a>
        </p>
      </form>
    </div>

    <div class="image-section">
      <img src="/src/assets/loginsucos.png" alt="Imagem teste" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.form-section {
  width: 50%;
  padding: 60px;
  background: linear-gradient(to bottom, #ffeded, #c7e4f3);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  font-size: 32px;
  color: #ff8c1a;
  margin-bottom: 10px;
  text-align: left;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

form {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
}

input[type="email"],
input[type="password"] {
  display: block;      
  width: 80%;           
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  text-align: left;
  margin-bottom: 15px;
}

.remember {
  display: flex;
  align-items: center;
  margin: 15px 0;
}

.remember label {
  margin-left: 8px;
}

button {
  width: 150px;
  padding: 12px;
  border: none;
  background-color: #ff8c1a;
  color: white;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: 0.3s;
  align-self:center
}

button:hover {
  background-color: #ff7b00;
}

.register {
  margin-top: 20px;
  text-align: left;
}

.register a {
  color: #ff8c1a;
  font-weight: bold;
  text-decoration: none;
}

.image-section {
  width: 75%;
  background-color: #f5f5f5;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>