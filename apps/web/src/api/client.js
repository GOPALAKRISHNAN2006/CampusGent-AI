import axios from 'axios';

let accessToken = null;
let refreshSubscribers = [];
let isRefreshing = false;

const REFRESH_TOKEN_KEY = 'campusgent_refresh_token';

export const getStoredRefreshToken = () => {
    try {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const setStoredRefreshToken = (token) => {
    try {
        if (token) {
            localStorage.setItem(REFRESH_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    } catch {}
};

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

/**
 * Normalizes the API base URL to ensure it always targets the correct /api/v1 endpoint.
 * Handles missing values, trailing slashes, and host URLs without /api/v1.
 */
export const getApiBaseUrl = () => {
    const raw = import.meta.env.VITE_API_URL;
    if (!raw || !raw.trim()) {
        return '/api/v1';
    }
    const trimmed = raw.trim().replace(/\/+$/, '');
    if (!trimmed.endsWith('/api/v1')) {
        return `${trimmed}/api/v1`;
    }
    return trimmed;
};

export const API_BASE = getApiBaseUrl();

export const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 60000, // 60s to accommodate Render free tier cold starts
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send HttpOnly cookies for refresh token
});

// Request Interceptor: Attach access token
apiClient.interceptors.request.use((config) => {
    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Seamless access token renewal on expiry (401)
apiClient.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    // Check if error is 401 and not retried yet
    if (error.response?.status === 401 &&
        error.response?.data?.error?.code === 'TOKEN_EXPIRED' &&
        !originalRequest.url?.includes('/auth/refresh') &&
        !originalRequest._retry) {
        originalRequest._retry = true;
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                // Trigger refresh rotation endpoint with both cookies AND fallback token
                const fallbackToken = getStoredRefreshToken();
                const response = await axios.post(
                    `${API_BASE}/auth/refresh`,
                    { refreshToken: fallbackToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(fallbackToken ? { 'x-refresh-token': fallbackToken } : {}),
                        },
                        withCredentials: true,
                    }
                );
                const newAccessToken = response.data.data.accessToken;
                const newRefreshToken = response.data.data.refreshToken;
                setAccessToken(newAccessToken);
                if (newRefreshToken) {
                    setStoredRefreshToken(newRefreshToken);
                }
                isRefreshing = false;
                // Notify queued subscribers
                refreshSubscribers.forEach((callback) => callback(newAccessToken));
                refreshSubscribers = [];
            }
            catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                setAccessToken(null);
                setStoredRefreshToken(null);
                // Redirect to login or raise event
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(refreshError);
            }
        }
        // Queue requests while token is refreshing
        const retryOriginalRequest = new Promise((resolve) => {
            refreshSubscribers.push((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
            });
        });
        return retryOriginalRequest;
    }
    return Promise.reject(error);
});
