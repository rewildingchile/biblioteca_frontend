// divisiones.js

import axios from "axios";
import api from "@/api/axios";
import { useParseJwt } from "@/composables/useParseJwt";
const state = {
    userLogin: {},
    statusLogin:{},
    QR:'',
    tokens:'',
    userId:0,
 
  };
  const getters = {
    
    
  }
  const mutations = {
    setStatusLogin(state, status) {
       console.log('status login',status)
        state.statusLogin = status;
      
    },
    setUserLogin(state, datos) {
      
        state.userLogin = { ...datos };
      
    },
    setTokens(state, tokens) {
        state.tokens = tokens;
      
    },
    clearUserLogin(state ) {
        console.log('LIMPIA USERLOGIN')
        state.userLogin = { };
      
    },
    setQR(state, qr) {
        state.QR = qr;
    },
  };
  
  const actions = 
  {
    clearUserLogin({ commit }) {
      
        commit("clearUserLogin")
      
    },
    async DEPRECATED_login({ commit }, { e, p }) {
      try {
         
        const data = {  username: e,
                        password: p
        };
       
        const url = "api/v1/login/";
  
        const resp = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            data
          },
        });
      
        let tokens='';
      
        const status=resp.data.status;
        
        switch (status) {
            case 200:  

              tokens=resp.data.payload.tokens;
              commit('setTokens',tokens);
              commit('setPlanCuentas',resp.data.payload.info.cuentas);
              commit('setCentros',resp.data.payload.info.centros);
              commit('setStatusLogin', {   'status':status  });

              
            
              
                                  /*
                                  
                                   'userId':resp.data.payload.info.id, 
                                    'nombres': resp.data.payload.info.nombres, 
                                    'apellido1':  resp.data.payload.info.apellido1 */
              break;
         
          }
         
        

      } catch (err) {
     
        console.log( err);

     
      }
    },
  
    async login_QR({ commit }, { e, p }) {
      try {
          
 

        const data = {  username: e,
                        password: p
        };
       
        const url = import.meta.env.VITE_DJANGO_API_URL + "/api/v2/login/";
  
        const resp = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
        
          },
        });
      
        let tokens='';
        const status=resp.data.status;
        console.log('status',resp)

        const { parseJwt } = useParseJwt();
        tokens=resp.data.payload.tokens;
        // parsea token temporal
        const tk = parseJwt(tokens.access)
      

           
        commit('setTokens',tokens);
        commit('setStatusLogin', {  'status':status  });


        switch (status) 
        {
            // JavaScript no permite declaraciones léxicas (let, const) directamente en un case porque todos los case comparten el mismo scope.
            case "OTP_SETUP_REQUIRED":  {
               
              if (!tk["2fa"]){
                 commit('setQR',resp.data.payload.qr);
              } 
              break;
            
            
            }
         
          }
         
        

      } catch (err) {
        
        console.log( err);

     
      }
    },
  

  async verify_otp({ commit }, {codigo  }){
  try {
          
        const data = { codigo: codigo  }; 
        const url = "api/v2/verify-otp/";
  
        const resp = await api.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
           
          },
        });
      
        let tokens='';
        const status=resp.data.status;
        console.log("status:",status)
        switch (status) 
        {
           
            case 200:
            {
              tokens=resp.data.payload.tokens;
              commit('setTokens',tokens);
              commit('setPlanCuentas',resp.data.payload.info.cuentas);
              commit('setCentros',resp.data.payload.info.centros);
              commit('setUserLogin',   {
                id: resp.data.payload.info.id,
                año: resp.data.anio,
                año_borrador: resp.data.anio_borrador,
                username:resp.data.payload.info.username,
                email: resp.data.payload.info.email,
                nombres: resp.data.payload.info.nombres,
                apellido1: resp.data.payload.info.apellido1,
                is_admin: resp.data.payload.info.is_admin,
                modifica_presupuestos: resp.data.payload.info.modifica_presupuestos,
              });
              break;
            }
         
          }
         
        
        return {
          ok: true,
          status,
          data: resp.data
        };

      } catch (err) {
        
       
        return {
            ok: false,
            status: err.response?.status || 500,
            error: err.response?.data || err.message
          };
     
      }
    },

  async generate_backup_codes(){
 try {
          
      
        const url = "api/v1/generatebackupcodes/";
  
        const resp = await api.get(url,{
             headers: {
            "Content-Type": "application/json"}});
      
      
        console.log("resp:",resp)
        
        
        return {
          ok: true,
          data: resp.data
        };

      } catch (err) {
        
       
        return {
            ok: false,
            status: err.response?.status || 500,
            error: err.response?.data || err.message
          };
     
      }
  }   
  };
  
  export default {
    state,
    getters,
    mutations,
    actions,
  };
  