<template>
  <div id="app-wrapper">
    <AppNavbar v-if="!isAdminRoute" />
    
    <main>
      <router-view />
    </main>
    
    <AppFooter v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
// --- NOVAS IMPORTAÇÕES ---
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Importa os componentes principais
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';

// --- LÓGICA ADICIONADA ---

// Pega as informações da rota atual
const route = useRoute()

// Cria uma variável "computada" (que se atualiza sozinha)
// Ela será 'true' se a URL atual (route.path) começar com '/admin'
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style>
/* Seus estilos globais continuam aqui */
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* O fundo gradiente do admin já está no style.css, 
    então podemos manter o seu fundo original aqui ou mover tudo 
    para o style.css 
  */
  background-color: #f4f4f4; 
}

* {
  box-sizing: border-box;
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}
</style>