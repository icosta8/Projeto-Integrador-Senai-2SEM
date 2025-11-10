<template>
  <div id="app-wrapper">
    <AppNavbar v-if="!hideMainLayout" />
    
    <main>
      <router-view />
    </main>
    
    <AppFooter v-if="!hideMainLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Importa os componentes principais
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';

// Pega as informações da rota atual
const route = useRoute()

// --- LÓGICA ATUALIZADA ---
// Eu mudei o nome da variável de 'isAdminRoute' para 'hideMainLayout'
// para ficar mais claro, e adicionei a verificação do '/login'.
const hideMainLayout = computed(() => {
  const path = route.path
  
  // Retorna 'true' (escondendo a navbar) se a rota for:
  // 1. Qualquer rota de admin (ex: /admin/dashboard)
  // 2. A rota exata de login (ex: /login)
  // 3. (BÔNUS) Já adicionei a rota de cadastro que você tem no seu form
  
  return path.startsWith('/admin') || path === '/login' || path === '/cadastro'
})
</script>

<style>
/* Seus estilos globais (body, *, #app-wrapper, main) ficam aqui... */
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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