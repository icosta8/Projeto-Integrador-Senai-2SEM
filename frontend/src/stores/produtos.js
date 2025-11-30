import { defineStore } from 'pinia';
import axios from 'axios';

export const useSucoStore = defineStore('suco', {
  state: () => ({
    // Lista de sucos disponíveis
    sucos: [],
    status: ['Em produção', 'Finalizado', 'Estoque Esgotado'],
    pedirSuco: false,
    loading: false,
    mensagem: null,
    pedidoRealizado: false
  }),

  getters: {
    // Retorna o status de cada suco baseado na quantidade disponível
    statusSuco: (state) => {
      return state.sucos.map(suco => {
        if (!state.pedirSuco) return state.status[0];
        return suco.quantidade > 0 ? state.status[1] : state.status[2];
      });
    }
  },

  actions: {
    async carregarSucos() {
      try {
        // Carrega a lista de sucos do backend
        this.loading = true;
        const res = await axios.get('http://localhost:3000/api/sucos/procurar-suco');
        this.sucos = res.data;
      } catch (err) {
        console.error('Erro ao carregar sucos:', err);
        this.mensagem = 'Erro ao buscar sucos';
      } finally {
        this.loading = false;
      }
    },

    async pedirSuco(tipo, quantidade) {
      try {
        // Realiza o pedido de suco
        this.loading = true;
        this.mensagem = null;

        const suco = this.sucos.find(s => s.tipo === tipo);
        if (!suco) throw new Error('Suco não encontrado!');

        const res = await axios.post('http://localhost:3000/api/sucos/pedir-suco', {
          tipo,
          preco: suco.preco,
          quantidade
        });
         
        this.atualizarEstoque(tipo, quantidade);

        this.pedidoRealizado = true;
        this.mensagem = res.data.message || 'Pedido realizado com sucesso!';
      } catch (err) {
        this.mensagem = err.response?.data?.error || 'Erro ao pedir suco.';
      } finally {
        this.loading = false;
      }
    },

    atualizarEstoque(tipo, quantidade) {
      const suco = this.sucos.find(s => s.tipo === tipo);
      if (suco) {
        suco.quantidade -= quantidade;
        if (suco.quantidade < 0) suco.quantidade = 0;
      }
    },

    exibirSuco(tipo) {
      const suco = this.sucos.find(s => s.tipo === tipo);
      if (suco) {
        return `Suco: ${suco.tipo}, Preço: R$${suco.preco.toFixed(2)}, Quantidade: ${suco.quantidade}`;
      }
      return 'Suco não encontrado';
    }
  }
});
