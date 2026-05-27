
export function useCatPresup() {

     // haz match de plan de cuentas con listado de presupuestos ingresados

    function getCatPresup(presupuestos,cuentas)
    {
      
      /*
       array de objetos 'presupuestos':
     
               {
                        "id": 5816,
                        "centro_id": 6,
                        "cuenta_id": 8,
                        "empresa_id": 1,
                        "aa": 2025,
                        "moneda_id": 1,
                        "total_presupuesto": "900000.00",
                        "total_gastos": "0.00",
                         "clasificacioncentro_id": 4
                    },
      */

      let categorias=[];
      let  cuentasCoincidentes;
         // crea vector de cuentas en presupuestos
        const cuentasIdSet = new Set(presupuestos.map(p => p.cuenta_id));
         // haz match  
        cuentasCoincidentes = cuentas.filter(c =>
                      cuentasIdSet.has(c.id)
                      );
        
        /*
         {
        "id": 38,
        "codigo": "4510305004",
        "nombre": "Viajes de prensa, institucionales",
        "tipo_cuenta": {
            "id": 8,
            "nombre": "COMUNICACIONES y GESTION INSTITUCIONAL",
            "categoria_cuenta": {
                "id": 5,
                "nombre": "COMUNICACIONES y GESTION INSTITUCIONAL",
                "orden":1
            }
        }
        }
]
        */
        cuentasCoincidentes.forEach((cuenta) => {
              const cat = cuenta.tipo_cuenta.categoria_cuenta;
              const tip = cuenta.tipo_cuenta;
              const codigocta = cuenta.codigo;
              const idcta = cuenta.id;
              const nomcta = cuenta.nombre;
              const presup = presupuestos.filter(p => p.cuenta_id === cuenta.id);

              let total_presupuesto = 0;
              let total_gastos = 0;
              let saldo =0;
              if (Array.isArray(presup)) 
              {
                  const totales = presup.reduce((acc, item) => {
                    acc.total_presupuesto += Number(item.total_presupuesto || 0);
                    acc.total_gastos += Number(item.total_gastos || 0);
                    return acc;
                  }, { total_presupuesto: 0, total_gastos: 0 });

                  total_presupuesto = totales.total_presupuesto;
                  total_gastos = totales.total_gastos;
                  saldo = total_presupuesto - total_gastos;
                 
              }

              if (!categorias[cat.id]) {
                categorias[cat.id] = {
                  id: cat.id,
                  nombre: cat.nombre,
                  tipos: [],
                  orden:cat.orden
                };

              }
              // busca tipos 
              let tipos = categorias[cat.id].tipos;
              let existeTipo = tipos.find(tipo => tipo.id === tip.id);
              if (typeof existeTipo == 'undefined') {
                tipos.push({ 'id': tip.id, 'nombre': tip.nombre, 'cuentas': [{ 'id': idcta, 'cod': codigocta, 'nomcta': nomcta, 'total_presupuesto': total_presupuesto,'total_gastos':total_gastos,'saldo':saldo }] })
                categorias[cat.id].tipos = tipos;
              } else {
                existeTipo.cuentas.push({ 'id': idcta, 'cod': codigocta, 'nomcta': nomcta, 'total_presupuesto': total_presupuesto,'total_gastos':total_gastos,'saldo':saldo })
                categorias[cat.id].tipos.cuentas = existeTipo;
              }


      });
           
         

          // 1️⃣ Ordenar las categorías por nombre
          // Object.values(categorias)
          // Convierte categorias en array si fuera un objeto.
          /**
           * {
            1:{nombre:"A"},
            2:{nombre:"B"}
          }
            convierte a: 
          [
          {nombre:"A"},
          {nombre:"B"}
          ]
          .sort() --> Ordena el array.
          localeCompare --> Ordena alfabéticamente respetando acentos y mayúsculas.
           */
          categorias = Object.values(categorias).sort((a, b) =>
           a.nombre.localeCompare(b.nombre)
         );
         
            //2️⃣ Ordenar los tipos dentro de cada categoría
          categorias.forEach(cat => {
            if (Array.isArray(cat.tipos)) {
              cat.tipos.sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
          });
          
          // 3️⃣ Ordenar las cuentas dentro de cada tipo
          categorias.forEach(cat => {
            if (Array.isArray(cat.tipos)) {
             
              cat.tipos.forEach(tip => {
                 if (Array.isArray(tip.cuentas)) {
                  tip.cuentas.sort((a, b) => a.cod.localeCompare(b.cod));
                }
              });
            }
          });

       

      return  categorias
    }

    return { getCatPresup }
}