<!-- filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/components/MyAssets.vue -->
<script setup lang="ts">
import { useFetchData } from '../helpers/fetchAssetData';

const { data, error, isLoading } = useFetchData();
</script>

<template>
  <div>
    <h1>My Wallet</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>