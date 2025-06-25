import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  interests: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  setInterests: (interests: string[]) => void;
  logout: () => void;
}

// Mock API calls
const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@listenup.com' && password === 'password') {
    return {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      interests: ['Technology', 'Science', 'Business']
    };
  }
  return null;
};

const mockSignup = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    interests: []
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,

  login: async (email: string, password: string) => {
    try {
      const user = await mockLogin(email, password);
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          hasCompletedOnboarding: user.interests.length > 0 
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  signup: async (userData) => {
    try {
      const user = await mockSignup(userData);
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          hasCompletedOnboarding: false 
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  setInterests: (interests: string[]) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, interests };
      set({ 
        user: updatedUser, 
        hasCompletedOnboarding: true 
      });
    }
  },

  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false, 
      hasCompletedOnboarding: false 
    });
  }
}));