<template>

  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="flex flex-col items-center">

      <!-- Spinner -->
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

      <!-- Texto opcional -->
      <div class="mt-4 text-white text-sm">Cargando...</div>

    </div>
  </div>

  <div class="p-4 space-y-4">
    <div class="flex justify-between">
      <span
        class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&lt;MaestroPlanCuentas&gt;</span>
      <span
        class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">/api/v1/ingresos/presupuesto/centro/${centro_id}/cuenta/${cuenta_id}/</span>
    </div>
    <div class="flex justify-center mt-10 font-mono">
      <div class="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-md p-2">

        <!-- Título -->
        <div class="text-center mb-5">
          <h2 class="text-lg font-semibold text-gray-800">
            Para comenzar
          </h2>
          <p class="text-sm text-gray-500">
            Seleccione un centro de costo
          </p>
        </div>

        <!-- Controles -->
        <div class="text-center mb-3">

          <!-- Select -->
          <div class="flex justify-center">
            <select v-model="centroSeleccionado" class="w-full border border-gray-300 rounded-xl px-4 py-2  w-[350px] 
                 bg-white shadow-sm text-sm text-gray-700
                 focus:ring-2 focus:ring-indigo-400 outline-none transition">
              <option value="">Seleccione...</option>
              <option v-for="item in listado" :key="item.id" :value="item.id">
                {{ item.nombre }}
              </option>
            </select>


            <button @click="leepresupuestos()" class="ml-2 px-4 py-2 rounded-xl text-sm font-medium transition shadow
                 flex items-center justify-center gap-2" :class="centroSeleccionado
                  ? 'bg-violet-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
              🔍 Buscar
            </button>
          </div>



        </div>




        <div v-if="buscarCentro">

          <div v-for="categoria in this.categorias" :key="categoria.id"
            class="border rounded-lg bg-gray-100 pt-3  max-w-full ">

            <div
              class="  flex items-center justify-between px-6 mx-2 py-4 mb-5 rounded-2xl bg-gradient-to-r from-indigo-800 to-blue-200 text-white shadow-md">
              <h2 class="text-lg font-semibold tracking-wide font-mono">
                {{ nombreCentro }} / {{ categoria.nombre }}

              </h2>
            </div>
            <!-- Nivel 2: Tipos -->
            <div v-for="tipo in categoria.tipos" :key="tipo.id" class="ml-0   pl-0 mb-3  w-full">
              <h3 class="text-md  text-blue-700 mb-1 font-mono">
                {{ tipo.nombre }}
              </h3>

              <!-- Nivel 3: Cuentas -->
              <div class="ml-0  grid grid-cols-4 gap-2 text-sx  pt-3 rounded shadow-sm mb-0 font-mono">

                <div class="text-gray-700"></div>
                <div class="text-gray-800"></div>
                <div class="text-gray-800 bg-white rounded-t-2xl pt-3">
                  {{ this.$store.state.auth.userLogin.año }}
                </div>
                <div class="ml-1 text-gray-800 bg-yellow-100  rounded-t-2xl pt-3">
                  {{ this.$store.state.auth.userLogin.año_borrador }}
                </div>
              </div>
              <div v-for="cuenta in tipo.cuentas" :key="cuenta.id" class="ml-0">
                <div class="ml-0 mb-1 grid grid-cols-4 gap-3 text-sm bg-white pt-0 rounded shadow-sm mb-0 font-mono">

                  <div class="text-gray-700 py-4">{{ cuenta.cod }} ({{ cuenta.id }})</div>
                  <div class="text-gray-800 py-4">{{ cuenta.nomcta }}</div>
                  <div>


                    <div class="grid grid-cols-3 gap-4 py-4 ">
                      <div>
                        <div class="  text-gray-500 uppercase text-xs mb-1 ">Budget</div>
                        <div class="  font-mono"
                          :class="cuenta.total_presupuesto > 0 ? 'text-blue-800  font-bold' : 'text-gray-200'">
                          {{ $formatoMiles(cuenta.total_presupuesto) }}
                        </div>
                      </div>
                      <div>
                        <div class="  text-gray-500 uppercase text-xs mb-1  ">Gastos</div>
                        <div class=" font-mono"
                          :class="cuenta.total_gastos > cuenta.total_presupuesto ? 'text-red-800  font-bold' : 'text-black'">
                          {{ $formatoMiles(cuenta.total_gastos) }}
                        </div>
                      </div>
                      <div>
                        <div class="  text-gray-500 uppercase text-xs mb-1  ">% Ejec.</div>
                        <div class=" font-mono">
                          {{
                            (cuenta.total_presupuesto && cuenta.total_gastos)
                              ? ((cuenta.total_gastos / cuenta.total_presupuesto) * 100).toFixed(1)
                              : '0.0'
                          }}%
                        </div>
                      </div>
                    </div>


                  </div>
                  <div class="text-gray-800  bg-yellow-100 pt-5">

                    <div v-if="editados[cuenta.id] >= 0">
                      <button @click="toggleCuentaBorrador(cuenta.id)" class=" 
                                                                 w-[150px] 
                                                                h-8
                                                                text-sm   shadow  hover:bg-violet-400  hover:shadow-md
                                                                transition duration-150  rounded-2xl"
                        :class="editados[cuenta.id] ? 'bg-blue-200  text-black' : 'bg-gray-300 text-gray-400'">

                        $ {{ $formatoMiles(editados[cuenta.id]) }}

                      </button>
                    </div>

                  </div>
                </div>
                <!-- Div colapsable -->

                <transition name="fade">

                  <div v-if="revisaExpansionBorrador(cuenta.id)"
                    class="mt-0 pt-0 pb-4 bg-gray-50 border border-gray-200 text-sm  text-gray-700   shadow-sm animate-fadeIn">
                    <div class="flex justify-end mt-0 font-mono">
                      <div class="  bg-yellow-100 border border-gray-200  shadow-md px-6 py-6 mb-6">
                        <IngresosMensualesBorrador v-if="this.$store.state.auth.userLogin.modifica_presupuestos"
                          :centro_id="centroSeleccionado" :propCuenta_id="cuenta.id" :nomcentro="centroNombre"
                          :nomcta="cuenta.nomcta" @exit="exit" @devuelve_total="set_total"
                          :componenteVisible="componenteVisibleBorrador" />
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import { useIngresos } from "@/composables/useIngresos";
import IngresosMensualesBorrador from "@/components/presupuestos/IngresosMensualesBorrador.vue";

