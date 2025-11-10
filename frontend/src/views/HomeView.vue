<template>
  <div class="home-page">
    
    <img :src="backgroundImage" alt="Sweet Juices Homepage" class="full-page-image" />

    <div class="juice-cards-container">
      
      <router-link :to="{ name: 'product-detail', params: { id: 'ameixa' } }" class="product-link">
        <ProductCard 
          title="Plum Juice"
          :image-url="plumJuiceImg"
          button-color="#7B4DAB"
        />
      </router-link>

      <router-link :to="{ name: 'product-detail', params: { id: 'laranja' } }" class="product-link">
        <ProductCard 
          title="Orange Juice"
          :image-url="orangeJuiceImg"
          button-color="#FF9900"
        />
      </router-link>

      <router-link :to="{ name: 'product-detail', params: { id: 'cereja' } }" class="product-link">
        <ProductCard 
          title="Cherry Juice"
          :image-url="cherryJuiceImg"
          button-color="#DB3D6C"
        />
      </router-link>

      </div>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue';
// import AppFooter from '@/components/AppFooter.vue'; <-- REMOVIDO DAQUI

// Importe a imagem de fundo principal
import backgroundImage from '../assets/homepage-background.png';

// Importe as imagens dos sucos
import plumJuiceImg from '../assets/suco_ameixa.png';
import orangeJuiceImg from '../assets/suco_laranja.png';
import cherryJuiceImg from '../assets/suco_cereja.png';
</script>

<style scoped>
.home-page {
  position: relative;
  width: 100%;
}

.full-page-image {
  width: 100%;
  height: auto;
  display: block; 
  z-index: 1; 
}

.juice-cards-container {
  position: absolute;
  bottom: 150px; 
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 80px; 
  z-index: 10;
}

.product-link {
  text-decoration: none;
  color: inherit;
}
</style>