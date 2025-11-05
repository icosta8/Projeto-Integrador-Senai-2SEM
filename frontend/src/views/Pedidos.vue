<script setup>
import { ref } from 'vue';
</script>

<template>
  <div class="page-container">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="navbar-left">
        <div class="logo">LOGO</div>
      </div>

      <div class="navbar-center">
        <button class="nav-btn active">Pedidos</button>
        <button class="nav-btn">Dashboards</button>
        <button class="nav-btn">Produtos</button>
      </div>

      <div class="navbar-right">
        <button class="login-btn">Login</button>
      </div>
    </nav>

    <!-- SAUDAÇÃO -->
    <div class="greeting">
        <h2 class="greeting-text">Olá Gabriela!</h2>
    </div>

    <!-- CARDS SUPERIORES -->
    <div class="info-grid">
      <div class="info-card">
        <p class="card-title">Pedidos pendentes</p>
        <p class="card-value">15</p>
        <p class="card-sub">Na última semana</p>
      </div>
      <div class="info-card">
        <p class="card-title">Usuários novos</p>
        <p class="card-value">28</p>
        <p class="card-sub">Na última semana</p>
      </div>
      <div class="info-card">
        <p class="card-title">Compras realizadas</p>
        <p class="card-value">46</p>
        <p class="card-sub">Na última semana</p>
      </div>
      <div class="info-card">
        <p class="card-title">Lucro</p>
        <p class="card-value">R$ 8.563,56</p>
      </div>
    </div>

    <!-- TABELA -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Id Pedido</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Thainara Marques</td>
                <td>07/10/2025 20:27:58</td>
                <td>
                    <div class="suco-lista">
                        <div class="suco-item">
                            <img src="/imgs/suco-ameixa.png" alt="Suco de Laranja">
                            <span>2</span>
                        </div>
                        <div class="suco-item">
                            <img src="/imgs/suco-cereja.png" alt="Suco de Morango">
                            <span>1</span>
                        </div>
                        <div class="suco-item">
                            <img src="/imgs/suco-laranja.png" alt="Suco de Abacaxi">
                            <span>3</span>
                        </div>
                    </div>  
                </td>
                <td>R$150,00</td>
            </tr>
            <tr>
            <td>1</td>
            <td>Thainara Marques</td>
            <td>07/10/2025 20:27:58</td>
            <td>
                <div class="suco-lista">
                    <div class="suco-item">
                        <img src="/imgs/suco-laranja.png" alt="Suco de Laranja">
                        <span>2</span>
                    </div>
                    <div class="suco-item">
                        <img src="/imgs/suco-morango.png" alt="Suco de Morango">
                        <span>1</span>
                    </div>
                        <div class="suco-item">
                        <img src="/imgs/suco-abacaxi.png" alt="Suco de Abacaxi">
                    <span>3</span>
                    </div>
                </div>
            </td>
            <td>R$150,00</td>
        </tr>
            <tr>
            <td>1</td>
            <td>Thainara Marques</td>
            <td>07/10/2025 20:27:58</td>
            <td>
                <div class="suco-lista">
                    <div class="suco-item">
                        <img src="/imgs/suco-laranja.png" alt="Suco de Laranja">
                        <span>2</span>
                    </div>
                    <div class="suco-item">
                        <img src="/imgs/suco-morango.png" alt="Suco de Morango">
                        <span>1</span>
                    </div>
                        <div class="suco-item">
                        <img src="/imgs/suco-abacaxi.png" alt="Suco de Abacaxi">
                    <span>3</span>
                    </div>
                </div>
            </td>
            <td>R$150,00</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* --- Fundo geral com gradiente --- */
.page-container {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(180deg, #f2f7fb 0%, #e4f0f7 100%);
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

/* --- Navbar --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 15px 15px;
}

.navbar-center {
 position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.logo {
  font-weight: 700;
  color: #2b3b58;
  margin-right: 30px;
}

.nav-btn {
  background: none;
  border: none;
  color: #2b3b58;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-btn.active {
  background-color: #e3edfb;
  padding: 8px 16px;
  border-radius: 20px;
  color: #1d4ed8;
  font-weight: 600;
}

.login-btn {
  background-color: #fbbf24;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}
.login-btn:hover {
  background-color: #f59e0b;
}

/* --- Saudação --- */
.greeting {
  margin: 30px 60px 10px;
  text-align: left;
}
.greeting h2 {
  font-size: 24px;
  color: #111827;
  font-style: italic;
  margin: 0;
}

/* --- Cards superiores --- */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 25px;
  margin: 20px 60px;
  align-items: stretch;
}

.info-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: left;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #111827;
  margin: 5px 0;
}
.card-sub {
  font-size: 12px;
  color: #9ca3af;
}

/* --- Tabela --- */
.table-container {
  background-color: #fff;
  margin: 40px 60px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f59e0b;
  color: white;
}

th, td {
  text-align: left;
  padding: 12px 20px;
}

tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
</style>
