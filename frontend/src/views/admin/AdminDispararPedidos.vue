<template>
  <div class="dashboard-view">
    <h1 class="greeting">Pedidos de Suco</h1>

    <!-- Estatísticas -->
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

    <!-- Tabela -->
    <section class="recent-orders">
      <h2>Sucos Disponíveis</h2>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="suco in sucoStore.sucos" :key="suco.tipo">
              <td>{{ suco.tipo }}</td>
              <td>R$ {{ suco.preco.toFixed(2) }}</td>
              <td>{{ suco.quantidade }}</td>

              <td>
                <span :class="['status-badge', suco.quantidade > 0 ? 'status-aprovado' : 'status-pendente']">
                  {{ suco.quantidade > 0 ? 'Disponível' : 'Esgotado' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Ações do CLP -->
    <section class="clp-grid">

      <button class="clp-btn novo" @click="novoPedidoCLP" :disabled="sucoStore.loading">
        {{  sucoStore.loading ? "Requisitando..." : "Novo Pedido"  }}
      </button>
      
      <button class="clp-btn iniciar" @click="iniciarPedidoCLP" :disabled="sucoStore.loading">
        {{ sucoStore.loading ? "Enviando..." : "Iniciar Pedido" }}
      </button>

      <button class="clp-btn abortar" @click="abortarPedidoCLP" :disabled="sucoStore.loading">
        {{ sucoStore.loading ? "Abortando..." : "Abortar Pedido" }}
      </button>

      <button class="clp-btn reset" @click="resetarCLP" :disabled="sucoStore.loading">
        {{ sucoStore.loading ? "Resetando..." : "Reset CLP" }}
      </button>

    </section>

    <!-- Mensagem -->
    <p class="mensagem" v-if="sucoStore.mensagem">
      {{ sucoStore.mensagem }}
    </p>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSucoStore } from '@/stores/produtos'
import StatCard from '@/components/admin/StatCard.vue'
import { Package, ShoppingCart, DollarSign } from 'lucide-vue-next'

const sucoStore = useSucoStore()

// Carregar sucos
onMounted(() => {
  sucoStore.carregarSucos()
})

// Estatísticas
const stats = computed(() => [
  {
    id: 1,
    title: 'Sucos Disponíveis',
    value: sucoStore.sucos.length,
    subtitle: 'Tipos cadastrados',
    icon: Package
  },
  {
    id: 2,
    title: 'Itens no Estoque',
    value: sucoStore.sucos.reduce((t, s) => t + s.quantidade, 0),
    subtitle: 'Volume total',
    icon: ShoppingCart
  },
  {
    id: 3,
    title: 'Pedidos Realizados',
    value: sucoStore.pedidoRealizado ? 1 : 0,
    subtitle: 'Aguardando CLP',
    icon: DollarSign
  }
])

// Ações CLP
async function iniciarPedidoCLP() {
  await sucoStore.inicioPedido()
}

async function abortarPedidoCLP() {
  await sucoStore.abortarPedido()
}

async function resetarCLP() {
  await sucoStore.resetCLP()
}

async function novoPedidoCLP() {
  await sucoStore.novoPedido()
}
</script>

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

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: #fcfaff;
}

/* Status */
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-aprovado {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-pendente {
  background-color: #fff8e1;
  color: #f57c00;
}

/* Botões CLP – estilo MES */
.clp-grid {
  margin-top: 3rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.clp-btn {
  padding: 14px 28px;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

.iniciar {
  background: #2563eb;
}
.iniciar:hover {
  background: #1e4fc4;
}

.novo {
  background: #388e3c;
}

.novo:hover {
  background: #388e4c;
}

.abortar {
  background: #dc2626;
}
.abortar:hover {
  background: #b91c1c;
}

.reset {
  background: #6b7280;
}
.reset:hover {
  background: #4b5563;
}

.clp-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensagem {
  margin-top: 1.5rem;
  font-weight: 600;
  text-align: center;
}
</style>
