const MaxPuntosFull = 800;
const UsoResumen = 0.69;
const UsoHistorial = 0.69;
const UsoLiveNormalDesktop = 0.19;
const UsoLiveNormalNoDesktop = 0.63;
const UsoLiveAmplio = 0.89;
const state = {
  MaxPuntosFull,
  MaxPuntosResumen: MaxPuntosFull * UsoResumen,
  MaxPuntosHistorial: MaxPuntosFull * UsoHistorial,
  MaxPuntosLiveAmplio: MaxPuntosFull * UsoLiveAmplio,
};

function detectarDispositivo() {
  const ua = navigator.userAgent;

  if (/mobile/i.test(ua)) {
    return "smartphone";
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet";
  } else {
    return "desktop";
  }
}
function puntosLiveNoAmpliado() {
  let dispositivo = detectarDispositivo();
  if (dispositivo === "desktop") {
    return MaxPuntosFull * UsoLiveNormalDesktop;
  } else {
    return MaxPuntosFull * UsoLiveNormalNoDesktop;
  }
}
function calculaGranularidad(minutos, maxpuntos) {
  if (minutos <= maxpuntos) return "";
  else if (minutos / 60 <= maxpuntos) return "HOUR";
  else return "DAY";
}

const getters = {
  getMaxPuntosResumen: (state) => state.MaxPuntosResumen,
  getMaxPuntosHistorial: (state) => state.MaxPuntosHistorial,
  getMaxPuntosLiveNormal: (state) => state.MaxPuntosLiveNormal,
  getMaxPuntosLiveAmplio: (state) => state.MaxPuntosLiveAmplio,
  calculaPuntosGranularidad: () => (minutos, vista) => {
    let maxpuntos = 0;

    switch (vista) {
      case "live-no-ampliado":
        maxpuntos = puntosLiveNoAmpliado();
        break;
      case "live-ampliado":
        maxpuntos = state.MaxPuntosLiveAmplio;
        break;

      case "resumen":
        maxpuntos = state.MaxPuntosResumen;
        break;

      case "historial":
        maxpuntos = state.MaxPuntosHistorial;
        break;
    }
    ////console.log("maxpuntos", minutos, maxpuntos);
    let granularidad = calculaGranularidad(minutos, maxpuntos);
    ////console.log("maxpuntos granularidad", granularidad);
    return granularidad;
  },

  generaSerieFechas: () => (fStart, fEnd) => {
    let arrayStart = fStart.split("-");
    let aa1 = String(arrayStart[0]).padStart(2, 0);
    let mm1 = String(parseInt(arrayStart[1])).padStart(2, 0);
    let dd1 = String(arrayStart[2]).padStart(2, 0);
    let strStart = `${aa1}-${mm1}-${dd1}T00:00:00`;
    const startDate = new Date(strStart);

    let arrayEnd = fEnd.split("-");
    let aa2 = String(arrayEnd[0]).padStart(2, 0);
    let mm2 = String(parseInt(arrayEnd[1])).padStart(2, 0);
    let dd2 = String(arrayEnd[2]).padStart(2, 0);
    let strEnd = `${aa2}-${mm2}-${dd2}T00:00:00`;
    const endDate = new Date(strEnd);

    const dates = [];
    while (startDate <= endDate) {
      //let d = startDate.toISOString().substring(0, 10) + " 00:00:00";
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
      const day = String(startDate.getDate()).padStart(2, "0");
      const d = `${year}-${month}-${day} 00:00:00`; // "2025-07-01" (en JST)
      dates.push(d);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  },

  generaSerieHoras: () => (fStart, fEnd) => {
    let arrayStart = fStart.split("-");
    let aa1 = String(arrayStart[0]).padStart(2, 0);
    let mm1 = String(parseInt(arrayStart[1])).padStart(2, 0);
    let dd1 = String(arrayStart[2]).padStart(2, 0);
    let strStart = `${aa1}-${mm1}-${dd1}T00:00:00`;
    const startDate = new Date(strStart);

    let arrayEnd = fEnd.split("-");
    let aa2 = String(arrayEnd[0]).padStart(2, 0);
    let mm2 = String(parseInt(arrayEnd[1])).padStart(2, 0);
    let dd2 = String(arrayEnd[2]).padStart(2, 0);
    let strEnd = `${aa2}-${mm2}-${dd2}T00:00:00`;
    const endDate = new Date(strEnd);

    const dates = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
      //console.log("test current", currentDate);

      // Ajustar a la zona horaria local (JST)
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Meses van de 0 a 11
      const day = String(currentDate.getDate()).padStart(2, "0");

      const baseDate = `${year}-${month}-${day}`; // "2025-07-01" (en JST)
      ////console.log('test baseDate',baseDate );

      for (let hour = 0; hour <= 24; hour++) {
        const hourStr = hour.toString().padStart(2, "0");
        dates.push(`${baseDate} ${hourStr}:00:00`);
        // //console.log('test',`${baseDate} ${hourStr}:00:00`);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  },
  diferenciaDias:
    (state, getters, rootState, rootGetters) => (fecha1, fecha2, idFaena) => {
      const f1 = rootGetters.objDate(fecha1,"00:00:00", idFaena).fecTz;
      const f2 = rootGetters.objDate(fecha2, "23:59:59",idFaena).fecTz;

      // Calcular la diferencia en milisegundos
      const diferenciaEnMs = f2.diff(f1).as("milliseconds");

      // Convertir de milisegundos a días
      const msPorDia = 1000 * 60 * 60 * 24;
      const dias = Math.floor(diferenciaEnMs / msPorDia);
      return dias;
    },
  diferenciaMinutos: (state, getters, rootState, rootGetters) => (fecha1, fecha2, idFaena) => {
     
      const f1 = rootGetters.objDate(fecha1, "00:00:00", idFaena).fecTz;
      const f2 = rootGetters.objDate(fecha2, "23:59:59", idFaena).fecTz;

      //console.log('f1',f1,'f2',f2);
      // Calcular la diferencia en milisegundos

      //const diferenciaEnMs = f2.diff(f1).as("milliseconds");
      // Convertir de milisegundos a minutos
      //const minsPorDia = 1000 * 60;
      //const minutos = Math.round(diferenciaEnMs / minsPorDia);
      ////console.log("diferenciaminutos", minutos);

      const diferenciaEnMin = f2.diff(f1, "minutes").minutes;
      const minutos =  Math.round(diferenciaEnMin);
      //console.log("diferenciaminutos", minutos);
      return minutos;
    },
};
export default {
  state,
  getters,
};
