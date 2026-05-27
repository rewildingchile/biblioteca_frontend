// centros.js

const state = {
  centros: [],
};
const getters = {
  getCentros: (state) => {
    return state.centros;
  }
}
const mutations = {
  setCentros(state, centros) {
    state.centros = centros;
  },
};

const actions = {
  setCentros({ commit }, listCentros) {
    commit("setCentros", listCentros);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
