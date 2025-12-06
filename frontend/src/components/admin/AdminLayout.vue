<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { UserCircle } from 'lucide-vue-next'
import { useUsuarioStore } from '../../stores/usuario';
import { onMounted, ref } from 'vue';
const usuarioStore = useUsuarioStore();
const router = useRouter();

const adminName = ref('Administrador')
onMounted(() => {
  adminName.value = usuarioStore.usuario?.nome || 'Administrador'
})

async function desconectar(){
  await usuarioStore.logout()
  if(usuarioStore.logout()){
    alert('Usuário desconectado com sucesso!.')
    router.push('/login')
  }
}

</script>

<template>
  <div class="admin-container">
    <header class="admin-navbar">
      <div class="logo">LOGO</div>
      <nav class="admin-nav-links">
        <RouterLink to="/admin/dashboard">Dashboards</RouterLink>
        <RouterLink to="/admin/pedidos">Pedidos</RouterLink>
        <RouterLink to="/admin/produtos">Produtos</RouterLink>
        <RouterLink to="/admin/usuarios">Usuários</RouterLink>
        <RouterLink to="/admin/dispararPedidos">Disparar Pedidos</RouterLink>
        <RouterLink to="/admin/kpi">KPI</RouterLink>
      </nav>
      
      <div class="nav-actions">
        <div class="admin-profile">
          <span>{{adminName}}</span>
          <UserCircle :size="28" class="profile-icon" @click="desconectar" />
        </div>
      </div>
    </header>
    
    <main class="admin-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--admin-white);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  margin-bottom: 2rem;
}

.logo {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--admin-primary);
}

.admin-nav-links {
  display: flex;
  gap: 2rem;
}

.admin-nav-links a {
  text-decoration: none;
  color: var(--admin-text-light);
  font-weight: 500;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.admin-nav-links a:hover,
.admin-nav-links a.router-link-exact-active {
  color: var(--admin-primary);
  border-bottom-color: var(--admin-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Estilos para o novo perfil de admin */
.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.admin-profile span {
  font-weight: 600;
  font-size: 1rem;
  color: var(--admin-text);
}

.profile-icon {
  color: var(--admin-text-light);
  transition: color 0.3s ease;
}

.admin-profile:hover .profile-icon {
  color: var(--admin-primary);
}

.admin-content {
  padding: 0 1rem;
}
</style>