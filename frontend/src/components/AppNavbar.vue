<template>
  <div class="nav-container">
    <nav class="navbar">
      
      <router-link :to="{ name: 'home' }" class="logo-link">
        <div class="logo">LOGO</div>
      </router-link>
      
      <ul class="nav-links">
        <li>
          <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
        </li>
        <li>
          <a href="#" class="nav-link">Sobre nós</a>
        </li>

        <li class="dropdown-container" ref="dropdownRef">
          <a href="#" class="nav-link" @click.prevent="toggleDropdown">
            Sabores 
            <svg width="12" height="12" viewBox="0 0 24 24" class="chevron-down"
                  :class="{ rotated: isDropdownOpen }">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2.5"/>
            </svg>
          </a>

          <ul class="dropdown-menu" v-if="isDropdownOpen">
            <li><router-link :to="{ name: 'product-detail', params: { id: 'cereja' } }" class="dropdown-link">Cereja</router-link></li>
            <li><router-link :to="{ name: 'product-detail', params: { id: 'laranja' } }" class="dropdown-link">Laranja</router-link></li>
            <li><router-link :to="{ name: 'product-detail', params: { id: 'ameixa' } }" class="dropdown-link">Ameixa</router-link></li>
          </ul>
        </li>
      </ul>
      
      <div class="nav-actions">
        <!-- Carrinho: Visível apenas se o usuário estiver logado E for um cliente -->
        <div v-if="store.isCliente && store.usuario">
          <RouterLink :to="{ name: 'carrinho' }" class="cart">
            <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="#2c3e50" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </RouterLink>
        </div>

        <!-- Lógica de Login/Logout -->
        <button 
          v-if="store.usuario" 
          @click="handleLogout" 
          class="login-btn logout-btn"
        >
          Sair
        </button>
        <RouterLink v-else :to="{ name: 'login' }" class="login-btn">
          Login
        </RouterLink>

      </div>

    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
// Importa o useUsuarioStore
import { useUsuarioStore } from '../stores/usuario'; 

// Cria a instância da store
const store = useUsuarioStore(); 

// Lógica para controlar o estado do dropdown
const isDropdownOpen = ref(false);
const dropdownRef = ref(null); 

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Função para fechar o dropdown ao clicar fora dele
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// Nova função para lidar com o logout
const handleLogout = () => {
    store.logout(); 
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.nav-container {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1700px;
  z-index: 1000;
  padding: 0 20px;
  box-sizing: border-box;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  padding: 10px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.logo-link {
  text-decoration: none;
}

.logo {
  font-weight: 700;
  font-size: 1.6em;
  color: #2c3e50;
  cursor: pointer;
  font-family: "Montserrat", sans-serif; 
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 35px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  text-decoration: none;
  font-size: 1em;
  font-weight: 500;
  padding: 12px 18px;
  border-radius: 999px;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif; 
  cursor: pointer; 
}

.nav-link.active {
  background-color: #ffffff;
  color: #333;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background-color: #ffffff;
  color: #333;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}


.nav-link:not(.active):hover {
  background-color: #f4f4f4;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-icon {
  cursor: pointer;
  color: #2c3e50;
  stroke: #2c3e50;
  display: flex;
}

.login-btn {
  /* Estilo base (usado para Login) */
  background-color: #F97316;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9em;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-family: "Montserrat", sans-serif; 
  text-decoration: none;
}

.login-btn:hover {
  background-color: #EA580C;
  transform: translateY(-1px);
}

/* NOVO: Estilo para o botão de Logout (diferente do Login) */
.logout-btn {
  background-color: #EF4444; /* Vermelho suave para "Sair" */
}

.logout-btn:hover {
  background-color: #DC2626; 
}

.dropdown-container {
  position: relative; 
}

.chevron-down {
  transition: transform 0.3s ease;
  stroke-width: 2.5px; 
}

.chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px); 
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  list-style: none;
  z-index: 1100; 
  min-width: 150px; 
  border: 1px solid #f0f0f0;
}

.dropdown-menu li .dropdown-link {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  white-space: nowrap; 
  transition: background-color 0.2s ease;
  font-family: "Montserrat", sans-serif; 
}

.dropdown-menu li .dropdown-link:hover {
  background-color: #f4f4f4;
}
</style>