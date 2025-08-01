import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load BASE_URL from environment variable or use default
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://3.109.1.187/api';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  async function request<T = any>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    setLoading(true);
    setError(null);
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

      // Add Authorization header if token exists and endpoint is not an auth endpoint
      if (token && !endpoint.includes('auth')) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'API error');
        return { error: json.message || 'API error' };
      }
      return { data: json };
    } catch (e: any) {
      setError(e.message || 'Network error');
      return { error: e.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  }

  return { request, loading, error };
} 