import { DateTime } from "luxon";
const createDateFactory =
  (getterFunction, rootState) => (fecAAMMDD, idFaena) => {
    let timezone;

    if (idFaena && rootState.faenas?.faenas) {
      const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
      timezone = faena?.TZ || DateTime.local().zoneName;
    } else {
      timezone = DateTime.local().zoneName;
    }

    let fecTz = DateTime.fromISO(fecAAMMDD, { zone: timezone });
    if (!fecTz.isValid) {
      throw new Error(`Fecha inválida: ${fecAAMMDD}`);
    }

    // Formateo correcto del offset (GMT-0400)
    const offset = fecTz.offset;
    const formattedOffset =
      offset === -240
        ? "-0400"
        : `${offset < 0 ? "-" : "+"}${Math.abs(offset)
            .toString()
            .padStart(2, "0")}00`;

    return {
      // Propiedades básicas
      datetime: `${fecTz.toFormat(
        "EEE MMM dd yyyy HH:mm:ss"
      )} GMT${formattedOffset} (Chile Standard Time)`,

      getFullYear: fecTz.year,
      getMonth: fecTz.month,
      getDate: fecTz.day,
      getHours: fecTz.hour,
      getMinutes: fecTz.minute,
      getSeconds: fecTz.second,

      toISO: fecTz.toISO(),
      toJSDate: fecTz.toJSDate(),
      isValid: true,
      // Operaciones de tiempo
      /**
       * Resta milisegundos a la fecha
       * @param {number} ms - Milisegundos a restar
       * @returns {Object} Nueva instancia del objeto fecha
       */
      subtractMillis: (ms) => {
        const newDate = fecTz.minus({ milliseconds: ms });
        //console.log("dateFactory (1)", newDate.toISO(), timezone);
        //console.log( "dateFactory (2) ",  getterFunction(newDate.toISO(), timezone)  );
        const f = newDate.toISO();
        return f;
      },

      /**
       * Suma milisegundos a la fecha
       * @param {number} ms - Milisegundos a sumar
       * @returns {Object} Nueva instancia del objeto fecha
       */
      addMillis: (ms) => {
        const newDate = fecTz.plus({ milliseconds: ms });
        return getterFunction(newDate.toISODate(), timezone);
      },
    };
  };
