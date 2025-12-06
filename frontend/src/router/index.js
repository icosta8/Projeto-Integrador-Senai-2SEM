// Em: src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'

// --- Suas Views de Cliente ---
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import Carrinho from '../views/carrinho.vue'

// --- Novas Views e Layout de Admin ---
import AdminLayout from '../components/admin/AdminLayout.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminProductsView from '../views/admin/AdminProductsView.vue'

// (Crie estes arquivos em 'src/views/admin/' quando precisar deles)
// import AdminPedidosView from '../views/admin/AdminPedidosView.vue'
// import AdminUsuariosView from '../views/admin/AdminUsuariosView.vue'


// Array de rotas combinado
const routes = [
  // --- Suas Rotas de Cliente Existentes ---
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
  {
    path: '/cadastro',
    name: 'register',
    component: Register
  },
  {
    path: '/produto/:id',
    name: 'product-detail',
    component: ProductDetailView,
    props: true
  },

  {
    path: '/carrinho',
    name: 'carrinho',
    component: Carrinho
  },
  
  // --- NOVAS ROTAS DE ADMIN ---
  {
    path: '/admin',
    component: AdminLayout, // O "molde" que criamos
    children: [
      {
        path: '', // Redireciona /admin para /admin/dashboard
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard', // Acessível em /admin/dashboard
        name: 'AdminDashboard',
        component: AdminDashboardView
      },
      {
        path: 'produtos', // Acessível em /admin/produtos
        name: 'AdminProducts',
        component: AdminProductsView
      },
      {
        path: 'produtos/novo', // A URL será /admin/produtos/novo
        name: 'AdminProductNew',
        component: () => import('../views/admin/AdminProductFormView.vue')
      },
      {
        path: 'pedidos', // Acessível em /admin/pedidos
        name: 'AdminPedidos',
        // Você precisará criar o arquivo 'src/views/admin/AdminPedidosView.vue'
        component: () => import('../views/admin/AdminPedidosView.vue')
      },
      {
        path: 'dispararPedidos',
        name: 'AdminDispararPedidos',
        component: () => import('../views/admin/AdminDispararPedidos.vue')
      },
      {
        path: '/admin/KPI',
        name: 'AdminKPIView',
        component: () => import('../views/admin/AdminKPIView.vue')
      },
      {
        path: 'usuarios', // Acessível em /admin/usuarios (RF-35)
        name: 'AdminUsuarios',
        // Você precisará criar o arquivo 'src/views/admin/AdminUsuariosView.vue'
        component: () => import('../views/admin/AdminUsuariosView.vue')
      },
      {
        path: 'usuarios/novo', // A URL será /admin/usuarios/novo
        name: 'AdminUserNew',
        component: () => import('../views/admin/AdminUserFormView.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router