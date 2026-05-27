const paramColors = {
  5: "#0099ff", // orp
  1: "#ff6e00", // temp
  4: "#581C87", // o2
};
function makeArrayOptions(ordenadas) {
  ordenadas.sort((a, b) => {
  const ordenA = a?.orden ?? 0;
  const ordenB = b?.orden ?? 0;
  return ordenA - ordenB;
  }); 
  let colors = [];
  let series = [];
  let yAxis = [];
  let sideLeft = true;
  let index = 0;
  ordenadas.forEach((item) => {
    let idParam = parseInt(item.idPar);
    let color = paramColors[idParam];
    colors.push(color);
    series.push({
      name: "",
      data: [],
      yAxis: index,
      zoneAxis: "x",
      zones: [],
      marker: { enabled: false },
    });
    yAxis.push({
      title: {
        text: "",
        style: { color: color },
      },
      min: 0,
      max: 0,
      labels: {
        style: { color: color },
      },
      ...(sideLeft ? {} : { opposite: true }),
    });
    sideLeft = !sideLeft;
    index++;
  });
  return [colors, series, yAxis];
}

const state = {
  chartOptions: {},
};
const getters = {
  getChartOptions: (state) => state.yAxisLiveNormal,
  
};
const actions = {
  makeChartOptions({ rootState }, idSeccion) {
    const ordenadas = rootState.login.userLogin.info.ordenada;
   
    const seccion = ordenadas.find(
      (ordenada) => ordenada.idSeccion == idSeccion
    );

    if (!seccion) {
      console.warn(`Sección con idSeccion=${idSeccion} no encontrada`);
      return null;
    }
 console.log('seccion',seccion)
    const [colors, series, yAxis] = makeArrayOptions(seccion.ordenadas);

    return {
      chart: { type: "line" },
      colors: colors,
      legend: { enabled: false },
      plotOptions: {
        line: {
          dataLabels: { enabled: false },
          enableMouseTracking: true,
        },
      },
      series: series,
      title: { text: "" },
      tooltip: {},
      xAxis: {
        categories: [],
        labels: {
          enabled: true,
          lineColor: "gray",
        },
      },
      yAxis: yAxis,
    };
  },
};

export default {
     namespaced: true,
  state,
  getters,
  actions
};
