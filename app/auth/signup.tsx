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
import { useSignup } from '@/hooks/useSignup';
import { HelpCircle, Eye, EyeOff } from 'lucide-react-native';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAMPLE_GOOGLE_CLIENT_ID = '616886846838-8lcjiru22ps0u01vph9hpbfbcvilq3nn.apps.googleusercontent.com'; // Sample client ID

// Add a type for the decoded token
interface DecodedToken {
  userId?: string;
  [key: string]: any;
}

function parseJwt(token: string): any {
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

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup } = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: SAMPLE_GOOGLE_CLIENT_ID,
  });

  // Validation helpers
  const validateEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters and contain a letter and a number';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateFields()) return;
    setIsLoading(true);
    try {
      const result = await signup({ email, password, firstName, lastName });
      if (result.data && result.data.token) {
        await AsyncStorage.setItem('token', result.data.token);
        // Parse token to get userId
        const decoded: DecodedToken = parseJwt(result.data.token);
        if (decoded && decoded.email) {
          await AsyncStorage.setItem('userId', decoded.email);
        }
        router.replace('/auth/interests');
      } else {
        setErrors({ form: result.error || 'Please try again' });
      }
    } catch (error: any) {
      setErrors({ form: error?.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login icons as SVG components (copied from login.tsx)
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
        <Text style={styles.title}>Sign up</Text>

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

          <View style={{ position: 'relative' }}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8E8E93"
              value={confirmPassword}
              onChangeText={text => { setConfirmPassword(text); if (errors.confirmPassword) { const { confirmPassword, ...rest } = errors; setErrors(rest); } }}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 16, top: 18 }}
              onPress={() => setShowConfirmPassword(v => !v)}
            >
              {showConfirmPassword ? <EyeOff size={20} color="#8E8E93" /> : <Eye size={20} color="#8E8E93" />}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#8E8E93"
            value={firstName}
            onChangeText={text => { setFirstName(text); if (errors.firstName) { const { firstName, ...rest } = errors; setErrors(rest); } }}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#8E8E93"
            value={lastName}
            onChangeText={text => { setLastName(text); if (errors.lastName) { const { lastName, ...rest } = errors; setErrors(rest); } }}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>Or sign up with</Text>
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

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginText}>
            Already have an account? Click here to sign in
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
    paddingTop: 40,
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
  signupButton: {
    backgroundColor: '#4285f4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loginText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
  errorText: {
    color: '#ff4d4f',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
});