import api from "@/api/axios";

export function useIngresos() {
 
  async function getIngresos(centro_id, cuenta_id) {
    try {
      const resp = await api.get(`/api/v1/ingresos/presupuesto/centro/${centro_id}/cuenta/${cuenta_id}/`)
      const status = resp.data.status

      if (status !== 200) return null
      /**
         {
          "status": 200,
          "anio": 2026,
          "total_registros": 12,
          "presupuesto_id": 64,
          "ingresos_bloqueados": true,
          "total_presupuesto": 384000.0,
          "total_gastos": 68098.0,
          "saldo": 315902.0,
          "total_presupuesto_borrador": 0.0,
          "modificaciones": [],
          "ingresos": [
              {
                  "id": 829,
                  "mes": 1,
                  "monto_mensual": "0.00",
                  "glosa": "Importado desde CSV",
                  "timestamp": "2025-11-25T17:34:02.450465-03:00",
                  "presupuesto_id": 1191
              },
       */
      let ingresos = resp.data.ingresos  
  
      if (  Array.isArray( ingresos) && ingresos.length==0 ) 
      {
          ingresos=Array(13).fill(0)
      }

      return {
        ingresos:  ingresos,
        presupuesto_id: resp.data.presupuesto_id,
        ingresos_bloqueados: resp.data.ingresos_bloqueados,
        total_presupuesto:resp.data.total_presupuesto,
        total_presupuesto_borrador:resp.data.total_presupuesto_borrador,
        total_gastos:resp.data.total_gastos,
        modificaciones: resp.data.modificaciones
      }

    } catch (err) {
      console.log(err)
      return null
    }
  }
 
  return { getIngresos  }
}
