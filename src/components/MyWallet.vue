<!-- filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/components/MyAssets.vue -->
<script setup lang="ts">
import { useFetchData } from '../helpers/fetchData';

const { data, error, isLoading } = useFetchData();
</script>

<template>
  <div>
    <h1>My Wallet</h1>
  </div>
</template>