<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String
})
</script>

<template>
  <div class="stat-card">
    <div class="icon-wrapper">
      <slot></slot> </div>
    <div class="stat-info">
      <span class="stat-value">{{ value }}</span>
      <h3 class="stat-title">{{ title }}</h3>
      <p class="stat-subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--admin-white);
  padding: 1.5rem;
  border-radius: var(--admin-radius);
  box-shadow: var(--admin-shadow);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 240px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--admin-shadow-hover);
}

.icon-wrapper {
  padding: 0.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0e6ff; /* Fundo do ícone */
  color: var(--admin-primary);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--admin-text);
  line-height: 1.2;
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--admin-text);
  margin: 0.25rem 0;
}

.stat-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-light);
}
</style>