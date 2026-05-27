// divisiones.js
import axios from "axios";
const state = {
    jaulas: [],
  };
  
  const mutations = {
    setJaulas(state, jaulas) {
      state.jaulas = jaulas;
    },
  };
  
  const actions = 
  {
    async getDivisionesApi({ commit }, { idEmpresa, faena, apiKey }) {
      try {
      
        const data = { idEmpresa };
        const url = "/api/mon/getInfoEmpresa";
  
        const resp = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
          },
        });
  
        const nodosbase = resp.data.payload.empresa;
        const jaulas = [];
  
        for (let c = 0; c < nodosbase.length; c++) {
          if (nodosbase[c].idFaena == faena) {
            const nodos_divisiones = nodosbase[c].nodes;
  
            for (let d = 0; d < nodos_divisiones.length; d++) {
              const nodos_divisiones2 = nodos_divisiones[d].nodes;
  
              for (let x = 0; x < nodos_divisiones2.length; x++) {
                const idTren = nodos_divisiones2[x].idUni;
                const nodos_divisiones3 = nodos_divisiones2[x].nodes;
  
                for (let z = 0; z < nodos_divisiones3.length; z++) {
                  ////console.log("nodo:",nodos_divisiones3[z].idUni)
                  jaulas.push({
                    idJaula: nodos_divisiones3[z].idUni,
                    label: nodos_divisiones3[z].label,
                    idTren: idTren,
                  });
                }
              }
            }
          }
        }
        if (!jaulas){
          jaulas.push({})
        }
        commit('setJaulas', jaulas);
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
  