import axios from "axios";

const api = axios.create();

// 🔐 Agregar token automáticamente a cada request
api.interceptors.request.use(() => {
  console.log('interceptor: call axios')
});

// ♻️ Interceptar errores 401 y refrescar el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
 console.log('interceptor errpr')
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('interceptor 401')
    }
  
  }
);

export default api;
