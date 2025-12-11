import { defineStore } from 'pinia'
import axios from 'axios' // Mantemos o import caso você queira descomentar depois

const parsePrice = (priceString) => {
    // Remove "R$", espaços, e substitui vírgula por ponto (formato brasileiro para americano)
    if (typeof priceString !== 'string') return priceString;
    const cleanString = priceString.replace('R$', '').replace(/\s/g, '').replace(',', '.');
    return Number(cleanString);
};

export const useCarrinhoStore = defineStore('carrinho', {
    state: () => ({
        // Inicializa o carrinho com dados locais
        carrinho: JSON.parse(localStorage.getItem('carrinho')) || [],
        // NOVO: Histórico de recibos (compras finalizadas)
        recibos: JSON.parse(localStorage.getItem('recibos')) || []
    }),

    getters: {
        itens: (state) => state.carrinho,

        // Retorna o valor total como número (boa prática)
        total: (state) => {
            const sum = state.carrinho.reduce((t, i) => t + (i.preco * i.quantidade), 0);
            return sum;
        },

        // NOVO: Retorna a lista de recibos
        historicoRecibos: (state) => state.recibos
    },

    actions: {
        salvar() {
            localStorage.setItem('carrinho', JSON.stringify(this.carrinho))
        },

        // NOVO: Ação para salvar o histórico de recibos no localStorage
        salvarRecibos() {
            localStorage.setItem('recibos', JSON.stringify(this.recibos))
        },

        async carregarCarrinhoServidor() {
            try {
                const res = await axios.get('http://localhost:3000/api/carrinho/')
                this.carrinho = res.data.map(item => ({
                    ...item,
                    // Garante que o preço do backend é um número
                    preco: parsePrice(item.preco) 
                }))
                this.salvar()
            } catch (err) {
                console.error("Erro ao carregar carrinho:", err)
            }
        },

        // NOVO: Ação para finalizar a compra e gerar um recibo
        async finalizarCompra() {
            if (this.carrinho.length === 0) {
                console.warn("Carrinho vazio. Não é possível finalizar a compra.");
                return null;
            }

            // 1. Gera um ID único simples (Timestamp + Random)
            const reciboId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
            
            // 2. Cria o objeto do recibo
            const novoRecibo = {
                id: reciboId,
                data: new Date().toISOString(),
                // Cria uma cópia profunda dos itens do carrinho (snapshot)
                itens: JSON.parse(JSON.stringify(this.carrinho)), 
                total: this.total // Usa o getter total
            };
        
            // 3. Adiciona ao estado de recibos
            this.recibos.unshift(novoRecibo); // Adiciona no início para os mais recentes aparecerem primeiro

            // 4. Persiste o histórico de recibos localmente
            this.salvarRecibos();

            // 5. Limpa o carrinho
            this.limpar(false); // Chama limpar, mas sem a tentativa de limpar o backend (passamos false para ignorar o axios)

            const mapa_produtos = {
                'Suco de Cereja Integral': 0,
                'Suco de Ameixa Integral': 1,
                'Suco de Laranja Integral': 2
            }

            try {
               const res = await axios.post('http://localhost:3000/api/clp/escrever-pedido', {
                produto: mapa_produtos[item.nome],
                quantidade: item.quantidade
               });
               return res
            } catch (error) {
                console.error("Erro ao enviar pedido para o backend:", error);
            }
            
        },

        async adicionar(item) {
            // 1. Converte o preço de entrada para número (trata string 'R$ 23,99' ou string '23.99')
            const numPreco = parsePrice(item.preco);

            if (isNaN(numPreco) || numPreco <= 0) {
                console.error("Preço do item é inválido ou ausente:", item.preco);
                return false; // Falha na adição (realmente é um erro no preço)
            }

            // 2. Cria o objeto base com o preço já convertido
            const itemBase = { 
                ...item,
                preco: numPreco,
                quantidade: Number(item.quantidade) || 1
            };

            const existente = this.carrinho.find(i => i.produtoId === itemBase.produtoId);

            if (existente) {
                // Se existe, soma a nova quantidade
                existente.quantidade += itemBase.quantidade;
            } else {
                // Se não existe, adiciona o novo item
                this.carrinho.push(itemBase);
            }

            this.salvar();

            try {
                await axios.post('http://localhost:3000/api/carrinho/adicionar', {
                    produtoId: itemBase.produtoId,
                    tipo: itemBase.nome,
                    preco: itemBase.preco, 
                    quantidade: itemBase.quantidade
                });
                return true;
            } catch (error) {
                console.error("Erro ao enviar para o backend:", error);
                return false;
            }
            // Já que o processo local foi bem-sucedido, retornamos true.
            return true; 
        },

        remover(produtoId) {
            this.carrinho = this.carrinho.filter(i => i.produtoId !== produtoId)
            this.salvar()
        },

        atualizar(produtoId, quantidade) {
            const item = this.carrinho.find(i => i.produtoId === produtoId)
            if (item) {
                item.quantidade = Number(quantidade) || 0 // Garante que é um número
                this.salvar()
            }
        },

        // Aceita um parâmetro para decidir se tenta limpar o backend
        limpar(clearBackend = true) { 
            this.carrinho = []
            localStorage.removeItem('carrinho')
            
            if (clearBackend) {
                axios.post('http://localhost:3000/api/carrinho/limpar')
            }
        }
    }
})