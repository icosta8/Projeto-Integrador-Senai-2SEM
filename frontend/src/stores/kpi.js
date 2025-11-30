import { defineStore } from 'pinia'
import axios from 'axios'
export const useChartStore = defineStore('chart', {
  state: () => ({
    estoque: {
      labels: ['Estoque'],
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

  actions: {
    atualizarGraficos(dados) {
      this.estoque.datasets[0].data = [dados.estoque ?? 0]
      this.pecasBoas.datasets[0].data = [dados.pecasBoas ?? 0]
      this.pecasRuins.datasets[0].data = [dados.pecasRuins ?? 0]
    },

    async carregarDadosMES() {
      try {
        const resposta = await axios.get('http://localhost:3000/api/mes/consultar-estoque') // rota do backend MES
        const dados = await resposta.json()
        this.atualizarGraficos(dados)
        this.conectadoMES = true
      } catch (err) {
        console.error('Erro ao carregar dados do MES:', err)
        this.conectadoMES = false
      }
    },

    iniciarAtualizacao(periodo = 3000) {
      this.carregarDadosMES()
      setInterval(() => this.carregarDadosMES(), periodo)
    }
  }
})
