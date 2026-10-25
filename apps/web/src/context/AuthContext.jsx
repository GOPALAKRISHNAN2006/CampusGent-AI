import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAccessToken, getStoredRefreshToken, setStoredRefreshToken } from '../api/client.js';
const AuthContext = createContext(undefined);
let authInitializationPromise = null;

const initializeAuth = async () => {
    if (!authInitializationPromise) {
        authInitializationPromise = (async () => {
            const fallbackToken = getStoredRefreshToken();
            const refreshResponse = await apiClient.post(
                '/auth/refresh',
                { refreshToken: fallbackToken },
                {
                    headers: fallbackToken ? { 'x-refresh-token': fallbackToken } : {},
                }
            );
            const token = refreshResponse.data.data.accessToken;
            const newRefreshToken = refreshResponse.data.data.refreshToken;
            setAccessToken(token);
            if (newRefreshToken) {
                setStoredRefreshToken(newRefreshToken);
            }
            const meResponse = await apiClient.get('/auth/me');
            return meResponse.data.data;
        })().finally(() => {
            authInitializationPromise = null;
        });
    }
    return authInitializationPromise;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Load current user context on mount
    useEffect(() => {
        let active = true;
        const initAuth = async () => {
            try {
                const userData = await initializeAuth();
                if (active) setUser(userData);
            }
            catch (error) {
                // Clean session
                setAccessToken(null);
                setStoredRefreshToken(null);
                if (active) setUser(null);
            }
            finally {
                if (active) setIsLoading(false);
            }
        };
        initAuth();
        // Event listener for global logouts triggered by interceptors
        const handleGlobalLogout = () => {
            setUser(null);
            setAccessToken(null);
            setStoredRefreshToken(null);
        };
        window.addEventListener('auth-logout', handleGlobalLogout);
        return () => {
            active = false;
            window.removeEventListener('auth-logout', handleGlobalLogout);
        };
    }, []);
    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const { accessToken: token, refreshToken: rToken, user: userData } = response.data.data;
            setAccessToken(token);
            if (rToken) {
                setStoredRefreshToken(rToken);
            }
            setUser(userData);
            return userData;
        }
        catch (error) {
            setAccessToken(null);
            setStoredRefreshToken(null);
            setUser(null);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    };
    const registerUser = async (data) => {
        await apiClient.post('/auth/register', data);
    };
    const logout = async () => {
        setIsLoading(true);
        try {
            const fallbackToken = getStoredRefreshToken();
            await apiClient.post('/auth/logout', { refreshToken: fallbackToken }, {
                headers: fallbackToken ? { 'x-refresh-token': fallbackToken } : {},
            });
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            setAccessToken(null);
            setStoredRefreshToken(null);
            setUser(null);
            setIsLoading(false);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { user, isLoading, login, registerUser, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
