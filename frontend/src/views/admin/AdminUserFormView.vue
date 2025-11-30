<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuario'
const store = useUsuarioStore()
const router = useRouter()

// Refs para o formulário
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('cliente') // Valor padrão

const handleSubmit = () => {
  console.log('Salvando novo usuário:', {
    name: name.value,
    email: email.value,
    password: password.value, // (Em um app real, o backend faria o hash)
    role: role.value
  })
  store.register({
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value
  })

  router.push({ name: 'AdminUsuarios' })
}

const handleCancel = () => {
  router.push({ name: 'AdminUsuarios' })
}
</script>

<template>
  <div class="form-container">
    <h1>Adicionar Novo Usuário</h1>
    <p>Preencha os dados abaixo para cadastrar uma nova conta de usuário.</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input id="name" v-model="name" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label for="password">Senha Provisória</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      
      <div class="form-group">
        <label for="role">Perfil / Permissão</label>
        <select id="role" v-model="role">
          <option value="Cliente">Cliente</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="handleCancel">Cancelar</button>
        <button type="submit" class="btn-save">Salvar Usuário</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Estilos do formulário (copiados de AdminProductFormView) */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--admin-white);
  padding: 2.5rem;
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
}
h1, p { margin-bottom: 1rem; }
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label { font-weight: 600; }
input, select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  font-size: 1rem;
}
input:focus, select:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px #f0e6ff;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-save, .btn-cancel {
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}
.btn-save {
  background-color: var(--admin-primary);
  color: var(--admin-white);
}
.btn-cancel {
  background-color: #f1f3f5;
  color: var(--admin-text-light);
}
</style>