<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, Plus, Edit, Trash2 } from 'lucide-vue-next'

// Dados de exemplo
const users = ref([
  { id: 1, name: 'Gabriela Pereira', email: 'gabriela@email.com', role: 'Admin', joined: '10/08/2025' },
  { id: 2, name: 'Thainara Marques', email: 'thainara@email.com', role: 'Cliente', joined: '07/10/2025' },
  { id: 3, name: 'Isaque Costa', email: 'isaque@email.com', role: 'Cliente', joined: '07/10/2025' },
  { id: 4, name: 'Kauã Rodrigues', email: 'kaua@email.com', role: 'Cliente', joined: '07/10/2025' },
])

const searchQuery = ref('')
</script>

<template>
  <div class="usuarios-view">
    <div class="view-header">
      <h1>Gerenciamento de Usuários</h1>
      <RouterLink :to="{ name: 'AdminUserNew' }" class="add-btn">
        <Plus :size="18" /> Novo Usuário
      </RouterLink>
    </div>
    <p>Adicione, edite ou remova contas de usuários.</p>

    <div class="action-bar">
      <div class="search-wrapper">
        <Search :size="20" class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar por nome ou e-mail..." 
        />
      </div>
    </div>

    <section class="usuarios-table">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>#{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['role-badge', `role-${user.role.toLowerCase()}`]">
                  {{ user.role }}
                </span>
              </td>
              <td>{{ user.joined }}</td>
              <td class="actions-cell">
                <button classclass="action-btn edit-btn">
                  <Edit :size="16" /> Editar
                </button>
                <button class="action-btn delete-btn">
                  <Trash2 :size="16" /> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

/* Cabeçalho com botão */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--admin-secondary);
  color: var(--admin-white);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
}

/* Barra de Ações */
.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
}
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--admin-text-light);
}
.search-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border-radius: 8px;
  border: 1px solid var(--admin-border);
  font-size: 1rem;
}
.search-wrapper input:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px #f0e6ff;
}

/* Tabela */
.table-wrapper {
  background: var(--admin-white);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
th, td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--admin-border);
}
th {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--admin-text-light);
  font-weight: 600;
}
td {
  color: var(--admin-text);
  font-size: 0.95rem;
}
tbody tr:last-child td {
  border-bottom: none;
}
tbody tr:hover {
  background-color: #fcfaff;
}

/* Badges de Perfil */
.role-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}
.role-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}
.role-cliente {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

/* Botões de Ação */
.actions-cell {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.edit-btn {
  background-color: #f0e6ff;
  color: var(--admin-primary);
}
.edit-btn:hover {
  background-color: var(--admin-primary);
  color: var(--admin-white);
}
.delete-btn {
  background-color: #ffeee6;
  color: var(--admin-danger);
}
.delete-btn:hover {
  background-color: var(--admin-danger);
  color: var(--admin-white);
}
</style>