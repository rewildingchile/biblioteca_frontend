import { createApp } from 'vue'
import App from './App.vue'

import './index.css'
import router from './router'
import store from './store'
import i18n from './i18n' 
 
 
// treat all tags starting with 'ion-' as custom elements

const app = createApp(App)

app.config.globalProperties.$formatoMiles = function (num) {
  return Number(num).toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}
 
app.config.globalProperties.$formatoNumero = function (num) {
  return Number(num).toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

app.directive("clp", {
  mounted(el) {
    el.addEventListener("input", () => {
      let valor = el.value.replace(/\D/g, ""); // Quita todo lo que no sea número

      if (!valor) {
        el.value = "";
        return;
      }

      // Formato chileno CLP
      el.value = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
      }).format(valor);
    });
  }
});

app.use(i18n).use(router ).use(store).mount('#app')
