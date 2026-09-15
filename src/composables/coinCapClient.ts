import axios from 'axios';

const COINCAP_API_BASE_URL = 'https://rest.coincap.io/v3';

export async function fetchCoinCapData<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const apiKey = import.meta.env.VITE_COINCAP_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_COINCAP_API_KEY. Add it to your .env file.');
  }

  const response = await axios.get(`${COINCAP_API_BASE_URL}${path}`, {
    params: { ...params, apiKey },
  });

  return response.data.data as T;
}