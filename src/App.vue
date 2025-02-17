<script setup lang="ts">
import { ref } from 'vue';
import Marketplace from './components/Marketplace.vue';
</script>

<template>
  <div id="app">
    <Marketplace />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: white;
}

button:not(.active):hover {
  background-color: #e0e0e0;
}

h1 {
  margin-top: 0;
}
</style>