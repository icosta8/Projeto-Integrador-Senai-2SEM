<template>
  <div class="card">
    <div class="image-container">
      <!-- O 'brilho' atrás da imagem -->
      <div class="glow" :style="{ backgroundColor: buttonColor }"></div>
      
      <!-- A imagem da garrafa -->
      <img :src="imageUrl" :alt="title" class="juice-image" />
    </div>
    
    <!-- O botão com o nome e a cor -->
    <button class="juice-button" :style="{ backgroundColor: buttonColor }">
      {{ title }}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-right">
        <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 5L19 12L12 19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
// Define as propriedades (props) que o componente espera receber
defineProps({
  title: String,
  imageUrl: String,
  buttonColor: String
});
</script>

<style scoped>
.card {
  border-radius: 20px;
  padding: 25px 20px 20px 20px; /* Aumentei o padding */
  text-align: center;
  width: 300px; /* --- AUMENTADO (era 200px) --- */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px; /* --- AUMENTADO (era 250px) --- */
  margin-bottom: 35px; /* Aumentei a margem */
}

.juice-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  height: 600px; /* --- AUMENTADO (era 220px) --- */
}

.glow {
  position: absolute;
  width: 250px; /* --- AUMENTADO --- */
  height: 250px; /* --- AUMENTADO --- */
  border-radius: 50%;
  /* A cor virá da prop 'buttonColor' */
  opacity: 0.6;
  filter: blur(50px); /* Efeito de brilho mais intenso */
  z-index: 1;
}

.juice-button {
  color: white;
  border: none;
  padding: 16px 30px; /* --- AUMENTADO --- */
  border-radius: 25px; /* Totalmente arredondado */
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1em; /* --- AUMENTADO --- */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px; /* Aumentei o espaço */
  transition: transform 0.2s;
  font-family: "Montserrat", sans-serif; 
}

.juice-button:hover {
  transform: scale(1.05);
}

.juice-button span {
  font-size: 1.3em; /* --- AUMENTADO --- */
  line-height: 1;
}
</style>

