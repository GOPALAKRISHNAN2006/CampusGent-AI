import axios from 'axios';
let accessToken = null;
let refreshSubscribers = [];
let isRefreshing = false;
export const setAccessToken = (token) => {
    accessToken = token;
};
export const getAccessToken = () => accessToken;
export const apiClient = axios.create({
    baseURL: '/api/v1',
    timeout: 15000,
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
                // Trigger refresh rotation endpoint
                const response = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
                const newAccessToken = response.data.data.accessToken;
                setAccessToken(newAccessToken);
                isRefreshing = false;
                // Notify queued subscribers
                refreshSubscribers.forEach((callback) => callback(newAccessToken));
                refreshSubscribers = [];
            }
            catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                setAccessToken(null);
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
