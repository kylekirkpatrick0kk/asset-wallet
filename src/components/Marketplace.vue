<!-- filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/components/Marketplace.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useFetchData } from '../helpers/fetchData';
import DataTable from 'vue3-easy-data-table';
import type { Header } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string | null;
  explorer: string;
}

const { data, error, isLoading } = useFetchData<Asset[]>('https://api.coincap.io/v2/assets');

const headers: Header[] = [
  { text: "Rank", value: "rank" },
  { text: "Symbol", value: "symbol" },
  { text: "Name", value: "name" },
  { text: "Price (USD)", value: "priceUsd" },
  { text: "Market Cap (USD)", value: "marketCapUsd" },
  { text: "Volume (24Hr)", value: "volumeUsd24Hr" },
  { text: "Change (24Hr)", value: "changePercent24Hr" },
];

const searchField = ref("symbol");
const searchValue = ref("");
</script>

<template>
  <div>
    <h1>Marketplace</h1>
    <div v-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div>
        <span>Search field:</span>
        <select v-model="searchField">
          <option value="symbol">Symbol</option>
          <option value="name">Name</option>
        </select>
        
        <br/>

        <span>Search value: </span>
        <input type="text" v-model="searchValue">
      </div>

      <DataTable
        :headers="headers"
        :items="data || []"
        :loading="isLoading"
        :search-field="searchField"
        :search-value="searchValue"
      />
    </div>
  </div>
</template>

<style scoped>
.marketplace {
  padding: 1rem;
}
</style>