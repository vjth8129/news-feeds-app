import { useEffect, useState } from 'react';
import { useApi } from './useApi';

export function useAllCategories() {
  const { request, loading, error } = useApi();
  const [categories, setCategories] = useState<any[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLocalError(null);
      // Try the working endpoint first, then fallback to allFormatted
      let result = await request('/categories/getAllCategories', 'GET');
      
      if (result.error) {
        console.error('useAllCategories getAllCategories error:', result.error);
        // Try fallback endpoint
        result = await request('/categories/allFormatted', 'GET');
        if (result.error) {
          console.error('useAllCategories allFormatted error:', result.error);
          setLocalError(result.error);
          return;
        }
      }
      
      if (result.error) {
        console.error('useAllCategories error:', result.error);
        setLocalError(result.error);
        return;
      }
      
      console.log('useAllCategories API response:', result.data);
      
      if (result.data && Array.isArray(result.data.categories)) {
        setCategories(result.data.categories);
      } else if (Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        console.log('useAllCategories response:', result.data);
        setCategories([]);
      }
    })();
  }, []);

  return { categories, loading, error: localError || error };
} 