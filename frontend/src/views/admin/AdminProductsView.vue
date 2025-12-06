<script setup>
import { ref, computed } from 'vue'
import AdminProductCard from '@/components/admin/AdminProductCard.vue'
import { Plus, Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

// --- 1. IMPORTE SUAS IMAGENS AQUI ---
// 
// O atalho '@' aponta para a pasta 'src'.
// Criei nomes de exemplo (ex: suco-laranja.png). 
// Renomeie para o nome real dos seus arquivos.
//
import sucoLaranjaImg from '@/assets/suco_laranja.png'
import sucoCerejaImg from '@/assets/suco_cereja.png'
import sucoAmeixaImg from '@/assets/suco_ameixa.png'
// import sucoUvaImg from '@/assets/images/suco-uva.png' // Descomente e adicione o suco de uva

// Dados de exemplo
const adminName = "Gabriela"
const searchQuery = ref('')

// --- 2. REMOVA A FUNÇÃO PLACEHOLDER ---
// const placeholderImage = (color) => ... (não precisamos mais dela)

// --- 3. USE AS IMAGENS IMPORTADAS NO SEU ARRAY ---
const products = ref([
  { id: 1, name: 'Suco de Laranja Integral', image: sucoLaranjaImg, stock: 28 },
  { id: 2, name: 'Suco de Cereja Integral', image: sucoCerejaImg, stock: 17 },
  { id: 3, name: 'Suco de Ameixa Integral', image: sucoAmeixaImg, stock: 5 },
  // { id: 4, name: 'Suco de Uva Integral', image: sucoUvaImg, stock: 5 } // Exemplo
])

// Lógica de busca (RF-29)
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }
  return products.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
})
</script>

<template>
  <div class="products-view">
    <div class="view-header">
      <h1 class="greeting">Olá {{ adminName }}!</h1>
      
      <RouterLink :to="{ name: 'AdminProductNew' }" class="add-product-btn">
        <Plus :size="18" /> Novo Produto
      </RouterLink>
    </div>
    
    <div class="action-bar">
      <div class="search-wrapper">
        <Search :size="20" class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar produtos por nome..." 
        />
      </div>
    </div>

    <section class="products-grid">
      <AdminProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </section>
  </div>
</template>

<style scoped>
/* Seus estilos ... */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.greeting {
  font-size: 2.5rem;
  font-weight: 700;
}

.add-product-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--admin-secondary);
  color: var(--admin-white);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-product-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 152, 0, 0.4);
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--admin-text-light);
}

.search-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem; /* Espaço para o ícone */
  border-radius: 8px;
  border: 1px solid var(--admin-border);
  font-size: 1rem;
}
.search-wrapper input:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px #f0e6ff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>