

import axios from "axios";
const state = {
  usuarios: [],
  statusInsert:0,
};

const mutations = {
  setUsuarios(state, usuarios) {
    state.usuarios = usuarios;
  },
  setStatusInsert(state, status) {
    state.statusInsert = status;
},
};

const actions = {

  setUsers({ commit }, listUsuarios) {
    commit('setUsuarios', listUsuarios);
  },
  async insert({ commit }, {newuser,apiKey} ) {
    try {
     
      const url = "/api/admin/newUser";

      const resp = await axios.post(url, newuser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${apiKey}` 
         
        },
      });
      let message="";
      const status=resp.data.status;
      switch (status) {
          case 200:  
            message=resp.data.payload.message;
            console.log(message)
          
             
            break;
       
        }
       
        commit('setStatusInsert',status);

    } catch (err) {
      console.log(err);
    }
  },

};

export default {
  state,
  mutations,
  actions,
};
