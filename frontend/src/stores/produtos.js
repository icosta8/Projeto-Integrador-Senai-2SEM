// stores/produtos.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useSucoStore = defineStore('suco', {
  state: () => ({
    // dados iniciais (podem ser sobrescritos por carregarSucos)
    sucos: [
      { tipo: 'cereja', preco: 23.99, quantidade: 10 },
      { tipo: 'laranja', preco: 19.99, quantidade: 10 },
      { tipo: 'ameixa', preco: 21.99, quantidade: 10 }
    ],

    // carrinho local: { tipo, preco, quantidade }
    cart: [],

    // flags de controle
    pedidoAtivo: false,       
    pedidoRealizado: false,   
    loading: false,
    mensagem: null,

    // conexão MES (auto-detect via carregamento periódico)
    conectadoMES: false,
    lastMESUpdate: null,

    // controle de auto-sync
    _mesIntervalId: null,
    _mesTimeoutHandle: null
  }),

  getters: {
    // total de itens no estoque (soma das quantidades)
    totalEstoque: (state) => state.sucos.reduce((acc, s) => acc + (s.quantidade || 0), 0),

    // total de itens no carrinho
    cartTotalItems: (state) => state.cart.reduce((acc, i) => acc + i.quantidade, 0),

    // valor total do carrinho
    cartTotalValue: (state) => state.cart.reduce((acc, i) => acc + i.preco * i.quantidade, 0),

    // status por suco (pode alterar conforme necessidade)
    statusSuco: (state) => {
      return state.sucos.map(suco => {
        if (!state.pedidoAtivo) return 'Em produção'
        return suco.quantidade > 0 ? 'Finalizado' : 'Estoque Esgotado'
      })
    },

    // busca um suco por tipo
    findSuco: (state) => (tipo) => state.sucos.find(s => s.tipo === tipo)
  },

  actions: {
 
    async carregarSucos() {
      try {
        this.loading = true
        this.mensagem = null

        const res = await axios.get('http://localhost:3000/api/sucos/procurar-suco')
        // espera array no formato [{ tipo, preco, quantidade }, ...]
        if (Array.isArray(res.data)) {
          this.sucos = res.data
        } else {
          // caso o backend retorne objeto
          console.warn('carregarSucos: formato inesperado', res.data)
        }

        return true
      } catch (err) {
        console.error('Erro ao carregar sucos:', err)
        this.mensagem = 'Erro ao buscar sucos'
        return false
      } finally {
        this.loading = false
      }
    },

    iniciarAutoSync(periodo = 3000, timeoutOffline = 5000) {
      // limpa intervalos anteriores
      if (this._mesIntervalId) clearInterval(this._mesIntervalId)
      if (this._mesTimeoutHandle) clearTimeout(this._mesTimeoutHandle)

      // função que chama o endpoint e atualiza conectadoMES
      const fetchMes = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/clp/clp-status', { timeout: Math.max(2000, periodo - 500) })
          // supondo que res.data contenha os campos esperados (ex: estoqueProd, mesPCsBoas, mesPCsRuins)
          this.lastMESUpdate = new Date().toISOString()
          this.conectadoMES = true

          // limpa timeout de offline e set novo
          if (this._mesTimeoutHandle) clearTimeout(this._mesTimeoutHandle)
          this._mesTimeoutHandle = setTimeout(() => {
            this.conectadoMES = false
          }, timeoutOffline)

        } catch (err) {
          console.warn('MES fetch failed', err)
          this.conectadoMES = false
        }
      }

      // chamada imediata + intervalada
      fetchMes()
      this._mesIntervalId = setInterval(fetchMes, periodo)
    },

    pararAutoSync() {
      if (this._mesIntervalId) {
        clearInterval(this._mesIntervalId)
        this._mesIntervalId = null
      }
      if (this._mesTimeoutHandle) {
        clearTimeout(this._mesTimeoutHandle)
        this._mesTimeoutHandle = null
      }
      this.conectadoMES = false
    },

    addToCart(tipo, quantidade = 1) {
      this.mensagem = null

      if (!tipo) return { ok: false, message: 'Tipo inválido' }
      quantidade = Number(quantidade) || 0
      if (quantidade <= 0) return { ok: false, message: 'Quantidade deve ser maior que zero' }

      const suco = this.sucos.find(s => s.tipo === tipo)
      if (!suco) return { ok: false, message: 'Suco não encontrado' }

      if (suco.quantidade < quantidade) {
        return { ok: false, message: `Estoque insuficiente (${suco.quantidade} dispon.)` }
      }

      const existing = this.cart.find(i => i.tipo === tipo)
      if (existing) {
        // valida nova quantidade não exceder estoque
        if (existing.quantidade + quantidade > suco.quantidade) {
          return { ok: false, message: `Somatório excede estoque (${suco.quantidade})` }
        }
        existing.quantidade += quantidade
      } else {
        this.cart.push({ tipo, preco: suco.preco, quantidade })
      }

      // marca que existe um pedido em montagem
      this.pedidoAtivo = true
      return { ok: true }
    },

    removeFromCart(tipo, quantidade = 1) {
      quantidade = Number(quantidade) || 0
      if (!tipo || quantidade <= 0) return { ok: false, message: 'Parâmetros inválidos' }

      const idx = this.cart.findIndex(i => i.tipo === tipo)
      if (idx === -1) return { ok: false, message: 'Item não encontrado no carrinho' }

      const item = this.cart[idx]
      if (item.quantidade > quantidade) {
        item.quantidade -= quantidade
      } else {
        this.cart.splice(idx, 1)
      }

      if (this.cart.length === 0) this.pedidoAtivo = false
      return { ok: true }
    },

    clearCart() {
      this.cart = []
      this.pedidoAtivo = false
    },

    resumoPedido() {
      return {
        itens: [...this.cart],
        totalItens: this.cartTotalItems,
        valorTotal: this.cartTotalValue
      }
    },

    async pedirSucoBackend() {
      try {
        if (!this.cart.length) return { ok: false, message: 'Carrinho vazio' }

        this.loading = true
        this.mensagem = null

        // valida estoque antes de enviar
        for (const item of this.cart) {
          const suco = this.sucos.find(s => s.tipo === item.tipo)
          if (!suco) throw new Error(`Suco ${item.tipo} não encontrado no estoque`)
          if (item.quantidade <= 0) throw new Error('Quantidade inválida')
          if (item.quantidade > suco.quantidade) throw new Error(`Estoque insuficiente para ${item.tipo}`)
        }

        // prepara payload (ex: lista de itens)
        const payload = { itens: this.cart.map(i => ({ tipo: i.tipo, quantidade: i.quantidade, preco: i.preco })) }

        const res = await axios.post('http://localhost:3000/api/clp/escrever-pedido', payload)

        // se backend confirmar, atualiza estoque local
        for (const item of this.cart) {
          this.atualizarEstoque(item.tipo, item.quantidade)
        }

        // marca estado de pedido
        this.pedidoRealizado = true
        this.pedidoAtivo = false
        this.mensagem = res.data?.message || 'Pedido registrado com sucesso no backend.'
        // limpa carrinho local pois já foi processado
        this.clearCart()

        return { ok: true, message: this.mensagem }
      } catch (err) {
        console.error('Erro ao realizar pedido:', err)
        const msg = err.response?.data?.error || err.message || 'Erro ao pedir suco.'
        this.mensagem = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },


    async novoPedido() {
      try {
        this.loading = true
        this.mensagem = null
        const res = await axios.post('http://localhost:3000/api/clp/novo')
        // caso de sucesso, podemos atualizar flags
        this.mensagem = res.data?.message || 'Novo pedido registrado no CLP.'
        // opcional: manter pedidoRealizado true até confirmação do CLP
        return { ok: true, message: this.mensagem }

      } catch (err) {
        console.error('Erro ao iniciar pedido no CLP:', err)
        const msg = err.response?.data?.error || 'Erro ao solicitar o novo pedido no CLP.'
        this.mensagem = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async inicioPedido(){
      try{
        this.loading = true
        this.mensagem = null
        const res = await axios.post('http://localhost:3000/api/clp/inicio')
        this.mensagem = res.data?.message || 'Inicio do pedido registrado no CLP.'
        return {ok: true, message: this.mensagem }
      }catch(err){
        console.error('Erro ao iniciar pedido no CLP:', err)   
        const msg = err.response?.data?.error || 'Erro ao iniciar pedido no CLP.'
        this.mensagem = msg
        return { ok: false, message: msg}
      }finally{
        this.loading = false
      }
    },

    async abortarPedido() {
      try {
        this.loading = true
        this.mensagem = null

        const res = await axios.post('http://localhost:3000/api/clp/abortar')

        // reseta flags locais
        this.pedidoAtivo = false
        this.pedidoRealizado = false
        this.clearCart()

        this.mensagem = res.data?.message || 'Pedido abortado com sucesso no CLP.'
        return { ok: true, message: this.mensagem }
      } catch (err) {
        console.error('Erro ao abortar no CLP:', err)
        const msg = err.response?.data?.error || 'Erro ao abortar pedido no CLP.'
        this.mensagem = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    async resetCLP() {
      try {
        this.loading = true
        this.mensagem = null

        const res = await axios.post('http://localhost:3000/api/clp/reset')

        // reset local
        this.pedidoAtivo = false
        this.pedidoRealizado = false
        this.clearCart()

        this.mensagem = res.data?.message || 'CLP resetado com sucesso.'
        return { ok: true, message: this.mensagem }
      } catch (err) {
        console.error('Erro ao resetar CLP:', err)
        const msg = err.response?.data?.error || 'Erro ao resetar CLP.'
        this.mensagem = msg
        return { ok: false, message: msg }
      } finally {
        this.loading = false
      }
    },

    atualizarEstoque(tipo, quantidade) {
      const suco = this.sucos.find(s => s.tipo === tipo)
      if (!suco) return false
      quantidade = Number(quantidade) || 0
      suco.quantidade -= quantidade
      if (suco.quantidade < 0) suco.quantidade = 0

      // se todos os itens no estoque acabarem, zera flags de pedidoRealizado
      if (this.totalEstoque === 0) {
        this.pedidoRealizado = false
        this.pedidoAtivo = false
      }
      return true
    },

    exibirSuco(tipo) {
      const suco = this.sucos.find(s => s.tipo === tipo)
      if (!suco) return 'Suco não encontrado'
      return `Suco: ${suco.tipo}, Preço: R$${Number(suco.preco).toFixed(2)}, Quantidade: ${suco.quantidade}`
    }
  }
})
