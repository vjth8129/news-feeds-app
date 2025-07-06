import { useApi } from './useApi';

export function useSignup() {
  const { request, loading, error } = useApi();

  async function signup(userData: { email: string; password: string; [key: string]: any }) {
    const result = await request<{ token: string }>('/auth/signup', 'POST', userData);
    console.log('result', result);
    return result;
  }

  return { signup, loading, error };
} 