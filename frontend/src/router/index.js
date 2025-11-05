import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
// --- ADICIONE ESTA LINHA ---
import ProductDetailView from '../views/ProductDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // --- OBJETO DE ROTA MODIFICADO ---
  {
    // Agora a rota aceita um 'id' dinâmico
    path: '/produto/:id', 
    name: 'product-detail',
    component: ProductDetailView,
    props: true // Permite que o ID seja passado como prop para o componente
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router