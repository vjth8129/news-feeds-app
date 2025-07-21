import { useApi } from './useApi';

export function useSocialAuth() {
  const { request, loading, error } = useApi();

  async function socialAuth({ provider, id_token, accessToken }: { provider: string; id_token: string; accessToken: string }) {
    const result = await request('/auth/social', 'POST', { provider, id_token, accessToken });
    return result;
  }

  return { socialAuth, loading, error };
} 