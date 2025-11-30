<template>
  <div class="carrinho-container">
    <div class="carrinho-card">
      <h1>Seu Carrinho</h1>

      <p v-if="!sucos || sucos.length === 0" class="empty-message">
        Seu carrinho está vazio.
      </p>

      <div v-else class="cart-items">
        <div class="cart-item" v-for="(sucos, index) in itens" :key="index">
          
          <img :src="item.image" class="item-img" />

          <div class="item-info">
            <h3>{{ sucos.nome }}</h3>
            <p class="price">R$ {{ sucos.preco.toFixed(2) }}</p>

            <div class="quantity">
              <button @click="diminuir(item)" class="qty-btn">−</button>
              <span>{{ sucos.quantidade }}</span>
              <button @click="aumentar(item)" class="qty-btn">+</button>
            </div>
          </div>

          <button @click="removerItem(item)" class="remove-btn">🗑</button>
        </div>

        <div class="cart-total">
          <p>Total:</p>
          <h2>R$ {{ total.toFixed(2) }}</h2>
        </div>

        <div class="finalizar-section">
          <button @click="limparCarrinho" class="clear-btn">Limpar Carrinho</button>
          <button @click="finalizarPedido" class="checkout-btn">Finalizar Pedido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCarrinhoStore } from '../stores/carrinho';
import { computed, onMounted, ref } from 'vue';

const carrinhoStore = useCarrinhoStore();

const sucos = computed(() => carrinhoStore.sucos);

const total = computed(() =>
  carrinhoStore.sucos.reduce(
    (acc, suco) => acc + sucos.preco * suco.quantidade, 
    0
  )
);

async function carregarCarrinho() {
  await carrinhoStore.carregarCarrinho();
}

function removerItem(sucos) {
  carrinhoStore.removerProdutos(sucos.nome);
}

function limparCarrinho() {
  carrinhoStore.limparCarrinho();
}

function aumentar(sucos) {
  carrinhoStore.atualizarQuantidade(sucos.nome, sucos.quantidade + 1);
}

function diminuir(sucos) {
  if (sucos.quantidade > 1) {
    carrinhoStore.atualizarQuantidade(sucos.nome, sucos.quantidade - 1);
  }
}

function finalizarPedido() {
  carrinhoStore.finalizarPedido();
}

onMounted(() => {
  carregarCarrinho();
});
</script>

<style scoped>
.carrinho-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  width: 100%;
  margin-top: 20%;
}

.carrinho-card {
  background: #ffffff;
  width: 100%;
  max-width: 700px;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  animation: fadeIn .3s ease;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 25px;
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

.clear-btn {
  flex: 1;
  margin-right: 10px;
  padding: 12px 0;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.checkout-btn {
  flex: 1;
  margin-left: 10px;
  padding: 12px 0;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
