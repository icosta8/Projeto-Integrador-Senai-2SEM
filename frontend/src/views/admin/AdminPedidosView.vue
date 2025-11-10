<script setup>
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

// Dados de exemplo (mais completos que os do dashboard)
const orders = ref([
  { id: 1, client: 'Thainara Marques', date: '07/10/2025 20:27', quantity: 5, total: 'R$ 150,00', status: 'Pendente' },
  { id: 2, client: 'Isaque Costa', date: '07/10/2025 18:45', quantity: 2, total: 'R$ 75,50', status: 'Aprovado' },
  { id: 3, client: 'Kauã Rodrigues', date: '07/10/2025 15:30', quantity: 8, total: 'R$ 210,00', status: 'Enviado' },
  { id: 4, client: 'Miguel de Freitas', date: '06/10/2025 22:10', quantity: 1, total: 'R$ 49,90', status: 'Entregue' },
  { id: 5, client: 'Gabriela Pereira', date: '06/10/2025 14:05', quantity: 3, total: 'R$ 98,00', status: 'Cancelado' },
])

const searchQuery = ref('')
</script>

<template>
  <div class="pedidos-view">
    <h1>Gerenciamento de Pedidos</h1>
    <p>Visualize e gerencie todos os pedidos da loja.</p>

    <div class="action-bar">
      <div class="search-wrapper">
        <Search :size="20" class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar por cliente ou ID do pedido..." 
        />
      </div>
      </div>

    <section class="pedidos-table">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Id Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status</th>
              <th>Valor Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.client }}</td>
              <td>{{ order.date }}</td>
              <td>
                <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">
                  {{ order.status }}
                </span>
              </td>
              <td class="total-value">{{ order.total }}</td>
              <td>
                <button class="action-btn details-btn">Ver Detalhes</button>
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

.total-value {
  font-weight: 600;
}

.action-btn {
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.details-btn {
  background-color: #f0e6ff;
  color: var(--admin-primary);
}
.details-btn:hover {
  background-color: var(--admin-primary);
  color: var(--admin-white);
}

/* Badges de Status (Copiei do Dashboard) */
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-pendente {
  background-color: #fff8e1;
  color: #f57c00;
}
.status-aprovado {
  background-color: #e8f5e9;
  color: #388e3c;
}
.status-enviado {
  background-color: #e3f2fd;
  color: #1976d2;
}
.status-entregue {
  background-color: #f3e5f5;
  color: #7b1fa2;
}
.status-cancelado {
  background-color: #ffebee;
  color: var(--admin-danger);
}
</style>