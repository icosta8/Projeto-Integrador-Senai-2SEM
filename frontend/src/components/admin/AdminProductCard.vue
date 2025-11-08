<script setup>
import { computed } from 'vue'
import { Edit, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  product: Object
})

// Requisito RF-30: Alerta de estoque baixo
const isLowStock = computed(() => props.product.stock < 10)
</script>

<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-stock">
        EM ESTOQUE:
        <span
          :class="['stock-value', { 'low-stock': isLowStock }]"
        >
          {{ product.stock }} un
        </span>
        <span v-if="isLowStock" class="low-stock-alert">(Estoque baixo!)</span>
      </div>
    </div>
    <div class="product-actions">
      <button class="action-btn edit-btn">
        <Edit :size="18" /> Editar
      </button>
      <button class="action-btn delete-btn">
        <Trash2 :size="18" /> Excluir
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--admin-white);
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  text-align: center;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--admin-shadow-hover);
}

.product-image {
  max-width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-stock {
  font-size: 0.9rem;
  color: var(--admin-text-light);
  margin-bottom: 1rem;
}

.stock-value {
  font-weight: 700;
  color: var(--admin-success);
}

.stock-value.low-stock {
  color: var(--admin-danger);
}
.low-stock-alert {
  display: block;
  font-size: 0.8rem;
  color: var(--admin-danger);
  font-weight: 600;
}

.product-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #f0e6ff;
  color: var(--admin-primary);
}
.edit-btn:hover {
  background-color: var(--admin-primary);
  color: var(--admin-white);
}

.delete-btn {
  background-color: #ffeee6;
  color: var(--admin-danger);
}
.delete-btn:hover {
  background-color: var(--admin-danger);
  color: var(--admin-white);
}
</style>