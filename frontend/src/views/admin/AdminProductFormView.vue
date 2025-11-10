<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Usaremos o router para navegar de volta após salvar ou cancelar
const router = useRouter()

// Refs para cada campo do formulário (baseado no RF-24)
const name = ref('')
const description = ref('')
const price = ref(0)
const type = ref('') // "Tipo"
const stock = ref(0) // "Quantidade"
const imageUrl = ref('')

const handleSubmit = () => {
  // 1. AQUI VOCÊ ENVIARÁ OS DADOS PARA O BACKEND
  console.log('Salvando novo produto:', {
    name: name.value,
    description: description.value,
    price: price.value,
    type: type.value,
    stock: stock.value,
    imageUrl: imageUrl.value
  })

  // 2. Após salvar, redireciona de volta para a lista de produtos
  router.push({ name: 'AdminProducts' })
}

const handleCancel = () => {
  // Navega de volta para a lista de produtos
  router.push({ name: 'AdminProducts' })
}
</script>

<template>
  <div class="form-container">
    <h1>Adicionar Novo Produto</h1>
    <p>Preencha os dados abaixo para cadastrar um novo produto no catálogo.</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nome do Produto</label>
        <input id="name" v-model="name" type="text" placeholder="Ex: Suco de Laranja Integral" required />
      </div>

      <div class="form-group">
        <label for="description">Descrição</label>
        <textarea id="description" v-model="description" placeholder="Descreva o produto..."></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="price">Preço (R$)</label>
          <input id="price" v-model.number="price" type="number" step="0.01" min="0" required />
        </div>
        <div class="form-group">
          <label for="stock">Quantidade (Estoque)</label>
          <input id="stock" v-model.number="stock" type="number" min="0" required />
        </div>
      </div>
      
      <div class="form-group">
        <label for="type">Tipo / Categoria</label>
        <input id="type" v-model="type" type="text" placeholder="Ex: Suco, Polpa, Natural" />
      </div>

      <div class="form-group">
        <label for="imageUrl">URL da Imagem</label>
        <input id="imageUrl" v-model="imageUrl" type="url" placeholder="https://..." />
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="handleCancel">Cancelar</button>
        <button type="submit" class="btn-save">Salvar Produto</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--admin-white);
  padding: 2.5rem;
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
p {
  font-size: 1rem;
  color: var(--admin-text-light);
  margin-bottom: 2rem;
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

.form-group label {
  font-weight: 600;
  color: var(--admin-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px #f0e6ff;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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
.btn-save:hover {
  background-color: #7a1fb8; /* Um roxo mais escuro */
}

.btn-cancel {
  background-color: #f1f3f5;
  color: var(--admin-text-light);
}
.btn-cancel:hover {
  background-color: #e9ecef;
}
</style>