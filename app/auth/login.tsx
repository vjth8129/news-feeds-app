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
import { useAuthStore } from '@/stores/authStore';
import { CircleHelp as HelpCircle } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';

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

const AppleIcon = () => (
  <View style={[styles.socialIcon, { backgroundColor: '#000000' }]}>
    <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>🍎</Text>
  </View>
);

const SAMPLE_GOOGLE_CLIENT_ID = '616886846838-8lcjiru22ps0u01vph9hpbfbcvilq3nn.apps.googleusercontent.com'; // Sample client ID

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: SAMPLE_GOOGLE_CLIENT_ID,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handler
  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      promptAsync();
    } else if (provider === 'Facebook') {
      Alert.alert('Coming Soon', 'Facebook login will be available soon!');
    }
  };

  // Handle Google login response
  useEffect(() => {
    if (
      response?.type === 'success' &&
      response.authentication &&
      response.authentication.accessToken
    ) {
      (async () => {
        try {
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${response.authentication!.accessToken}` },
          });
          const userInfo = await userInfoResponse.json();
          mockSocialLogin('Google', userInfo);
        } catch (error: any) {
          Alert.alert('Google Login Error', error?.message || 'Unknown error');
        }
      })();
    }
  }, [response]);

  // Mock social login function
  const mockSocialLogin = (provider: string, userInfo: any) => {
    // Here you would call your API. For now, just show an alert with the info.
    Alert.alert(
      `${provider} Login Success`,
      `Name: ${userInfo.name || userInfo.given_name || ''}\nEmail: ${userInfo.email || ''}`
    );
  };

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
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

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
        </View>

        <Text style={styles.orText}>Or login with</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => handleSocialLogin('Google')}
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

        {/* <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Apple')}
        >
          <AppleIcon />
          <Text style={styles.socialButtonText}>Apple</Text>
        </TouchableOpacity> */}

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
});