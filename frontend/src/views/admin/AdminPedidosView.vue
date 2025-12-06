<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
// Importa a store de Carrinho com o novo nome
import { useCarrinhoStore } from '@/stores/carrinho' 

// Usa a store de Carrinho
const store = useCarrinhoStore() 
const searchQuery = ref('')

// Não precisamos de onMounted para carregar, pois os dados são carregados do localStorage na inicialização da store.

const pedidosFiltrados = computed(() => {
    // A fonte de dados agora é o histórico de recibos (compras finalizadas)
    const recibos = store.historicoRecibos || [] 
    
    const termo = searchQuery.value.toLowerCase()

    return recibos
        // 1. Mapeia os dados do recibo para o formato da tabela de pedidos
        .map(recibo => ({
            // Usamos os últimos 6 caracteres do ID como uma representação curta
            id: recibo.id.substring(recibo.id.length - 6).toUpperCase(), 
            clienteNome: 'Cliente Local (Recibo)', // Mock: Nome do cliente não está no recibo local
            dataPedido: recibo.data,
            // Mock: Status fixo, pois é uma compra finalizada
            status: 'Entregue', 
            valorTotal: recibo.total, // O total já é um número
            originalRecibo: recibo // Mantém o objeto original (útil para "Ver Detalhes")
        }))
        // 2. Aplica o filtro de busca
        .filter(pedido => {
            const clienteNome = pedido.clienteNome.toLowerCase()
            const pedidoId = String(pedido.id)

            // A busca é realizada pelo nome (mockado) ou ID do pedido (parte final)
            return (
                clienteNome.includes(termo) ||
                pedidoId.includes(termo)
            )
        })
})

// Função auxiliar para formatar a data
const formatarData = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        // O recebido do localStorage/store é ISO, então formatamos
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (e) {
        return dateString
    }
}
</script>

<template>
    <div class="pedidos-view">
        <h1>Gerenciamento de Pedidos</h1>
        <p>Visualize e gerencie todos os recibos de compras finalizadas (dados locais).</p>

        <div class="action-bar">
            <div class="search-wrapper">
                <Search :size="20" class="search-icon" />
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Buscar por ID do recibo ou cliente (mock)..." 
                />
            </div>
        </div>

        <section class="pedidos-table">
            <div class="table-wrapper">
                
                <!-- Estado de Carregamento removido, pois o acesso ao localStorage é instantâneo -->

                <!-- Tabela de Pedidos -->
                <table v-if="pedidosFiltrados.length > 0">
                    <thead>
                        <tr>
                            <th>Id Recibo</th>
                            <th>Cliente</th>
                            <th>Data/Hora</th>
                            <th>Status (Mock)</th>
                            <th>Valor Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Iteração sobre os recibos mapeados e filtrados -->
                        <tr v-for="order in pedidosFiltrados" :key="order.id">
                            <td>#{{ order.id }}</td>
                            <td>{{ order.clienteNome }}</td>
                            <td>{{ formatarData(order.dataPedido) }}</td>
                            <td>
                                <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">
                                    {{ order.status }}
                                </span>
                            </td>
                            <!-- Formata o valor total (que é um número) para BRL -->
                            <td class="total-value">R$ {{ order.valorTotal?.toFixed(2).replace('.', ',') || '0,00' }}</td>
                            <td>
                                <button class="action-btn details-btn">Ver Detalhes</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Estado Vazio -->
                <div v-else class="empty-state">
                    <p v-if="searchQuery">
                        Nenhum recibo encontrado para a pesquisa **"{{ searchQuery }}"**.
                    </p>
                    <p v-else-if="store.historicoRecibos.length === 0">
                        Nenhum recibo de compra registrado localmente.
                    </p>
                    <p v-else>
                        Nenhum dado a ser exibido.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Estilos existentes */
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
    min-height: 200px; /* Garante altura para o empty state */
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

/* Badges de Status */
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
/* Use 'Entregue' para os recibos locais */
.status-entregue {
    background-color: #f3e5f5;
    color: #7b1fa2;
}
.status-cancelado {
    background-color: #ffebee;
    color: var(--admin-danger);
}

/* Estado Vazio */
.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--admin-text-light);
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px; 
}
.empty-state p {
    margin: 0;
    line-height: 1.5;
}
</style>