<template>
  <!-- 
    --- MUDANÇA ---
    Removemos o :key. Vamos controlar a reatividade
    dentro do <script setup>
  -->
  <div class="product-detail-page" :style="{ backgroundColor: product.bgColor }">
    <div class="content-wrapper">
      
      <!-- Lado Esquerdo: Imagem -->
      <div class="product-image-container">
        <img :src="product.image" :alt="product.title" class="product-image" />
      </div>

      <!-- Lado Direito: Informações -->
      <div class="product-info-container">
        <h1>{{ product.title }}</h1>
        <p class="description">
          {{ product.description }}
        </p>
        
        <div class="price">{{ product.price }}</div>
        
        <div class="size-section">
          <label>Tamanhos:</label>
          <SizeSelector :sizes="availableSizes" :activeColor="product.color" />
        </div>

        <button class="add-to-cart-btn" :style="{ backgroundColor: product.color }">
          Adicionar ao carrinho
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'; 
import SizeSelector from '../components/SizeSelector.vue';

import cherryJuiceImg from '../assets/suco_cereja.png';
import plumJuiceImg from '../assets/suco_ameixa.png';
import orangeJuiceImg from '../assets/suco_laranja.png';

// 1. Pega a rota atual (este objeto é reativo)
const route = useRoute();

// 2. Simula um banco de dados com as informações de cada suco
const juiceData = {
  cereja: {
    title: 'Suco de Cereja Integral',
    description: 'A cereja é uma fruta rica em antioxidantes e vitamina C, importante para o fortalecimento do sistema imunológico. Composto também por vitaminas A e do complexo B.',
    price: 'R$ 23,99',
    image: cherryJuiceImg,
    color: '#DB3D6C',
    bgColor: '#FDF0F4' // Fundo rosa claro
  },
  ameixa: {
    title: 'Suco de Ameixa Integral',
    description: 'Rico em fibras, o suco de ameixa é um ótimo aliado do sistema digestivo. Fonte de vitaminas K e potássio, ajudando a regular o organismo.',
    price: 'R$ 21,99',
    image: plumJuiceImg,
    color: '#7B4DAB',
    bgColor: '#F3EEF9' // Fundo roxo claro (como no protótipo)
  },
  laranja: {
    title: 'Suco de Laranja Integral',
    description: 'O clássico suco de laranja! Famoso pela alta concentração de Vitamina C, é perfeito para começar o dia com energia e saúde. 100% natural.',
    price: 'R$ 19,99',
    image: orangeJuiceImg,
    color: '#FF9900',
    bgColor: '#FFF8ED' // Fundo laranja claro
  }
};

// 3. --- A CORREÇÃO ESTÁ AQUI ---
// Em vez de ler o ID uma vez, criamos uma 'computed property'.
// O 'product' agora "assiste" o 'route.params.id'.
// Quando a URL mudar, esta função computed será executada
// automaticamente e pegará os novos dados.
const product = computed(() => {
  const id = route.params.id; // Pega o ID atual da URL
  return juiceData[id] || juiceData.cereja; // Retorna os dados corretos
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
</style>

