import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useHome() {
  const { request, loading, error } = useApi();
  const [main, setMain] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await request('/user/home', 'GET');
      if (result.data) {
        setMain(result.data.main || []);
        setCategories(result.data.categories || []);
      }
    })();
  }, []);

  return { main, categories, loading, error };
} 