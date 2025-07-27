import React from 'react';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Custom toast configuration
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#10B981',
        backgroundColor: '#1F2937',
        borderLeftWidth: 6,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 50,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        marginBottom: 4,
      }}
      text2Style={{
        color: '#D1D5DB',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#EF4444',
        backgroundColor: '#1F2937',
        borderLeftWidth: 6,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 50,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        marginBottom: 4,
      }}
      text2Style={{
        color: '#D1D5DB',
        fontSize: 14,
        fontFamily: 'Inter-Regular',
      }}
    />
  ),
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/interests" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
      <Toast config={toastConfig} />
    </>
  );
}