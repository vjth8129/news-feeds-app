import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useAllCategories() {
  const { request, loading, error } = useApi();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await request('/categories/allFormatted', 'GET');
      if (result.data && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
      } else if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        setCategories([]);
      }
    })();
  }, []);

  return { categories, loading, error };
} 