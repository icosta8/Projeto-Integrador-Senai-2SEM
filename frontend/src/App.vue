<template>
  <div id="app-wrapper">
    <!-- Navbar em todas as páginas -->
    <AppNavbar />
    
    <main>
      <!-- O conteúdo da página (Home, Detalhes, etc.) é renderizado aqui -->
      <router-view />
    </main>
    
    <!-- ADICIONADO: Rodapé em todas as páginas -->
    <AppFooter />
  </div>
</template>

<script setup>
// Importa os componentes principais
import AppNavbar from '@/components/AppNavbar.vue';
// --- ADICIONE ESTA LINHA ---
import AppFooter from '@/components/AppFooter.vue';
</script>

<style>
/* Estilos globais (sem 'scoped') */
body {
  margin: 0;
  /* Você estava usando Poppins antes, mas mudamos para Montserrat.
    Vamos manter Montserrat, que está no seu style.css
  */
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f4f4f4; /* Cor de fundo caso a imagem não carregue */
}

* {
  box-sizing: border-box;
}

#app-wrapper {
  /* Isso ajuda a "empurrar" o rodapé para baixo em páginas curtas */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  /* O conteúdo principal cresce para preencher o espaço */
  flex-grow: 1;
}
</style>
