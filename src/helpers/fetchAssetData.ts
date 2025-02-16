// filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/composables/useFetchData.ts
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

export function useFetchData() {
  const data = ref<Asset[] | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(true);

  const fetchAssetData = async () => {
    try {
      const response = await axios.get('https://api.coincap.io/v2/assets');
      data.value = response.data.data;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchAssetData);

  return { data, error, isLoading };
}