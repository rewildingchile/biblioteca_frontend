// cuentas.js

const state = {
  cuentas: [],
};
const getters = {
  getPlanCuentas: (state) => {
    return state.cuentas;
  }
}
const mutations = {
  setPlanCuentas(state, cuentas) {
    state.cuentas = cuentas;
  },
};

const actions = {
  setPlanCuentas({ commit }, listCuentas) {
    commit("setPlanCuentas", listCuentas);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
