import { defineStore } from 'pinia'
import axios from 'axios'

export const useChartStore = defineStore('chart', {
  state: () => ({
    estoque: {
      labels: ['Estoque Total'],
      datasets: [
        {
          label: 'Produtos em Estoque',
          data: [0],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },

    pecasBoas: {
      labels: ['Peças Boas'],
      datasets: [
        {
          label: 'Produção OK',
          data: [0],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    },

    pecasRuins: {
      labels: ['Peças Ruins'],
      datasets: [
        {
          label: 'Refugadas',
          data: [0],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },

    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    },

    conectadoMES: false
  }),

  getters: {
    totalPecasBoas: (state) => state.pecasBoas.datasets[0].data[0],
    totalPecasRuins: (state) => state.pecasRuins.datasets[0].data[0],
    totalEstoque: (state) => state.estoque.datasets[0].data[0]
  },

  actions: {
    atualizarGraficos(dados) {

      // Usando as chaves EXATAS do CLP 
      const estoque = dados.status.estoqueProd ?? 0
      const pcsBoas = dados.status.mesPCsBoas ?? 0
      const pcsRuins = dados.status.mesPCsRuins ?? 0

      // Atualiza KPI
    this.pecasBoas.datasets[0].data = [dados.status.mesPcsBoas]
    this.pecasRuins.datasets[0].data = [dados.status.mesPcsRuins]
    this.estoque.datasets[0].data = [dados.status.estoqueProd]
    },

    async carregarDadosMES() {
      try {
        const resposta = await axios.get('http://localhost:3000/api/clp/status-clp')
        this.atualizarGraficos(resposta.data)
        this.conectadoMES = true

      } catch (err) {
        console.error('Erro ao carregar dados do KPI/MES:', err)
        this.conectadoMES = false
      }
    },

    iniciarAtualizacao(periodo = 1000) {
      this.carregarDadosMES()
      setInterval(() => this.carregarDadosMES(), periodo)
    }
  }
})