import axios from 'axios';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

let refresh = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;

      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/token/refresh/', { token: refreshToken });

      if (response.status === 200) {
        localStorage.setItem('access_token', newToken);
        
        // Update your token storage
        localStorage.setItem('authToken', newToken);
        
        // Retry the original request with the new token
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(error.config);
      }
    }
    
    refresh = false;
    return Promise.reject(error);
  }
);

export default axiosInstance;
