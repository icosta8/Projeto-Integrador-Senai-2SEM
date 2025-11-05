import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Pedidos from '../views/Pedidos.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: Login },
    { path: '/pedidos', name: 'Pedidos', component: Pedidos}
  ],
})

export default router
