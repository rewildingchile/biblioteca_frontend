 
import axios from "axios";
 import router from "@/router";
 import store from "@/store";
const api = axios.create({  baseURL: import.meta.env.VITE_DJANGO_API_URL});


api.interceptors.request.use(
  (config) => {
    
  const token =  store.state.auth.tokens.access;
  
 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
 error => Promise.reject(error)
);

// === Interceptor de respuesta ===
// Detecta si el token expiró y lo renueva automáticamente
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const status = error.response?.status;
 
    // Si el error fue 401 (no autorizado) y no se ha reintentado aún
    if ( status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = store.state.auth.tokens.refresh;
         
        if (!refresh) throw new Error('No refresh token')

        // Pide un nuevo access token
       
  
        console.log('llamando refresh token')
        const res = await axios.post(
      `${import.meta.env.VITE_DJANGO_API_URL}/api/v1/token/refresh/`,
      { refresh }
    )
        // Guarda el nuevo token
        store.state.auth.tokens.access= res.data.payload.access 
        
        // Actualiza el header y reintenta la request original
        api.defaults.headers.common['Authorization'] = `Bearer ${store.state.auth.tokens.access}`
        originalRequest.headers['Authorization'] = `Bearer ${store.state.auth.tokens.access}`
 
        return api(originalRequest)
      } catch (err) {
         
        console.error('No se pudo refrescar el token', err)
        
         store.dispatch("clearUserLogin");
        //[vuex] unknown action type: auth/clearUserLogin
         

         
        router.push("/");
        return Promise.reject(err);
      
      }
    }
     let handled=false;
     switch (status) {
      case 401:
       
         console.error("error 401");
         window.location.href='/Logout';
         store.dispatch("notifications/notifyError", "Token inválido o expirado");
         
         break;
      case 400:
        store.dispatch("notifications/notifyError", "Solicitud incorrecta (400).");
        handled = true;
        break;
      case 403:
        alert('no tiene permisos de lectura')
        handled = true;
        break;
      case 404:
        store.dispatch("notifications/notifyError", "Recurso no encontrado (404).");
        handled = true;
        break;
      case 500:
        store.dispatch("notifications/notifyError", "Error interno del servidor (500).");
        handled = true;
        break;
      default:
        store.dispatch("notifications/notifyError", `Error inesperado (${status}).`);
        handled = true;
    }

    // interceptor siempre debe devolver una promesa
    if (handled){ return Promise.resolve(null)}
    return Promise.reject(error);
    
  }
)


export default api;