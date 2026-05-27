import { ref } from 'vue';
import axios from 'axios';

export function useGasInjection() {
  const lecturasDiarias = ref([]);
  const acumulacionesDiarias = ref([]);
  const seriesDiarias = ref([]);
  const valorMaxY0 = ref(0);
  const valorMinY0 = ref(0);
  const resultMediciones = ref(false);
  const mostrarSpinner = ref(false);

  async function getSeriesDia(startDate, endDate, esFaenaNatural, apiKey, faenas) {
    try {



      
      console.log('getSeriesDia')
      const arrayLecturasLocal = [];
      mostrarSpinner.value = true;

      for (const objFaena of faenas) {
        // Filtrar jaulas de la faena actual
        const jaulas = objFaena.unidades.filter(
          (faena) => faena.natural === esFaenaNatural
        );

        // Crear promesas para cada jaula
        const jaulaPromises = jaulas.map((jaula) => {
          if (jaula.id !== undefined) {
            const requestData = {
              idUnit: jaula.id,
              startDay: `${startDate} 00:00:00`,
              finishDay: `${endDate} 23:59:59`,
            };

            return axios
              .post('/api/ctl/unitGasInjection', requestData, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `${apiKey}`,
                },
              })
              .then((response) => {
                const gas = response.data.payload.gas;

                gas.forEach((g) => {
                  let indice = 0;
                  g.inyection.forEach((med) => {
                    if (med && !isNaN(parseFloat(med))) {
                      const medParsed = parseFloat(med);
                      arrayLecturasLocal[indice] =
                        (arrayLecturasLocal[indice] || 0) + medParsed;

                      if (indice === 0) {
                        console.log('inject', indice, medParsed, arrayLecturasLocal[indice]);
                      }
                      indice++;
                    }
                  });
                });
              })
              .catch((error) => {
                console.error('Error al obtener datos de la unidad', error);
              });
          }
        });

        // Esperar todas las promesas
        await Promise.allSettled(jaulaPromises);
      }

      // Actualizar lecturas y acumulaciones
      const arrayAcumulacionesLocal = [];
      let acumulado = 0;

      arrayLecturasLocal.forEach((med) => {
        acumulado += med;
        arrayAcumulacionesLocal.push(acumulado);
      });

      // Actualizar variables reactivas
      lecturasDiarias.value = [...arrayLecturasLocal];
      acumulacionesDiarias.value = [...arrayAcumulacionesLocal];
      seriesDiarias.value = [
        {
          name: 'Diario',
          type: 'line',
          data: [...lecturasDiarias.value],
        },
        {
          name: 'Acumulado',
          type: 'area',
          data: [...acumulacionesDiarias.value],
        },
      ];
      resultMediciones.value = true;
      mostrarSpinner.value = false;

      return { lecturasDiarias, acumulacionesDiarias, seriesDiarias };
    } catch (error) {
      console.error('Error procesando faenas:', error);
      mostrarSpinner.value = false;
    }
  }

  return {
    lecturasDiarias,
    acumulacionesDiarias,
    seriesDiarias,
    valorMaxY0,
    valorMinY0,
    resultMediciones,
    mostrarSpinner,
    getSeriesDia,
  };
}
