import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useFetchData<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      data.value = response.data.data;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchData);

  return { data, error, isLoading };
}