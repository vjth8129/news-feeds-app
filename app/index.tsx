import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/auth/interests" />;
  }

  return <Redirect href="/(tabs)" />;
}