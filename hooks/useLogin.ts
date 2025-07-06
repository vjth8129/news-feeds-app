import { useApi } from './useApi';
import { useState } from 'react';

export function useLogin() {
  const { request, loading, error } = useApi();

  async function login(email: string, password: string) {
    const result = await request('/auth/login', 'POST', { email, password });
    return result;
  }

  return { login, loading, error };
} 