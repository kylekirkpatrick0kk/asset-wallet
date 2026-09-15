import { ref, onMounted } from 'vue';
import { fetchCoinCapData } from './coinCapClient';

export function useFetchData<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(true);

  const fetchData = async () => {
    try {
      data.value = await fetchCoinCapData<T>(url);
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchData);

  return { data, error, isLoading };
}