const getters = {
  fechaHoraActual: (state, getters, rootState) => (idFaena) => {
    let timezone;
    if (idFaena && rootState.faenas?.faenas) {
      const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
      timezone = faena?.TZ || DateTime.local().zoneName;
    } else {
      timezone = DateTime.local().zoneName;
    }

    const dt = DateTime.now().setZone(timezone);
    return {
      iso: dt.toISO(),
      fechaHora: dt.toFormat("dd-MM-yyyy HH:mm:ss"),
      fechaDDMMAA: dt.toFormat("dd-MM-yyyy"),
      getFullYear: dt.year,
      getMonth: dt.month,
      getDate: dt.day,
      getHours: dt.hour,
      getMinutes: dt.minute,
      getSeconds: dt.second,
      getMiliseconds: dt.millisecond,
      objLuxon: dt,
      zoneName: timezone,
    };
  },
objDate: (state, getters, rootState) => (fecAAMMDD, hhiiss, idFaena) => {
  try {
    let timezone;
    if (idFaena && rootState.faenas?.faenas) {
      const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
      timezone = faena?.TZ || DateTime.local().zoneName;
    } else {
      timezone = DateTime.local().zoneName;
    }

    if (!fecAAMMDD || typeof fecAAMMDD !== "string") {
      throw new Error("La fecha debe ser un string válido");
    }

    const [fechaStr] = fecAAMMDD.split("T");
    const [aa, mm, dd] = fechaStr.split("-").map(Number);

    if ([aa, mm, dd].some(isNaN)) {
      throw new Error("Formato de fecha inválido: deben ser números");
    }

    // Parseo hhiiss: "hh:mm:ss"
    let hora = 0, minuto = 0, segundo = 0;
    if (typeof hhiiss === "string") {
      const partesHora = hhiiss.split(":").map(Number);
      if (partesHora.length === 3 && partesHora.every(n => !isNaN(n))) {
        [hora, minuto, segundo] = partesHora;
      } else {
        throw new Error("Formato de hora inválido. Debe ser 'hh:mm:ss'");
      }
    }

    let fechaFinal;
    if (dd === 0) {
      // Último día del mes anterior
      fechaFinal = DateTime.fromObject(
        { year: aa, month: mm + 1, day: 1, hour: 0, minute: 0, second: 0 },
        { zone: timezone }
      ).minus({ days: 1 });
      fechaFinal = fechaFinal.set({ hour: hora, minute: minuto, second: segundo });
    } else {
      fechaFinal = DateTime.fromObject(
        { year: aa, month: mm, day: dd, hour: hora, minute: minuto, second: segundo },
        { zone: timezone }
      );
    }

    return {
      fecTz: fechaFinal,
      datetime: `${fechaFinal.toFormat("EEE MMM dd yyyy HH:mm:ss")} GMT${fechaFinal.toFormat("ZZ")} (${fechaFinal.zoneName})`,
      getFullYear: fechaFinal.year,
      getMonth: fechaFinal.month,
      getDate: fechaFinal.day,
      getHours: fechaFinal.hour,
      getMinutes: fechaFinal.minute,
      getSeconds: fechaFinal.second,
    };
  } catch (error) {
    console.error("Error procesando fecha:", error);
    throw error;
  }
},


  generateDateRange:
    (state, getters, rootState) => (startDateStr, endDateStr, idFaena) => {
      //console.log("rango entrada", startDateStr, endDateStr);
      if (!startDateStr || !endDateStr) return [];

      let timezone;
      if (idFaena && rootState.faenas?.faenas) {
        const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
        timezone = faena?.TZ || DateTime.local().zoneName;
      } else {
        timezone = DateTime.local().zoneName;
      }

      const startDate = DateTime.fromISO(startDateStr, {
        zone: timezone,
      }).startOf("day");
      const endDate = DateTime.fromISO(endDateStr, { zone: timezone }).startOf(
        "day"
      );

      if (!startDate.isValid || !endDate.isValid || startDate > endDate)
        return [];

      const dates = [];
      let currentDate = startDate;

      while (currentDate <= endDate) {
        dates.push(currentDate.toFormat("yyyy-MM-dd"));
        currentDate = currentDate.plus({ days: 1 });
      }
      //console.log("rango", dates);
      return dates;
    },
  restarDias: (state, getters, rootState) => (day, month, year, n, idFaena) => {
    let timezone;
    if (idFaena && rootState.faenas?.faenas) {
      const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
      timezone = faena?.TZ || DateTime.local().zoneName;
    } else {
      timezone = DateTime.local().zoneName;
    }

    const base = DateTime.fromObject({ year, month, day }, { zone: timezone });

    const restada = base.minus({ days: n });

    return {
      fechaLuxon: restada,
      fechaJS: restada.toJSDate(),
      formatoISO: restada.toISODate(),
      formatoHumano: restada.toFormat("dd-MM-yyyy"),
      getDate: restada.day,
      getMonth: restada.month,
      getFullYear: restada.year,
    };
  },
  ultimoDiaDelMes: (state, getters, rootState) => (month, year, idFaena) => {
    let timezone;
    if (idFaena && rootState.faenas?.faenas) {
      const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
      timezone = faena?.TZ || DateTime.local().zoneName;
    } else {
      timezone = DateTime.local().zoneName;
    }
    if (!DateTime.local().setZone(timezone).isValid) {
      throw new Error(`Zona horaria inválida: ${timezone}`);
    }
    const ultimoDia = DateTime.fromObject(
      { year, month },
      { zone: timezone }
    ).endOf("month");

    return {
      getDate: ultimoDia.day,
    };
  },
  calcularDiferencia:
    (state, getters, rootState) => (fecInicial, fecFinal, idFaena) => {
      let timezone;
      if (idFaena && rootState.faenas?.faenas) {
        const faena = rootState.faenas.faenas.find((f) => f.id == idFaena);
        timezone = faena?.TZ || DateTime.local().zoneName;
      } else {
        timezone = DateTime.local().zoneName;
      }

      if (!DateTime.local().setZone(timezone).isValid) {
        throw new Error(`Zona horaria inválida: ${timezone}`);
      }
      let fecTzIni = DateTime.fromISO(fecInicial, { zone: timezone });

      if (!fecTzIni.isValid) {
        throw new Error(`Fecha inválida: ${fecInicial}`);
      }

      let fecTzFinal = DateTime.fromISO(fecFinal, { zone: timezone });

      if (!fecTzFinal.isValid) {
        throw new Error(`Fecha inválida: ${fecTzFinal}`);
      }
      const diff = fecTzFinal.diff(fecTzIni, "days");
     // console.log('diferencia',diff.days,Math.ceil(diff.days))
      return {
       // dias: Math.floor(diff.days),
        dias: Math.ceil(diff.days),
      };
    },

  dateFactory: (state, getters, rootState) =>
    createDateFactory(
      (date, idFaena) => getters.dateFactory(date, idFaena),
      rootState
    ),
};

export default {
  getters,
};
