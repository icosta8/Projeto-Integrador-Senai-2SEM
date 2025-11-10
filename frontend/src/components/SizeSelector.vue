<template>
  <div class="size-selector">
    <button
      v-for="size in sizes"
      :key="size"
      :class="{ 'active': size === selectedSize }"
      :style="activeStyle(size)"
      @click="selectSize(size)"
    >
      {{ size }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  sizes: {
    type: Array,
    required: true,
    default: () => []
  },
  activeColor: {
    type: String,
    default: '#DB3D6C' 
  }
});

const selectedSize = ref('2L'); 

const selectSize = (size) => {
  selectedSize.value = size;
};

const activeStyle = (size) => {
  if (size === selectedSize.value) {
    return {
      backgroundColor: props.activeColor,
      borderColor: props.activeColor,
      color: 'white',
      transform: 'scale(1.05)'
    };
  }
  return {};
};
</script>

<style scoped>
.size-selector {
  display: flex;
  gap: 15px; 
  margin-top: 10px;
  font-family: "Montserrat", sans-serif;
}

button {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #777;
  font-family: "Montserrat", sans-serif;
}

button:not(.active):hover {
  background-color: #f9f9f9;
  border-color: #ccc;
}
</style>