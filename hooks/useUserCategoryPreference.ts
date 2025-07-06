import { useApi } from './useApi';
import { useState } from 'react';

export function useUserCategoryPreference() {
  const { request } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function savePreferences(userId: string, categories: any[]) {
    setLoading(true);
    setError(null);
    try {
      const result = await request('/user/addUserCategoryPreference', 'POST', {
        userId,
        categories,
      });
      if (result.error) setError(result.error);
      return result;
    } catch (e: any) {
      setError(e.message || 'Unknown error');
      return { error: e.message || 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }

  return { savePreferences, loading, error };
} 