<script setup lang="ts">
import { useFetchData } from '../helpers/fetchData';

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
</script>

<template>
  <div>
    <h1>Marketplace</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rank</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>Supply</th>
            <th>Market Cap (USD)</th>
            <th>Volume (24Hr)</th>
            <th>Price (USD)</th>
            <th>Change (24Hr)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in data" :key="asset.id">
            <td>{{ asset.id }}</td>
            <td>{{ asset.rank }}</td>
            <td>{{ asset.symbol }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.supply }}</td>
            <td>{{ asset.marketCapUsd }}</td>
            <td>{{ asset.volumeUsd24Hr }}</td>
            <td>{{ asset.priceUsd }}</td>
            <td>{{ asset.changePercent24Hr }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>