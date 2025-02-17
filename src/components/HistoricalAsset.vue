<!-- filepath: /c:/Users/kylek/development/interviews/asset-wallet/src/components/HistoricalAsset.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFetchData } from '../composables/fetchData';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

interface HistoricalData {
  priceUsd: string;
  time: number;
}

const props = defineProps<{ assetId: string }>();
const interval = 'd1';
const { data, error, isLoading } = useFetchData<HistoricalData[]>(`https://api.coincap.io/v2/assets/${props.assetId}/history?interval=${interval}`);

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

watch(data, (newData) => {
  if (newData) {
    chartData.value.labels = newData.map(item => new Date(item.time).toLocaleDateString());
    chartData.value.datasets[0].data = newData.map(item => parseFloat(item.priceUsd));
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