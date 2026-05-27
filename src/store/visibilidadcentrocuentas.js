 
 
const state = {
    
    visibilidad: [],
    visibilidadBorrador: [],
  };
  const getters = {
    
    getCuentasVisibilidad: (state) => {
     
        return state.visibilidad;
     
    },
    
  };
  const mutations = {
    setCuentas(state, list) {
      state.visibilidad = list;
    }, 
    CuentasCreate(state, arrayObj) {
      
      state.visibilidad = arrayObj
    },
    cuentaAdd(state, newobj) {
      
      state.visibilidad.push(newobj);
    },
    cuentaRemove(state, newobj){
      let s =  state.visibilidad;
      state.visibilidad= s .filter(cuenta => {
        if (cuenta.id !== newobj.id) {
            return  cuenta;  
        }
       });  
    },
    cuentaUpdVisible(state,newobj)
    {
     
 
     // {id: 5, centro: 1, visible: true}

        //const cta = state.visibilidad.filter(cta=>cta.id ===newobj.id && cta.centro=== newobj.centro && cta.visible === true )

        const item =  state.visibilidad.find(obj => obj.id === newobj.id  && obj.centro === newobj.centro);
        if (item) {
          item.visible = !item.visible; // o true, según necesites
          
        }else{
           state.visibilidad.push(newobj);
        }
    },
   cuentaUpdVisibleBorrador(state,newobj)
    {
      
        const item =  state.visibilidadBorrador.find(obj => obj.id === newobj.id  && obj.centro === newobj.centro);
        if (item) {
          item.visible = !item.visible; // o true, según necesites
          
        }else{
           state.visibilidadBorrador.push(newobj);
        }
    }
  };
  
  const actions = {
    setCuentas({ commit }, list) {
      commit("setCuentas", list);
    },
    cuentaCreate({ commit }, obj) {
      commit('cuentaCreate', obj);
    },
    cuentaUpdVisible(context, f){
     
      context.commit("cuentaUpdVisible", f);
    },
    cuentaUpdVisibleBorrador(context, f){
     
      context.commit("cuentaUpdVisibleBorrador", f);
    },
    cuentaAdd(context, f){
      //console.log('addcuenta')
      context.commit("cuentaAdd", f);
    },
    cuentaRemove(context, f){
      //console.log('removecuenta')
      context.commit("cuentaRemove", f);
    }
  };
  
  export default {
    state,
    mutations,
    actions,
    getters
  };
  