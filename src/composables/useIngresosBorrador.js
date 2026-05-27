import api from "@/api/axios";

export function useIngresosBorrador() {
 
  async function getIngresosBorrador(centro_id, cuenta_id) {
    try {
      const resp = await api.get(`/api/v1/ingresos/presupuesto/borrador/centro/${centro_id}/cuenta/${cuenta_id}/`)
      const status = resp.data.status

      if (status !== 200) return null
      /**
         {
          "status": 200,
          "anio": 2027,
          "total_registros": 12,
          "presupuesto_id": 64250,
          "ingresos_bloqueados": false,
          "total_presupuesto": 3000.0,
          "total_gastos": 0.0,
          "saldo": 3000.0,
          "modificaciones": [],
          "ingresos": [
            {
                "id": 507021,
                "mes": 1,
                "monto_mensual": "0.00",
                "glosa": "duplicacion de presupuesto automatico",
                "timestamp": "2026-04-25T18:43:51.629281-04:00",
                "presupuesto_id": 64250
            },
            {
                "id": 512916,
                "mes": 2,
                "monto_mensual": "0.00",
                "glosa": "duplicacion de presupuesto automatico",
                "timestamp": "2026-04-25T18:43:51.629281-04:00",
                "presupuesto_id": 64250
            },
            ....
            {
                "id": 571866,
                "mes": 12,
                "monto_mensual": "0.00",
                "glosa": "duplicacion de presupuesto automatico",
                "timestamp": "2026-04-25T18:43:51.629281-04:00",
                "presupuesto_id": 64250
            }
          ],
          "solicitudes": [
          {
              "id": 32,
              "descripcion": "auto 6",
              "total": "1000.00",
              "timestamp": "2026-05-05T16:05:40.550367-04:00",
              "presupuesto": 64250,
              "user": 1
          },
          {
              "id": 69,
              "descripcion": "auto 7",
              "total": "2000.00",
              "timestamp": "2026-05-06T05:15:30.630924-04:00",
              "presupuesto": 64250,
              "user": 1
        }]

    
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
        modificaciones: resp.data.modificaciones
      }

    } catch (err) {
      console.log(err)
      return null
    }
  }
 
  return { getIngresosBorrador  }
}
