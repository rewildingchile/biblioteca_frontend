 
import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'
import notifications from "./notifications";
import auth from './auth';
import centrocuentas from './visibilidadcentrocuentas';
import centros from './centros';
import cuentas from './cuentas';
 
const store = createStore({
  state: {
   
    
 
  },
  getters: {
    
 
    
    tokens: (state) => {
      return state.tokens;
    },
     
     
  },
  actions: {
  
  
    tokens(context, tokens) {
    //  //console.log("commit ", token);
      context.commit("tokens", tokens);
    },
    
  },
  mutations: {
    
   
    tokens(state, tokens) {
      state.tokens = tokens;
    },
     logout(state) {
          state.tokens = null;
        },
  },  
  plugins: [ createPersistedState({
      storage: window.sessionStorage, // ⚠️ aquí está la clave
    }),],
  modules: {
    auth,
    notifications,
    centrocuentas,
    centros,
    cuentas,
    
   
  },
});
export default store;
