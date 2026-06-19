<template>
 
 
  <div class="ml-1   finance-panel relative overflow-hidden">

     <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/ListaCarpetasDriveEstrategia.vue&#62;</span>
    </div>

    <!-- GLOWS -->
    <div class="finance-glow finance-glow-cyan"></div>
    <div class="finance-glow finance-glow-pink"></div>

    <!-- HEADER -->
    <div class="relative z-10
             flex items-center justify-between
             border-b border-white/10
             px-3 py-3">

      <!-- LEFT -->
      <div class="flex items-center gap-4">

        <!-- ICON -->
        <div class="w-14 h-14 rounded-2xl
                 bg-cyan-500/10
                 border border-cyan-400/20
                 flex items-center justify-center
                 shadow-[0_0_25px_rgba(34,211,238,.18)]">

          <!-- FINANCE ICON -->
          <svg class="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" d="M3 17l6-6 4 4 7-7" />

            <path stroke-linecap="round" stroke-linejoin="round" d="M14 8h6v6" />

          </svg>

        </div>

        <!-- TITLE -->
        <div>

          <h1 class="text-2xln font-semiboldn tracking-widen  text-white">
            Estrategia
          </h1>

          <p class="text-sm
                   text-slate-400
                   mt-1">
            Google Drive · Unidad compartida
          </p>

        </div>

      </div>

      <!-- STATUS -->
      <div class="hidden lg:flex items-center gap-3
               px-4 py-2 rounded-xl
               border border-emerald-400/20
               bg-emerald-500/10">
        
         <div class="flex items-center gap-2">
 
 
       <button @click="showPanelBusqueda" class="flex items-center gap-2
         px-4 py-2 rounded-xl
         bg-cyan-500/10
         border border-cyan-400/20
         text-cyan-300
         hover:bg-cyan-500/20
         hover:border-cyan-300/40
         transition-all duration-200
         font-mono text-sm">

            <!-- SEARCH ICON -->
            <svg class="w-5 h-5 hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor"
              stroke-width="1.8" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6" stroke-linecap="round" stroke-linejoin="round" />

              <path stroke-linecap="round" stroke-linejoin="round" d="M20 20l-4.2-4.2" />
            </svg>
          </button>

          <button @click="listar(area_id)" class="flex items-center gap-2
         px-4 py-2 rounded-xl
         bg-cyan-500/10
         border border-cyan-400/20
         text-cyan-300
         hover:bg-cyan-500/20
         hover:border-cyan-300/40
         transition-all duration-200
         font-mono text-sm">

            <!-- REFRESH ICON -->
            <svg class="w-5 h-5 hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor"
              stroke-width="1.8" viewBox="0 0 24 24">

              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v6h6" />

              <path stroke-linecap="round" stroke-linejoin="round" d="M20 20v-6h-6" />

              <path stroke-linecap="round" stroke-linejoin="round" d="M20 9a8 8 0 00-13.66-4.66L4 6" />

              <path stroke-linecap="round" stroke-linejoin="round" d="M4 15a8 8 0 0013.66 4.66L20 18" />

            </svg>



          </button>
        </div>

        <div class="w-2 h-2 rounded-full
                 bg-yellow-100
                 animate-pulse"></div>



        <span class="text-xs uppercase tracking-[0.2em]
                 text-emerald-300 font-mono">
          Online
        </span>

      </div>

    </div>

    <!-- BODY -->
    <div class="relative z-10 p-1">



      <!-- TREE PANEL -->
      <div class="rounded-1xl  border border-white/10
               bg-white/[0.03]   backdrop-blur-xl  p-0
               shadow-[0_0_40px_rgba(0,0,0,.25)]">

        <!-- TITLE -->
        <div class="flex items-center gap-3 mb-2">



        </div>

        <!-- TREE -->
        <div class="overflow-auto
                 rounded-1xl
                 border border-white/5
                 bg-slate-950/40
                 p-4">
 
          <DriveTree :nodes="data" :area_id="area_id" />

        </div>

      </div>

    </div>

  </div>



</template>
<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
<script setup>
import { ref, onMounted, watch } from 'vue'
import api from "@/api/axios";
import DriveTree from './DriveTree.vue'

// Props
const props = defineProps({
  prop_area_id: {
    type: Number
  },
  prop_json_carpetas: {
    type: Object
  }
})

// Emits
const emit = defineEmits(['showPanelBusqueda'])

// Data
const data = ref([])
const area_id = ref(2)

// Methods
const ordenarChildrenAscendente = (nodes) => {
  // validar array
  if (!Array.isArray(nodes)) return

  // ordenar actual nivel
  nodes.sort((a, b) =>
    b.name.localeCompare(
      a.name,
      'es',
      { sensitivity: 'base' }
    )
  )

  // recorrer hijos recursivamente
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
      console.log('tiene hijos')
      ordenarChildrenAscendente(node.children)
    }
  })
}

const listar = async (area_id) => {
  try {
    const r = await api.get(`drive/tree/${area_id}/`)
    data.value = r.data
    ordenarChildrenAscendente(data.value)
  } catch (error) {
    console.error("error obteniendo arbol", error)
    throw error
  }
}

const inicializar = () => {
  listar(area_id.value)
}

const showPanelBusqueda = () => {
  emit('showPanelBusqueda', true)
}

// Lifecycle
onMounted(() => {
  inicializar()
})

// Watchers
watch(() => props.prop_json_carpetas, (newValue) => {
  data.value = newValue
})
</script>
