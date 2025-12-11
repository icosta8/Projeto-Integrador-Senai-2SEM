<template>
  <div class="product-detail-page" :style="{ backgroundColor: product.bgColor }">
    <div class="content-wrapper">
      
      <div class="product-image-container">
        <img :src="product.image" :alt="product.title" class="product-image" />
      </div>

      <div class="product-info-container">
        <h1>{{ product.tipo || product.nome }}</h1> 
        <p class="description">
          {{ product.description }}
        </p>
        
        <!-- O preço é formatado para exibição -->
        <div class="price">{{ formatCurrency(product.preco) }}</div> 
        
        <div class="size-section">
          <label>Tamanhos:</label>
          <SizeSelector :sizes="availableSizes" :activeColor="product.color" />
        </div>

        <div class="status">{{ productStatus }}</div>

        <button class="add-to-cart-btn" :style="{ backgroundColor: product.color }" @click="salvarItem">
          Adicionar ao carrinho
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <!-- NOTIFICAÇÃO CUSTOMIZADA -->
    <Transition name="fade">
        <div v-if="showNotification" :class="['notification-box', { 'error': isError }]">
            <p>{{ notificationMessage }}</p>
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router'; 
import SizeSelector from '../components/SizeSelector.vue';

import cherryJuiceImg from '../assets/suco_cereja.png';
import plumJuiceImg from '../assets/suco_ameixa.png';
import orangeJuiceImg from '../assets/suco_laranja.png';

import { useSucoStore } from '../stores/produtos';
import { useCarrinhoStore } from '../stores/carrinho';
const carrinhoStore = useCarrinhoStore();
const sucoStore = useSucoStore();
const color = ref("");

function formatCurrency(value) {
    if (typeof value !== 'number') {
        // Retorna um valor seguro se não for um número
        console.error('Valor de preço inválido:', value);
        return 'R$ 0,00';
    }
    // Formata o número para a moeda Brasileira (BRL)
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

// --- Notificação State ---
const showNotification = ref(false);
const notificationMessage = ref('');
const isError = ref(false);
let notificationTimeout = null;

function displayNotification(message, error = false) {
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    notificationMessage.value = message;
    isError.value = error;
    showNotification.value = true;
    
    notificationTimeout = setTimeout(() => {
        showNotification.value = false;
        notificationTimeout = null;
    }, 3000); // Esconde após 3 segundos
}

const route = useRoute();

const productStatus = computed(() => {
   const id = route.params.id; 
   const index = sucoStore.sucos.findIndex(s => s.tipo === id);

  if (index === -1){
    return "Desconhecido";
  }
  return sucoStore.statusSuco[index];
});

watch(productStatus, (status) => {
  if(!status) return;

 if (status === "Estoque Esgotado") {
  color.value = "#7B4DAB";
  } else if (status === "Em Produção") {
  } else { 
  color.value = "#27ae60"; // Se for 'Em Estoque' (ou similar), usa o verde
  }
}, { immediate: true });


async function salvarItem(){
 
  const item = {
    produtoId: route.params.id, 
    nome: product.value.tipo, 
    preco: product.value.preco, 
    quantidade: 1, 
    image: product.value.image 
  };
  const salvar = await carrinhoStore.adicionar(item);

  if(!salvar){
    displayNotification("Não foi possível adicionar o produto ao carrinho. (Verifique o preço)", true);
  }else{
    displayNotification("Produto adicionado ao carrinho!");
  }
}

// 2. Simula um banco de dados com as informações de cada suco
const juiceData = {
  cereja: {
   tipo: 'Suco de Cereja Integral',
   description: 'A cereja é uma fruta rica em antioxidantes e vitamina C, importante para o fortalecimento do sistema imunológico. Composto também por vitaminas A e do complexo B.',
   preco: 23.99, 
   image: cherryJuiceImg,
   color: '#DB3D6C',
   bgColor: '#FDF0F4',
   quantidade: 1
  },
  ameixa: {
    tipo: 'Suco de Ameixa Integral',
    description: 'Rico em fibras, o suco de ameixa é um ótimo aliado do sistema digestivo. Fonte de vitaminas K e potássio, ajudando a regular o organismo.',
    preco: 21.99, 
    image: plumJuiceImg,
    color: '#7B4DAB',
    bgColor: '#F3EEF9'
  },
  laranja: {
    tipo: 'Suco de Laranja Integral',
    description: 'O clássico suco de laranja! Famoso pela alta concentração de Vitamina C, é perfeito para começar o dia com energia e saúde. 100% natural.',
    preco: 19.99, 
    image: orangeJuiceImg,
    color: '#FF9900',
    bgColor: '#FFF8ED'
  }
};


const product = computed(() => {
  const id = route.params.id;   
  return juiceData[id] || {}; 
});


// Dados dos tamanhos
const availableSizes = ref(['2L', '1.5L', '1L', '600ml', '300ml']);
</script>

<style scoped>

/* ... (Estilos não precisam de mudança) ... */
.product-detail-page {
  /* O background-color agora é dinâmico */
  min-height: 100vh;
  padding-top: 120px; /* Espaço para a AppNavbar absoluta */
  padding-bottom: 50px;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
  transition: background-color 0.3s ease;
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}
.product-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  max-width: 100%;
  height: auto;
  max-height: 500px; 
}

.product-info-container {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  font-size: 2.5em; /* 40px */
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.description {
  font-size: 1.1em; /* 18px */
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.price {
  font-size: 2.2em; /* 36px */
  font-weight: 700;
  color: #2c3e50;
  margin-top: 10px;
}

.size-section label {
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.add-to-cart-btn {
  /* A cor agora é dinâmica */
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 999px; /* Totalmente arredondado */
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  max-width: 300px; /* Largura máxima para o botão */
}

.add-to-cart-btn:hover {
  transform: scale(1.03);
  /* A sombra pode ser mais genérica ou também dinâmica */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.notification-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #27ae60; /* Verde para sucesso */
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    font-weight: 600;
    max-width: 90%; /* Responsividade */
}

.notification-box.error {
    background-color: #e74c3c; /* Vermelho para erro */
}

/* Estilos de transição (opcional, mas bom para UX) */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Responsividade para a página de detalhes */
@media (max-width: 900px) {
    .content-wrapper {
        flex-direction: column;
        gap: 20px;
    }
    .product-image {
        max-height: 300px;
    }
    h1 {
        font-size: 2em;
    }
}
</style>