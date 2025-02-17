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

// use the asset interface to define the data type for the useFetchData hook
const { data, error, isLoading } = useFetchData<Asset[]>('https://api.coincap.io/v2/assets');

// creates table header to map the rows when we display the table
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
const wallet = ref<WalletItem[]>([]);
const selectedAssetIdForWallet = ref<string | null>(null);
const amount = ref<number | null>(null);
const removeAmount = ref<number | null>(null);

// retreives the local storage wallet amount when the component is mounted
onMounted(() => {
  const savedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
  if (savedWallet) {
    try {
      wallet.value = JSON.parse(savedWallet);
    } catch (e) {
      console.error('Error loading wallet data:', e);
      wallet.value = [];
    }
  }
});

// watches if the wallet changes and makes the setItem callback to update local storage
watch(
  wallet,
  (newWallet) => {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(newWallet));
  },
  { deep: true } // Watch for nested changes in the wallet array
);

const handleRowClick = (item: ClickRowArgument) => {
  selectedAssetId.value = item.id;
};

// wallet asset management functions
const addAsset = () => {
  if (!selectedAssetIdForWallet.value || amount.value === null || amount.value <= 0) return;
  const existingItem = wallet.value.find(item => item.id === selectedAssetIdForWallet.value);
  if (existingItem) {
    existingItem.amount += amount.value;
  } else {
    wallet.value.push({ id: selectedAssetIdForWallet.value, amount: amount.value });
  }
  amount.value = null;
};

const removeAsset = (id: string, amountToRemove: number | null) => {
  if (amountToRemove === null || amountToRemove <= 0) return;
  const existingItem = wallet.value.find(item => item.id === id);
  if (existingItem) {
    existingItem.amount -= amountToRemove;
    if (existingItem.amount <= 0) {
      wallet.value = wallet.value.filter(item => item.id !== id);
    }
  }
  removeAmount.value = null;
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
          <div class="search-bar">
            <div class="search-field">
              <label for="searchField">Search field:</label>
              <select id="searchField" v-model="searchField">
                <option value="symbol">Symbol</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div class="search-value">
              <label for="searchValue">Search value:</label>
              <input id="searchValue" type="text" v-model="searchValue">
            </div>
          </div>

          <DataTable
            :headers="headers"
            :items="data || []"
            :loading="isLoading"
            :search-field="searchField"
            :search-value="searchValue"
            @click-row="handleRowClick"
            alternating
            border-cell
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
          <input type="number" v-model.number="amount" placeholder="Amount to Add" step="0.01" />
          <button id="addButton" @click="addAsset">Add</button>
        </div>
        <ul>
          <li v-for="item in wallet" :key="item.id">
            {{ item.amount }} {{ data.find(asset => asset.id === item.id)?.symbol }} - 
            ${{ (item.amount * parseFloat(data.find(asset => asset.id === item.id)?.priceUsd || '0')).toFixed(2) }}
            <input type="number" v-model.number="removeAmount" placeholder="Amount to Remove" step="0.01" />
            <button id="removeButton" @click="removeAsset(item.id, removeAmount)">Remove</button>
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
  margin-left: 2em;
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 123, 255, 0.1);
  max-height: 500px;
  overflow-y: auto;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-field,
.search-value {
  display: flex;
  flex-direction: column;
}

.search-field label,
.search-value label {
  margin-bottom: 0.5rem;
}

.search-field select,
.search-value input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#addButton {
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#addButton:hover {
  background-color: #0056b3;
}

#removeButton {
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#removeButton:hover {
  background-color: #c82333;
}
</style>