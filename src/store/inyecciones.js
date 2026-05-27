const state = {
  stateJaulaInyeccion: [
    
  ],
};
const getters = {
  getStateInyeccionJaula: (state) => ( idJaula) => {
    return state.stateJaulaInyeccion.find(
      j =>  j.jaula === idJaula
    ) || null;  
  },
  getStateInyeccionTrue: (state) =>()=>{
      return state.stateJaulaInyeccion.some(j=>j.value == true);
  }
};
const mutations = {
  setStateInyeccion(state, {  idJaula, estado }) {
    
    //console.log('mutation',idJaula);
    const item = state.stateJaulaInyeccion.find(
      (j) =>  j.jaula === idJaula
    );
    
    if (item) {
      item.value = estado; 
    } else {
     
      state.stateJaulaInyeccion.push({
     
        jaula: idJaula,
        value: estado,
      });
    }
  },
};
const actions = {
  async updStateInyeccion({ commit }, {   idJaula,estado }) {
    commit("setStateInyeccion", {idJaula,estado}  );
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
