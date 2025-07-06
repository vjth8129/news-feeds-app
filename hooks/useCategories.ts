import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useCategories() {
  const { request, loading, error } = useApi();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await request('/categories/getAllCategories', 'GET');
      if (result.data && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
      } else if (Array.isArray(result.data)) {
        setCategories(result.data);
      }
    })();
  }, []);

  return { categories, loading, error };
} 