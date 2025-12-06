<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, Plus, Edit, Trash2 } from 'lucide-vue-next'
import { useUsuarioStore } from '@/stores/usuario'
const store = useUsuarioStore()

const searchQuery = ref('')

onMounted(() => {
    // Carrega usuários ao montar o componente.
    // O reload após o registro é feito na própria ação 'register' da store.
    store.carregarUsuarios()
})

const usersFiltrados = computed(() => {
    // Garante que store.usuarios seja tratado como array. 
    const usuarios = store.usuarios || [] 
    
    return usuarios.filter(user => {
        // CORREÇÃO ESSENCIAL: Garante que os campos existem antes de usar toLowerCase()
        if (!user || !user.nome || !user.email) {
            // OBS: Mudei user.name para user.nome, pois é o padrão de cadastro que definimos.
            // Se o seu backend retorna 'name', ajuste para user.name aqui. Assumindo 'nome' por consistência.
            return false; 
        }

        const termo = searchQuery.value.toLowerCase()
        
        // A busca é realizada pelo nome ou e-mail
        return (
            user.nome.toLowerCase().includes(termo) ||
            user.email.toLowerCase().includes(termo)
        )
    })
})

// Função de exclusão de exemplo (implementação real deve estar na store)
const handleDelete = (userId, userName) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${userName} (#${userId})?`)) {
        // Lógica de exclusão aqui. Ex: store.deleteUser(userId)
        console.log(`Usuário ${userId} excluído (simulação).`)
    }
}
</script>

<template>
    <div class="usuarios-view">
        <div class="view-header">
            <h1>Gerenciamento de Utilizadores</h1>
            <RouterLink :to="{ name: 'AdminUserNew' }" class="add-btn">
                <Plus :size="18" /> Novo Utilizador
            </RouterLink>
        </div>
        <p>Adicione, edite ou remova contas de utilizadores.</p>

        <div v-if="store.erro" class="error-message">
            Erro ao carregar dados: {{ store.erro }}
        </div>

        <div class="action-bar">
            <div class="search-wrapper">
                <Search :size="20" class="search-icon" />
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Pesquisar por nome ou e-mail..." 
                />
            </div>
        </div>

        <section class="usuarios-table">
            <div class="table-wrapper">
                
                <!-- 1. Estado de Carregamento Explícito -->
                <div v-if="store.isLoading" class="loading-state empty-state">
                    <p>A carregar utilizadores...</p>
                </div>

                <!-- 2. Tabela visível apenas se houver utilizadores filtrados E não estiver carregando -->
                <table v-else-if="usersFiltrados.length > 0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Perfil</th>
                            <th>Data de Registo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- OBS: Usando user.nome, user.tipo_usuario e user.id (assumindo que o ID é uma string ou número) -->
                        <tr v-for="user in usersFiltrados" :key="user.id">
                            <td>#{{ user.id?.slice(0, 4) || 'N/A' }}</td>
                            <td>{{ user.nome || user.name }}</td> 
                            <td>{{ user.email }}</td>
                            <td>
                                <!-- Fallback para 'cliente' caso user.tipo_usuario seja null/undefined -->
                                <span :class="['role-badge', `role-${(user.tipo_usuario ?? 'cliente').toLowerCase()}`]">
                                    {{ user.tipo_usuario ?? 'Cliente' }}
                                </span>
                            </td>
                            <td>{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' }}</td>
                            <td class="actions-cell">
                                <button class="action-btn edit-btn">
                                    <Edit :size="16" /> Editar
                                </button>
                                <button class="action-btn delete-btn" @click="handleDelete(user.id, user.nome || user.name)">
                                    <Trash2 :size="16" /> Excluir
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- 3. Bloco de Estado Vazio / Sem Resultados (Após Carregamento) -->
                <div v-else class="empty-state">
                    <p v-if="searchQuery">
                        Nenhum utilizador encontrado para a pesquisa **"{{ searchQuery }}"**.
                    </p>
                    <p v-else-if="!store.isLoading && store.usuarios && store.usuarios.length === 0">
                        Nenhum utilizador registado. Clique em "Novo Utilizador" para começar.
                    </p>
                    <p v-else>
                         Aguardando dados...
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
.error-message {
    background-color: #ffe0e0;
    color: #cc0000;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 500;
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
    min-height: 200px; 
    position: relative;
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

/* Estado vazio */
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