<template>
<div class="p-4 max-w-8xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-lg border border-slate-200">

  <!-- Título tipo etiqueta código -->
  <div class="flex justify-start mb-3">
    <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
      &lt;MaestrosCentros&gt;
    </span>
  </div>

  <!-- Header principal -->
  <div class="flex items-center justify-between px-6 py-4 mb-5 rounded-2xl bg-gradient-to-r from-indigo-800 to-blue-200 text-white shadow-md">
    <h2 class="text-lg font-semibold tracking-wide font-mono">
      Centros de Costo
    </h2>
  </div>


  <!-- Encabezado tabla desktop -->
  <div class="hidden sm:grid sm:grid-cols-4 bg-slate-100 text-slate-600 font-semibold p-3 rounded-xl shadow-sm font-mono">
    <div>Responsable</div>
    <div>Código centro de costo</div>
    
    <div> Centro de costo</div>
    <div class="text-center">Acciones</div>
  </div>


  <!-- Items -->
  <div v-for="item in listado" :key="item.id">

    <div
      class="grid grid-cols-1 sm:grid-cols-4 gap-3 p-5 mt-3 font-mono border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 bg-white hover:-translate-y-[2px]"
    >

      <!-- Responsable + acción crear -->
      <div class="flex flex-col gap-2">

        <span class="text-slate-600 text-sm">
          {{ item.user?.first_name }} {{ item.user?.last_name }}
        </span>

        <button
          v-if="!item.tiene_presupuesto"
          @click="presupuestos(item, item.tiene_presupuesto)"
          class="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 active:scale-95 transition shadow"
        >
          Crear presupuesto
          <span :id="'centro_'+ item.id">{{ item.ico }}</span>
        </button>

      </div>

     

      <!-- Código -->
      <div class="text-slate-700 font-medium tracking-wide" >
        {{ item.codigo }}
      </div>

  
 <div class="font-semibold text-indigo-600 text-base " >
      
         {{ item.nombre }}
      </div>

   

      <!-- Acciones principales -->
      <div >

        <div class="grid grid-cols-3 gap-2">

          <button
            v-if="this.$store.state.auth.userLogin.modifica_presupuestos === true"
            @click="cuentasConPresupuestoIncluidoCero(item, item.tiene_presupuesto)"
            :class="item.tiene_presupuesto ? '' : 'invisible'"
            class="w-full px-4 py-2 bg-gray-400 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 active:scale-95 transition shadow"
          >
            Plan Ctas
          </button>


          <button
            @click="toggleCuenta(item.id)"
            class="w-full px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 active:scale-95 transition shadow"
          >
            {{ centroExpandido.includes(item.id) ?  '▲' : '▼' }}  
          </button>


          <button
            @click="cuentasConPresupuestoMayorCero(item, item.tiene_presupuesto)"
            :class="item.tiene_presupuesto ? '' : 'invisible'"
            class="w-full px-4 py-2 bg-violet-500 text-white rounded-xl text-sm font-medium hover:bg-violet-600 active:scale-95 transition shadow"
          >
            Detalles
          </button>

        </div>

      </div>

    </div>


    <!-- Expandible -->
    <transition name="fade">

      <div
        v-if="revisaExpansion(item.id)"
        class="mt-1 w-full p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-sm text-gray-700 rounded-2xl shadow-inner animate-fadeIn"
      >

        <div class="grid gap-4">

          <TablaTotalesCentro :centro_id="item.id" />

          <GraficoTotalesCentro :centro_id="item.id" />

        </div>

      </div>

    </transition>

  </div>


</div>
</template>

<script>
 
import api from "@/api/axios";
 
 import TablaTotalesCentro from "../presupuestos/TablaTotalesCentro.vue" 
import GraficoTotalesCentro from "../presupuestos/GraficoTotalesCentro.vue";
export default {
  name: 'MaestroCentros',
   emits: [  "chgCentro"  ],
  props: {
    
  },
  data() {
    return {
      valor: '',
      listado_original: [],      
      listado: [],
      ocultos:[],
       total_presupuesto_centros:0,
    presupuesto_categorias:[],
      centroExpandido: [],
      
    }
  },
  computed: {
    resultado() {
      return this.valor
    }
  },
  methods: {
      toggleCuenta(id) {
 const i = this.centroExpandido.indexOf(id);
      if (i === -1) {

        this.centroExpandido.push(id);
        
      } else {
       
        this.centroExpandido.splice(i, 1);
     
      }
    }, 
    revisaExpansion( id ) {
      if ( this.centroExpandido.includes( id)) {
        return true;
      }
      return false;
    },
    async inicializar() {
   
     
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
       
      
        // filtra solo c.c con RESPONSABLE asignado
        this.listado=  this.listado_original.filter(c => c.usuarios && c.usuarios.length > 0);

      this.listado = Object.values(this.listado).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    ); 

        
        console.log("Inicio de sesión correcto ✅");
      } catch (e) {
        console.error("Credenciales inválidas ❌");
      }

    },
     
   
   async presupuestos(centro , tiene_presupuesto)
   {
      if (tiene_presupuesto){
        this.$emit("chgCentro", centro   );
        return;
      }
      try {
        const formData = new FormData();
        formData.append("centro_id", centro.id);

        const response = await api.post("/api/v1/creacionpresupuesto/", formData);

        if(response.status===201){
              console.log("Presupuesto creado ✅");
              this.ocultos.push(centro.id);
              document.getElementById('centro_'+centro.id).innerHTML  = '✅';
            
        }
        

      
      } catch (e) {
        console.error("Credenciales inválidas ❌");
      }
    },
   async cuentasConPresupuestoMayorCero(centro  )
   {
       this.$emit("chgCentroCuentasMayorCero", centro  );
    },
   async cuentasConPresupuestoIncluidoCero(centro  )
   {
       this.$emit("chgCentroCuentasIncluidoCero", centro  );
    },
    async plandecuentas(centro  )
   {
      this.$emit("chgCentro", centro  );
   },
    procesar() {
      // TODO: implementar
    },
    limpiar() {
      // TODO: implementar
    },
 
  },
  mounted() {
    this.inicializar()
    
  },
   components: {
    TablaTotalesCentro,
    GraficoTotalesCentro
  },

}
</script>