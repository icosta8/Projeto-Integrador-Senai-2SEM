<template>
  <div class="carrinho-container">
    <div class="carrinho-card">
      <h1>Seu Carrinho</h1>
      
      <!-- Botão para alternar a visibilidade do histórico -->
      <div v-if="historicoRecibos.length > 0" class="header-actions">
          <button @click="mostrarHistorico = !mostrarHistorico" class="history-toggle-btn">
              {{ mostrarHistorico ? 'Esconder' : 'Ver' }} Histórico de Pedidos ({{ historicoRecibos.length }})
          </button>
      </div>

      <!-- Mensagem de Feedback -->
      <div v-if="mensagemFeedback" :class="['feedback-message', { 'success': !itens.length }]" >
        {{ mensagemFeedback }}
      </div>
      
      <!-- NOVO: Bloco de conteúdo do Carrinho que fica oculto se o histórico estiver visível -->
      <template v-if="!mostrarHistorico">
        <p v-if="itens.length === 0" class="empty-message">
          Seu carrinho está vazio.
        </p>

        <div v-else class="cart-items">

          <div
            class="cart-item"
            v-for="item in itens"
            :key="item.produtoId"
          >
            <img 
              :src="item.image || 'https://placehold.co/70x70/2c3e50/ffffff?text=Juice'" 
              :alt="item.nome" 
              class="item-img" 
            />

            <div class="item-info">
              <h3>{{ item.nome }}</h3>
              <p class="price">
                R$ {{ isNaN(item.preco) ? '0.00' : item.preco.toFixed(2) }}
              </p>

              <div class="quantity">
                <button @click="diminuir(item)" class="qty-btn">−</button>
                <span>{{ item.quantidade }}</span>
                <button @click="aumentar(item)" class="qty-btn">+</button>
              </div>
            </div>

            <button @click="remover(item)" class="remove-btn">🗑</button>
          </div>

          <div class="cart-total">
            <h2>Total: R$ {{ total.toFixed(2) }}</h2>
          </div>

          <div class="finalizar-section">
            <button @click="limpar" class="clear-btn">Limpar</button>
            <button @click="finalizar" class="checkout-btn">Finalizar Pedido</button>
          </div>

        </div>
      </template>

    </div>

    <!-- Seção de Histórico de Recibos -->
    <div v-if="historicoRecibos.length > 0 && mostrarHistorico" class="carrinho-card mt-8">
      <h2>Histórico de Pedidos</h2>
      <div v-for="recibo in historicoRecibos" :key="recibo.id" class="recibo-item">
        <div class="recibo-header">
          <span>Recibo #{{ recibo.id }}</span>
          <span class="recibo-total">R$ {{ recibo.total.toFixed(2) }}</span>
        </div>
        <small>{{ new Date(recibo.data).toLocaleDateString() }} - {{ recibo.itens.length }} itens</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCarrinhoStore } from '../stores/carrinho'
import { useSucoStore } from '../stores/produtos'

const store = useCarrinhoStore()
const sucoStore = useSucoStore()

const itens = computed(() => store.itens)
const total = computed(() => store.total)
const historicoRecibos = computed(() => store.historicoRecibos) // Importa o histórico

const mensagemFeedback = ref(null) // Estado para mensagens de sucesso/erro
const mostrarHistorico = ref(false) // Estado para controlar a visibilidade do histórico

onMounted(() => {
  // Carrega o carrinho do servidor após a montagem
  store.carregarCarrinhoServidor()
})

function remover(item) {
  // Remove o item usando o produtoId
  store.remover(item.produtoId)
}

function aumentar(item) {
  // Atualiza a quantidade somando 1
  store.atualizar(item.produtoId, item.quantidade + 1)
}

function diminuir(item) {
  // Atualiza a quantidade subtraindo 1, mas impede que seja menor que 1
  if (item.quantidade > 1) {
    store.atualizar(item.produtoId, item.quantidade - 1)
  }
}

function limpar() {
  // Limpa o carrinho local e no servidor
  store.limpar()
}

async function finalizar() {
  // Chama a action que gera o recibo e limpa o carrinho
  const recibo = await store.finalizarCompra();

  if (recibo) {
    mensagemFeedback.value = `Pedido #${recibo.id} finalizado com sucesso!`;
  } else if (itens.value.length === 0) {
    mensagemFeedback.value = "O carrinho está vazio. Adicione itens para finalizar a compra.";
  } else {
    mensagemFeedback.value = "Erro ao finalizar pedido. Tente novamente.";
  }
  
  // Limpa o feedback após 4 segundos
  setTimeout(() => {
    mensagemFeedback.value = null;
  }, 4000);
}
</script>

<style scoped>
/* Os estilos existentes foram mantidos, com adição de estilos para Feedback e Recibos */
.carrinho-container {
  display: flex;
  flex-direction: column; /* Permite que o histórico fique abaixo */
  align-items: center;
  padding: 40px 20px;
  width: 100%;
  margin-top: 4%;
};

.carrinho-card {
  background: #ffffff;
  width: 100%;
  max-width: 700px;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  animation: fadeIn .3s ease;
};

/* Estilo para a nova seção de Histórico */
.mt-8 {
  margin-top: 32px;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 25px;
}

/* Novo: Estilo para o contêiner de ações do cabeçalho e o botão */
.header-actions {
    text-align: center;
    margin-bottom: 15px;
}

.history-toggle-btn {
    background: #3498db;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
    /* Alinha o botão com o layout do card */
    display: inline-block; 
}
.history-toggle-btn:hover {
    background: #2980b9;
}

/* Estilo da Mensagem de Feedback (Substituto do Alert) */
.feedback-message {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  background-color: #f9e79f; /* Amarelo padrão para alerta */
  color: #c0392b;
  border: 1px solid #f39c12;
}
.feedback-message.success {
  background-color: #d1f7e8; /* Verde claro para sucesso */
  color: #27ae60;
  border: 1px solid #2ecc71;
}

.empty-message {
  font-size: 1.2rem;
  text-align: center;
  color: #777;
  margin-top: 20px;
}

.cart-items {
  margin-top: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  background: #f9fafb;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

.item-img {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
}

.item-info {
  flex: 1;
  margin-left: 15px;
  text-align: left;
}

.price {
  font-size: 1rem;
  color: #27ae60;
  margin: 4px 0;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #ddd;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.qty-btn:hover {
  background: #ccc;
}

.remove-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.cart-total {
  margin-top: 25px;
  padding: 20px;
  background: #eef2f3;
  border-radius: 12px;
  text-align: center;
}

.cart-total p {
  font-size: 1.1rem;
  color: #555;
}

.cart-total h2 {
  font-size: 1.9rem;
  color: #2c3e50;
  margin-top: 5px;
}

.finalizar-section {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.clear-btn, .checkout-btn {
  flex: 1;
  padding: 12px 0;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.clear-btn {
  margin-right: 10px;
  background: #e74c3c;
}
.clear-btn:hover {
  opacity: 0.9;
}

.checkout-btn {
  margin-left: 10px;
  background: #27ae60;
}
.checkout-btn:hover {
  opacity: 0.9;
}

/* Estilos de Recibo */
.recibo-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.recibo-item:last-child {
  border-bottom: none;
}
.recibo-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #34495e;
}
.recibo-total {
  color: #2980b9;
}
small {
  color: #7f8c8d;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to{ opacity: 1; transform: translateY(0); }
};
</style>