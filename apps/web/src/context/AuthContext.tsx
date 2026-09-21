import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RegisterInput, LoginInput } from '@campusgent/shared';
import { apiClient, setAccessToken, getAccessToken } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN' | 'SUPER_ADMIN';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  registerUser: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user context on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to obtain a new access token using refresh cookie
        const refreshResponse = await apiClient.post('/auth/refresh');
        const token = refreshResponse.data.data.accessToken;
        setAccessToken(token);

        // Fetch user information
        const meResponse = await apiClient.get('/auth/me');
        setUser(meResponse.data.data);
      } catch (error) {
        // Clean session
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Event listener for global logouts triggered by interceptors
    const handleGlobalLogout = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth-logout', handleGlobalLogout);
    return () => window.removeEventListener('auth-logout', handleGlobalLogout);
  }, []);

  const login = async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { accessToken: token, user: userData } = response.data.data;
      setAccessToken(token);
      setUser(userData);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (data: RegisterInput) => {
    await apiClient.post('/auth/register', data);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
