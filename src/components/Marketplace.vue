<!-- filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/components/Marketplace.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useFetchData } from '../composables/fetchData';
import DataTable from 'vue3-easy-data-table';
import type { Header, ClickRowArgument } from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import HistoricalAsset from './HistoricalAsset.vue';

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

interface WalletItem {
  id: string;
  amount: number;
}

const WALLET_STORAGE_KEY = 'crypto-wallet-data';

const { data, error, isLoading } = useFetchData<Asset[]>('https://api.coincap.io/v2/assets');

const headers: Header[] = [
  { text: "Rank", value: "rank" },
  { text: "Symbol", value: "symbol" },
  { text: "Name", value: "name", sortable: true },
  { text: "Price (USD)", value: "priceUsd" },
  { text: "Market Cap (USD)", value: "marketCapUsd" },
  { text: "Volume (24Hr)", value: "volumeUsd24Hr" },
  { text: "Change (24Hr)", value: "changePercent24Hr" },
];

const searchField = ref("name");
const searchValue = ref("");
const selectedAssetId = ref<string | null>(null);

const handleRowClick = (item: ClickRowArgument) => {
  selectedAssetId.value = item.id;
};

const wallet = ref<WalletItem[]>([]);
const selectedAssetIdForWallet = ref<string | null>(null);
const amount = ref<number>(0);

// Load wallet data from localStorage when component mounts
onMounted(() => {
  const savedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
  if (savedWallet) {
    try {
      wallet.value = JSON.parse(savedWallet);
    } catch (e) {
      console.error('Error loading wallet data:', e);
      // Initialize empty wallet if data is corrupted
      wallet.value = [];
    }
  }
});

// Watch for changes to wallet and save to localStorage
watch(
  wallet,
  (newWallet) => {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(newWallet));
  },
  { deep: true } // Watch for nested changes in the wallet array
);

const addAsset = () => {
  if (!selectedAssetIdForWallet.value || amount.value <= 0) return;
  const existingItem = wallet.value.find(item => item.id === selectedAssetIdForWallet.value);
  if (existingItem) {
    existingItem.amount += amount.value;
  } else {
    wallet.value.push({ id: selectedAssetIdForWallet.value, amount: amount.value });
  }
  amount.value = 0;
};

const removeAsset = (id: string, amountToRemove: number) => {
  const existingItem = wallet.value.find(item => item.id === id);
  if (existingItem) {
    existingItem.amount -= amountToRemove;
    if (existingItem.amount <= 0) {
      wallet.value = wallet.value.filter(item => item.id !== id);
    }
  }
};

const totalValue = computed(() => {
  return wallet.value.reduce((total, item) => {
    const asset = data.value?.find(asset => asset.id === item.id);
    if (asset) {
      return total + item.amount * parseFloat(asset.priceUsd);
    }
    return total;
  }, 0);
});
</script>

<template>
  <div class="marketplace">
    <div class="content">
      <div class="table-section">
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
            @click-row="handleRowClick"
          />
          <div v-if="selectedAssetId">
            <HistoricalAsset :assetId="selectedAssetId" />
          </div>
        </div>
      </div>
      <div class="wallet-section">
        <h2>My Wallet</h2>
        <div>
          <select v-model="selectedAssetIdForWallet">
            <option v-for="asset in data" :key="asset.id" :value="asset.id">{{ asset.name }}</option>
          </select>
          <input type="number" v-model.number="amount" placeholder="Amount" />
          <button @click="addAsset">Add</button>
        </div>
        <ul>
          <li v-for="item in wallet" :key="item.id">
            {{ item.amount }} {{ data.find(asset => asset.id === item.id)?.symbol }} - 
            ${{ (item.amount * parseFloat(data.find(asset => asset.id === item.id)?.priceUsd || '0')).toFixed(2) }}
            <button @click="removeAsset(item.id, 1)">Remove 1</button>
          </li>
        </ul>
        <h3>Total Value: ${{ totalValue.toFixed(2) }}</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marketplace {
  display: flex;
  gap: 2rem;
}

.content {
  display: flex;
  width: 100%;
}

.table-section {
  flex: 3;
}

.wallet-section {
  flex: 1;
  padding: 1rem;
  border-left: 1px solid #ccc;
}
</style>