import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLogin } from '@/hooks/useLogin';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { CircleHelp as HelpCircle, Eye, EyeOff } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Add a type for the decoded token
interface DecodedToken {
  userId?: string;
  [key: string]: any;
}

// For proper Google auth session handling
WebBrowser.maybeCompleteAuthSession();

// Social login icons as SVG components
const GoogleIcon = () => (
  <View style={styles.socialIcon}>
    <Text style={styles.socialIconText}>G</Text>
  </View>
);

const FacebookIcon = () => (
  <View style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
    <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>f</Text>
  </View>
);

const GOOGLE_CLIENT_ID = '288187643173-clfh5t0df5jvcidtj652aeldmdev7mt8.apps.googleusercontent.com';
// No client secret for Expo Go/mobile!
const EXPO_USERNAME = 'vijith-dev';
const EXPO_APP_SLUG = 'bolt-expo-nativewind';
const REDIRECT_URI = `https://auth.expo.io/@${EXPO_USERNAME}/${EXPO_APP_SLUG}`;

// Helper to decode JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { login } = useLogin();
  const { socialAuth } = useSocialAuth();

  // Google Auth Request (NO clientSecret)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ['profile', 'email'],
  });

  // Validation helpers
  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle email/password login
  const handleLogin = async () => {
    if (!validateFields()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.data?.token) {
        await AsyncStorage.setItem('token', result.data.token);
        const decoded = parseJwt(result.data.token);
        if (decoded?.userId) {
          await AsyncStorage.setItem('userId', decoded.userId);
        }
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          position: 'top',
          visibilityTime: 3000,
        });
        router.replace('/(tabs)');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: result.error || 'Invalid email or password',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Something went wrong. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handler
  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      await promptAsync();
    } else if (provider === 'Facebook') {
      Alert.alert('Coming Soon', 'Facebook login will be available soon!');
    }
  };

  // Handle Google login response
  useEffect(() => {
    if (
      response?.type === 'success' &&
      (response.authentication?.accessToken || response.params?.access_token) &&
      (response.authentication?.idToken || response.params?.id_token)
    ) {
      (async () => {
        try {
          const idToken = response.authentication?.idToken || response.params?.id_token;
          const accessToken = response.authentication?.accessToken || response.params?.access_token;
          const result = await socialAuth({
            provider: 'google',
            id_token: idToken,
            accessToken: accessToken,
          });
          if (result.data?.token) {
            await AsyncStorage.setItem('token', result.data.token);
            const decoded: DecodedToken = parseJwt(result.data.token);
            if (decoded?.userId) {
              await AsyncStorage.setItem('userId', decoded.userId);
            }
            Toast.show({
              type: 'success',
              text1: 'Google Login Successful',
              text2: 'Welcome!',
              position: 'top',
              visibilityTime: 3000,
            });
            router.replace('/(tabs)');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Google Login Failed',
              text2: result.error || 'Could not login with Google',
              position: 'top',
              visibilityTime: 4000,
            });
          }
        } catch (error: any) {
          Toast.show({
            type: 'error',
            text1: 'Google Login Error',
            text2: error?.message || 'Unknown error',
            position: 'top',
            visibilityTime: 4000,
          });
        }
      })();
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Newsify</Text>
        <TouchableOpacity style={styles.helpButton}>
          <HelpCircle color="#8E8E93" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={text => { setEmail(text); if (errors.email) { const { email, ...rest } = errors; setErrors(rest); } }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={text => { setPassword(text); if (errors.password) { const { password, ...rest } = errors; setErrors(rest); } }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 18 }}
              onPress={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff size={20} color="#8E8E93" /> : <Eye size={20} color="#8E8E93" />}
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </TouchableOpacity>
          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
        </View>

        <Text style={styles.orText}>Or login with</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
            disabled={!request}
          >
            <GoogleIcon />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Facebook')}
          >
            <FacebookIcon />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
          <Text style={styles.signupText}>
            New user? Click here to sign up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  helpButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3a3f4e',
  },
  loginButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  orText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#2a2f3e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#3a3f4e',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  socialIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  signupText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
});