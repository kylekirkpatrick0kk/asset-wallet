<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

interface HistoricalData {
  priceUsd: string;
  time: number;
}

const props = defineProps<{ assetId: string }>();
const interval = 'd1';

const data = ref<HistoricalData[]>([]);
const error = ref<Error | null>(null);
const isLoading = ref(false);

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Price (USD)',
      data: [] as number[],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
});

const fetchHistoricalData = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get(`https://api.coincap.io/v2/assets/${props.assetId}/history?interval=${interval}`);
    data.value = response.data.data;
    chartData.value.labels = data.value.map(item => new Date(item.time).toLocaleDateString());
    chartData.value.datasets[0].data = data.value.map(item => parseFloat(item.priceUsd));
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Unknown error occurred');
  } finally {
    isLoading.value = false;
  }
};

// watch effect hook to fetch historical data when the assetId changes
watchEffect(() => {
  if (props.assetId) {
    fetchHistoricalData();
  }
});
</script>

<template>
  <div>
    <h1>Historical Asset Data</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <Line :data="chartData" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 40vh;
  width: 80vw;
}
</style>