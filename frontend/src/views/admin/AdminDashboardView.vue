<script setup>
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/admin/StatCard.vue'
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-vue-next'
import { useUsuarioStore } from '@/stores/usuario'

const usuarioStore = useUsuarioStore()

// Nome do admin
const adminName = ref('Administrador')
onMounted(() => {
  adminName.value = usuarioStore.usuario?.nome || 'Administrador'
})

// Número de usuários cadastrados (reativo)
const usuariosCadastrados = computed(() => usuarioStore.usuarios.length)

// Estatísticas
const stats = computed(() => [
  { id: 1, title: 'Pedidos pendentes', value: 15, subtitle: 'Na última semana', icon: Package },
  { id: 2, title: 'Usuários novos', value: usuariosCadastrados.value, subtitle: 'Na última semana', icon: Users },
  { id: 3, title: 'Compras realizadas', value: 46, subtitle: 'Na última semana', icon: ShoppingCart },
  { id: 4, title: 'Lucro', value: 'R$ 8.563,56', subtitle: 'Lucro total', icon: DollarSign }
])

// Pedidos recentes
const recentOrders = ref([
  { id: 1, client: 'Thainara Marques', date: '07/10/2025 20:27:58', quantity: 5, total: 'R$ 150,00', status: 'Pendente' },
  { id: 2, client: 'Isaque Costa', date: '07/10/2025 18:45:12', quantity: 2, total: 'R$ 75,50', status: 'Aprovado' },
  { id: 3, client: 'Kauã Rodrigues', date: '07/10/2025 15:30:02', quantity: 8, total: 'R$ 210,00', status: 'Enviado' },
  { id: 4, client: 'Miguel de Freitas', date: '06/10/2025 22:10:47', quantity: 1, total: 'R$ 49,90', status: 'Entregue' }
])
</script>


<template>
  <div class="dashboard-view">
    <h1 class="greeting">Olá {{ adminName }}!</h1>

    <section class="stats-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.id"
        :title="stat.title"
        :value="stat.value"
        :subtitle="stat.subtitle"
      >
        <component :is="stat.icon" :size="24" />
      </StatCard>
    </section>

    <section class="recent-orders">
      <h2>Pedidos Recentes</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Id Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Quantidade</th>
              <th>Status</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.client }}</td>
              <td>{{ order.date }}</td>
              <td>{{ order.quantity }} itens</td>
              <td>
                <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">
                  {{ order.status }}
                </span>
              </td>
              <td class="total-value">{{ order.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.greeting {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.recent-orders h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.table-wrapper {
  background: var(--admin-white);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  overflow-x: auto; /* Para responsividade em tabelas */
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
  color: var(--admin-text);
}

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
</style>