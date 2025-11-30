import { defineStore } from 'pinia'
import axios from 'axios'

export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({
    carrinho: JSON.parse(localStorage.getItem('carrinho')) || [] // Carrega do localStorage ou inicia vazio
  }),

  getters: {
    // Número total de itens no carrinho
    itensTotal: (state) => state.carrinho.length,

    // Valor total do carrinho
    valorTotal: (state) =>
      state.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0),

    // Valor total formatado em moeda BRL
    valorTotalFormatado: (state) => {
      const total = state.carrinho.reduce((t, i) => t + (i.preco * i.quantidade), 0)
      return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  },

  actions: {
    salvarCarrinho() {
      localStorage.setItem('carrinho', JSON.stringify(this.carrinho))
    },

    async carregarCarrinhoServidor() {
      // Carrega o carrinho do backend
      try {
        const res = await axios.get('http://localhost:3000/api/usuarios/carrinho')
        this.carrinho = res.data
        this.salvarCarrinho()
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err)
      }
    },
    
    // Adiciona produtos ao carrinho
    async adicionarProdutos(itens) {
      try {
        const existente = this.carrinho.find(item => item.nome === itens.nome)
        if (existente) {
          existente.quantidade += itens.quantidade
        } else {
          this.carrinho.push({
            id: Date.now(),
            nome: itens.nome,
            quantidade: itens.quantidade,
            preco: itens.preco
          })
        }
        this.salvarCarrinho()

        // Envia para o backend
        const res = await axios.post('http://localhost:3000/api/usuarios/adicionar', {
          produtoId: itens.id || Date.now(),
          tipo: itens.nome,
          preco: itens.preco,
          quantidade: itens.quantidade
        })

        console.log('Produto adicionado no backend:', res.data)
      } catch (err) {
        console.error('Erro ao adicionar produto:', err)
      }
    },

    removerProdutos(id) {
      const index = this.carrinho.findIndex(item => item.id === id)
      if (index > -1) {
        this.carrinho.splice(index, 1)
        this.salvarCarrinho()
      }
    },

    limparCarrinho() {
      this.carrinho = []
      localStorage.removeItem('carrinho')
      axios.post('http://localhost:3000/api/usuarios/limpar').catch(err =>
        console.warn('Erro ao limpar carrinho no servidor:', err)
      )
    },

    atualizarQuantidade(id, quantidade) {
      const item = this.carrinho.find(item => item.id === id)
      if (item) {
        item.quantidade = quantidade
        this.salvarCarrinho()
      }
    },

    // Finaliza o pedido e obtém o recibo do backend
    async finalizarPedido() {
      try {
        const pedido = {
          data: new Date().toISOString(),
          itens: this.carrinho,
          total: this.valorTotal
        }

        // O backend possui rota GET /recibo 
        const res = await axios.get('http://localhost:3000/api/usuarios/recibo', { params: pedido })

        console.log('Recibo:', res.data)
        this.limparCarrinho()
        return res.data
      } catch (err) {
        console.error('Erro ao finalizar pedido:', err)
      }
    }
  }
})
