<script setup lang="ts">
import { ref } from 'vue';
import Marketplace from './components/Marketplace.vue';
import MyWallet from './components/MyWallet.vue';

const showMarketplace = ref(true);
</script>

<template>
  <div id="app">
    <button @click="showMarketplace = !showMarketplace">
      {{ showMarketplace ? 'Show My Assets' : 'Show Marketplace' }}
    </button>
    <component :is="showMarketplace ? Marketplace : MyAssets" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
