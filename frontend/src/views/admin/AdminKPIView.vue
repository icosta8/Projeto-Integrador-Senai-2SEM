<script setup>
import { ref, onMounted, computed } from 'vue'
import { useChartStore } from '@/stores/kpi'

const chartStore = useChartStore()

// Mock
const adminName = ref('Administrador')
const isDashboardActive = ref(true)
const adminProfileIcon = '👤'

function desconectar() {
    alert('Função de Logout (Mock): O usuário seria desconectado e redirecionado para /login.')
}

// Conecta automaticamente ao MES
onMounted(() => {
 chartStore.iniciarAtualizacao(3000)
})

// Dados calculados no Pinia
const totalEstoque = computed(() => chartStore.totalEstoque)
const totalBoas = computed(() => chartStore.totalPecasBoas)
const totalRuins = computed(() => chartStore.totalPecasRuins)
const conectado = computed(() => chartStore.conectadoMES)

const eficiencia = computed(() => {
 const total = totalBoas.value + totalRuins.value
 return total === 0 ? '0%' : ((totalBoas.value / total) * 100).toFixed(1) + '%'
})

const historico = ref([
 { id: 1, horario: '20:15:02', msg: 'Dados atualizados com sucesso', status: 'OK' },
 { id: 2, horario: '20:12:01', msg: 'Dados atualizados', status: 'OK' },
 { id: 3, horario: '20:10:55', msg: 'MES demorou a responder', status: 'Aviso' }
])
</script>

<template>
  <div class="dashboard-view">

    <!-- CONTAINER CENTRAL -->
    <div class="main-content-container">

      <!-- STATUS -->
      <div class="status-banner" :class="conectado ? 'ok' : 'off'">
        <p>
          {{ conectado
            ? 'Sistema MES conectado e enviando dados.'
            : 'MES offline — tentando reconectar...' }}
        </p>
      </div>

      <!-- CARDS -->
      <div class="stats-grid">
        <div class="info-card">
          <div class="card-header">
            <span class="card-icon icon-estoque">📦</span>
            <p class="card-title">Produtos em Estoque</p>
          </div>
          <p class="card-value">{{ totalEstoque }}</p>
          <p class="card-sub">Atualização automática</p>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon icon-boas">✅</span>
            <p class="card-title">Peças Boas</p>
          </div>
          <p class="card-value">{{ totalBoas }}</p>
          <p class="card-sub">Produção OK</p>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon icon-ruins">❌</span>
            <p class="card-title">Peças Refugadas</p>
          </div>
          <p class="card-value">{{ totalRuins }}</p>
          <p class="card-sub">Erros detectados</p>
        </div>

        <div class="info-card">
          <div class="card-header">
            <span class="card-icon icon-eficiencia">📈</span>
            <p class="card-title">Eficiência</p>
          </div>
          <p class="card-value">{{ eficiencia }}</p>
          <p class="card-sub">Cálculo automático</p>
        </div>
      </div>

      <!-- HISTÓRICO -->
      <section class="recent-orders">
        <h2>Histórico de Ciclos</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Horário</th>
                <th>Mensagem</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historico" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.horario }}</td>
                <td>{{ item.msg }}</td>
                <td>
                  <span :class="['status-badge', item.status === 'OK' ? 'status-aprovado' : 'status-pendente']">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
:root {
  --admin-primary: #3b82f6;
  --admin-text: #ffffff; /* Força todo texto branco */
  --admin-radius: 12px;
}

/* FUNDO + CENTRALIZAÇÃO */
.dashboard-view {
  background: linear-gradient(180deg, #1e293b, #0f172a);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #ffffff !important; /* Força branco */
  font-family: Arial, sans-serif;
}

/* CONTAINER CENTRAL */
.main-content-container {
  max-width: 1200px;
  width: 100%;
  padding: 30px 40px;
  border-radius: 20px;
  background-color: rgba(30, 41, 59, 0.95);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  color: #ffffff !important; /* Força branco */
}

/* STATUS */
.status-banner {
  margin: 25px 0;
  padding: 14px;
  text-align: center;
  border-radius: 12px;
  font-weight: 600;
  color: #ffffff !important;
}
.status-banner.ok { background: #34d399; }
.status-banner.off { background: #f87171; }

/* CARDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 25px 0;
}

.info-card {
  background-color: #1e293b;
  padding: 25px;
  border-radius: 16px;
  border: 1px solid #334155;
  color: #ffffff !important;
}

.card-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.card-title, .card-value, .card-sub {
  color: #ffffff !important;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
}

.card-sub {
  font-size: 14px;
}

.card-icon {
  font-size: 24px;
  padding: 8px;
  border-radius: 8px;
  color: #ffffff !important;
}

.icon-estoque { background: #1d4ed8; }
.icon-boas { background: #166534; }
.icon-ruins { background: #b91c1c; }
.icon-eficiencia { background: #7c3aed; }

/* TABELA */
.table-wrapper {
  background: #1e293b;
  border-radius: 16px;
  overflow-x: auto;
  margin-top: 25px;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #ffffff !important;
}

th, td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #334155;
  color: #ffffff !important;
}

tbody tr:hover {
  background: #334155;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: #ffffff !important;
}

.status-aprovado { background: #065f46; }
.status-pendente { background: #9a3412; }

h2 {
  color: #ffffff !important;
  margin-bottom: 15px;
}

/* Força todo texto dentro do container principal */
.main-content-container, 
.main-content-container * {
  color: #ffffff !important;
}
</style>
