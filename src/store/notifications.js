export default {
  namespaced: true,

  state: () => ({
    messages: [],
  }),

  mutations: {
    ADD_NOTIFICATION(state, payload) {
      state.messages.push({
        id: Date.now(),
        type: payload.type,
        message: payload.message,
      });
         state.messages = [];
    },

    REMOVE_NOTIFICATION(state, id) {
      state.messages = state.messages.filter((n) => n.id !== id);
    },
    CLEAR_MESSAGES(state) {
      state.messages = [];
    },
  },

  actions: {
    notifyError({ commit }, message) {
      const id = Date.now();

      commit("ADD_NOTIFICATION", {
        id,
        type: "error",
        message,
      });

      setTimeout(() => {
        commit("REMOVE_NOTIFICATION", id);
      }, 4000);
    },

    notifySuccess({ commit }, message) {
      commit("ADD_NOTIFICATION", {
        type: "success",
        message,
      });
    },

    notifyWarning({ commit }, message) {
      commit("ADD_NOTIFICATION", {
        type: "warning",
        message,
      });
    },

    removeNotification({ commit }, id) {
      commit("REMOVE_NOTIFICATION", id);
    },

    clearMessages({ commit } ) {
      commit("CLEAR_MESSAGES" );
    },
  },
};