//import IngresosMensuales from "../presupuestos/IngresosMensuales.vue";
export default {
  name: 'MaestroCentros',
  props: {
    ejemploProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      valor: '',
      listado: {},
      categorias: {},
      tipos: {},
      cuentaExpandida: [], // almacena IDs de cuentas abiertas
      cuentaExpandidaBorrador: [], // almacena IDs de cuentas abiertas
      centroSeleccionado: false,
      loading: false,
      nombreCentro: 'Centro sin seleccionar',
      componenteVisible: false,
      componenteVisibleBorrador: false,
      buscarCentro: false,
      editados: []
    }
  },
  computed: {
    centroSeleccionadoObj() {
      return this.listado.find(item => item.id === this.centroSeleccionado)
    },
    centroNombre() {
      return this.centroSeleccionadoObj?.nombre || ''
    }
  },
  methods: {

    set_total(obj) {
      console.log('set total', obj)
      if (obj) {
        this.editados[obj.cuenta_id] = obj.total
      }
    },

    toggleCuenta(id) {
      const i = this.cuentaExpandida.indexOf(id);
      if (i === -1) {
        console.log('añadir ', i)
        this.cuentaExpandida.push(id);

      } else {

        this.cuentaExpandida.splice(i, 1);

      }
    },


    toggleCuentaBorrador(id) {

      if (!this.tienePermiso(id)) {
        return false;
      }

      const i = this.cuentaExpandidaBorrador.indexOf(id);
      if (i === -1) {
        console.log('hacer visible')
        this.cuentaExpandidaBorrador.push(id);
        this.componenteVisibleBorrador = true;

      } else {
        //console.log(i)
        this.cuentaExpandidaBorrador.splice(i, 1);

      }



    },
    tienePermiso(id) {
      if (this.$store.state.auth.userLogin.is_admin){
        return true;
      }
      if ( Number(id) === Number(process.env.VUE_APP_ID_CTA_REMUNERACIONES)){
         alert('no tiene permiso para modificar esta cuenta.');
        return false;
      }
        
      return true;
      

    },
    async centros() {


      try {
        /*
        $store.state.centros.centros
        {
        id: 1
        codigo: PRO035000000000
        nombre: Centro Rescate Huemul
        tiene_presupuesto:true
        }
        */
        this.listado_original = this.$store.state.centros.centros




        this.listado = Object.values(this.listado_original).sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );


        console.log("Inicio de sesión correcto ✅");
      } catch (e) {
        console.error("Credenciales inválidas ❌");
      }

    },


    categoriasAgrupadas() {
      // Agrupa por categoría y tipo



      this.listado = this.$store.state.cuentas.cuentas;
      this.listado.forEach(async (cuenta) => {

        const cat = cuenta.tipo_cuenta.categoria_cuenta;
        const tip = cuenta.tipo_cuenta;
        const codigocta = cuenta.codigo;
        const idcta = cuenta.id;
        const nomcta = cuenta.nombre;

        if (!this.categorias[cat.id]) {
          this.categorias[cat.id] = {
            id: cat.id,
            nombre: cat.nombre,
            tipos: [],
            orden: cat.orden

          };

        }

        // busca tipos 
        let tipos = this.categorias[cat.id].tipos;
        let existeTipo = tipos.find(tipo => tipo.id === tip.id);
        if (typeof existeTipo == 'undefined') {

          // es el primer registro
          tipos.push({
            'id': tip.id, 'nombre': tip.nombre,
            'cuentas': [{ 'id': idcta, 'cod': codigocta, 'nomcta': nomcta, 'total_presupuesto': 0, 'total_presupuesto_borrador': 0 }
            ]
          })
          this.categorias[cat.id].tipos = tipos;

        } else {


          existeTipo.cuentas.push({ 'id': idcta, 'cod': codigocta, 'nomcta': nomcta, 'total_presupuesto': 0, 'total_presupuesto_borrador': 0 })
          this.categorias[cat.id].tipos.cuentas = existeTipo;

        }


        /*
           [
          {
             "id":65,
             "codigo":"4510308032",
             "nombre":"Agua",
             "tipo_cuenta":{
                "id":14,
                "nombre":"SERVICIOS BASICOS",
                "categoria_cuenta":{
                   "id":8,
                   "nombre":"GASTOS GENERALES",
                   "orden":3
                }
             }
          },
          {
             "id":112,
             "codigo":"4510308044",
             "nombre":"Alarma",
             "tipo_cuenta":{
                "id":13,
                "nombre":"GTOS BASICOS CASAS E INSTALACIONES",
                "categoria_cuenta":{
                   "id":8,
                   "nombre":"GASTOS GENERALES",
                   "orden":3
                }
             }
          }
       ]      
         */



      });

      this.categorias = Object.values(this.categorias).sort((a, b) =>
        (a.orden ?? Infinity) -
        (b.orden ?? Infinity)
      );
    },
    async leepresupuestos() {

      if (!this.centroSeleccionado) {
        return false;
      }
      this.editados = []
      this.buscarCentro = true;
      this.nombreCentro = this.centroNombre
      this.cuentaExpandidaBorrador = []

      this.loading = true

      const { getIngresos } = useIngresos();
      const promesas = []

      this.categorias.forEach(categoria => {
        (categoria.tipos || []).forEach(tipo => {
          (tipo.cuentas || []).forEach(cuenta => {

            promesas.push(
              getIngresos(this.centroSeleccionado, cuenta.id)
                .then(resp => {
                  if (resp) {

                    cuenta.total_presupuesto_borrador = resp.total_presupuesto_borrador
                    cuenta.total_presupuesto = resp.total_presupuesto
                    cuenta.total_gastos = resp.total_gastos
                    this.editados[cuenta.id] = resp.total_presupuesto_borrador
                  }
                })
            )

          })
        })
      })

      await Promise.all(promesas)

      this.categorias.forEach(categoria => {

        // 🔹 ordenar tipos por nombre
        categoria.tipos.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        )

        // 🔹 ordenar cuentas dentro de cada tipo
        categoria.tipos.forEach(tipo => {
          tipo.cuentas.sort((a, b) =>
            a.nomcta.localeCompare(b.nomcta)
          )
        })

      })


      this.loading = false
    },
    revisaExpansion(cuenta_id) {

      if (this.cuentaExpandida.includes(cuenta_id)) {
        return true;
      }
      return false;
    },
    revisaExpansionBorrador(cuenta_id) {

      if (this.cuentaExpandidaBorrador.includes(cuenta_id)) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.categoriasAgrupadas()
    this.centros()
  },
  components: {
    //  IngresosMensuales,
    IngresosMensualesBorrador
  }

}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>