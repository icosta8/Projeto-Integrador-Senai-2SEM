<template>
  <footer class="app-footer">
    © SWEET | Todos os direitos reservados
  </footer>
</template>

<style scoped>
.app-footer {
  /* --- ESTILO FLUTUANTE --- */
  /* 1. Posição absoluta para flutuar */
  position: absolute;
  
  /* 2. Ancorado no fundo do "pai" (o #app-wrapper) */
  bottom: 15px; 
  z-index: 10; 
  
  /* 3. Sem fundo e com texto centrado */
  width: 100%;
  text-align: center;
  color: #555; /* Cor do texto (bom para fundos claros) */
  font-size: 0.9em;
}
</style>

