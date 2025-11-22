// frontend/src/api/client.js
import axios from 'axios';

// CRITICAL: Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// 🔥 DEBUG LOGGING - REMOVE IN PRODUCTION
console.log('═══════════════════════════════════════');
console.log('🔧 API Client Configuration');
console.log('═══════════════════════════════════════');
console.log('Environment Mode:', import.meta.env.MODE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Configured API_URL:', API_URL);
console.log('═══════════════════════════════════════');

// Validate API_URL
if (!API_URL) {
  console.error('❌ CRITICAL ERROR: VITE_API_URL is not defined!');
  console.error('📝 Add this to your .env.production file:');
  console.error('   VITE_API_URL=https://advision-backend-8u95.onrender.com/api');
  alert('⚠️ Backend API URL is not configured. Check browser console.');
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Request Interceptor - Add auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    // Add token to all requests except auth endpoints
    if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/registration')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log outgoing requests
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Setup Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh and errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error Response:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ API No Response:', {
        url: error.config?.url,
        message: error.message,
        code: error.code,
      });
      
      // Detect CORS/Network issues
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('🚫 NETWORK/CORS ISSUE DETECTED:');
        console.error('   1. Backend might be down');
        console.error('   2. CORS not configured correctly');
        console.error('   3. API_URL is wrong');
        console.error(`   4. Current API_URL: ${API_URL}`);
      }
    } else {
      console.error('❌ API Request Error:', error.message);
    }

    const originalRequest = error.config;

    // Handle 401 (token refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Received 401 - Attempting token refresh...');
      
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/registration') ||
          originalRequest.url.includes('/auth/google')) {
        console.log('⏭️  Skipping refresh for auth endpoint');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        console.log('⏳ Token refresh already in progress, queueing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        console.error('❌ No refresh token found - redirecting to login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        console.log('🔑 Attempting to refresh access token...');
        
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        console.log('✅ Token refreshed successfully');

        processQueue(null, access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        console.log('🚪 Redirecting to login...');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Export test function for debugging
export const testAPIConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_URL);
    const response = await apiClient.get('/');
    console.log('✅ API is reachable:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export { API_URL };
export default apiClient;
