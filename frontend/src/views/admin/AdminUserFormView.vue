<script setup>
import { ref, computed } from 'vue' // Importa 'computed' para o estado de carregamento
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario'

const store = useUsuarioStore()
const router = useRouter()

// Refs para o formulário
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('cliente') // Valor padrão

// Estado computado para verificar se a store está em processo de carregamento/salvamento
const isSaving = computed(() => store.isLoading) 

const handleSubmit = async () => {
  // Mapeia os dados do formulário para os nomes de campos esperados na Store (nome, tipo_usuario)
  const novoUsuario = {
    nome: name.value,
    email: email.value,
    password: password.value,
    tipo_usuario: role.value 
  }

  // 1. AVALIAÇÃO CRÍTICA: A função deve ser ASSÍNCRONA e AWAIT para esperar o backend
  const success = await store.register(novoUsuario)

  if (success) {
    // 2. Se o registro for bem-sucedido, navega
    console.log('Usuário registrado com sucesso, redirecionando.')
    router.push({ name: 'AdminUsuarios' })
  } else {
    // 3. Se falhar, exibe o erro e permanece na página
    console.error('Falha no registro do usuário. Mensagem da Store:', store.erro)
    // A mensagem de erro será exibida na UI através do v-if no template.
  }
}

const handleCancel = () => {
  // Limpa o erro da store ao sair, para evitar que a mensagem persista na próxima entrada
  store.erro = null
  router.push({ name: 'AdminUsuarios' })
}
</script>

<template>
  <div class="form-container">
    <h1>Adicionar Novo Usuário</h1>
    <p>Preencha os dados abaixo para cadastrar uma nova conta de usuário.</p>
    
    <!-- Exibição de Erro -->
    <div v-if="store.erro" class="error-message">
        Falha ao salvar usuário: {{ store.erro }}
    </div>

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
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="handleCancel" :disabled="isSaving">Cancelar</button>
        <button type="submit" class="btn-save" :disabled="isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar Usuário' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Estilos base */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--admin-white);
  padding: 2.5rem;
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
}
h1, p { margin-bottom: 1rem; }

/* Estilo para Erro */
.error-message {
    background-color: #ffe0e0;
    color: #cc0000;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
}

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
  transition: all 0.3s ease;
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
  border-top: 1px solid var(--admin-border);
  padding-top: 1.5rem;
}
.btn-save, .btn-cancel {
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.btn-save {
  background-color: var(--admin-primary);
  color: var(--admin-white);
}
.btn-save:hover:not(:disabled) {
  background-color: #7a1fb8;
}
.btn-cancel {
  background-color: #f1f3f5;
  color: var(--admin-text-light);
}
.btn-cancel:hover:not(:disabled) {
  background-color: #e9ecef;
}
.btn-save:disabled, .btn-cancel:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>