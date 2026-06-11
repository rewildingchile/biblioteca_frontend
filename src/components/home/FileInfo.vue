<template>
 
            <!-- HEADER -->
            <div class="flex items-center justify-between px-6 py-4 border-b ">
              <h2 class="text-lg font-semibold text-white">
                Información del archivo
              </h2>

              <button @click="cerrar()" class="w-8 h-8 flex items-center justify-center text-white
               rounded-lg hover:bg-gray-200 transition">
                ✕
              </button>
            </div>

            <!-- CONTENIDO -->
            <div class="flex-1 overflow-y-auto p-2 space-y-3">

              <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                <!-- Cabecera -->
                <div class="bg-gray-50 border-b px-6 py-4 ">
                  <div class="mb-4 border-b border-gray-200 pb-3">

                    <p class="text-sm text-gray-500 mt-1">
                      Documento seleccionado
                    </p>
                    <h1 class="text-2xl mt-3 font-bold text-gray-800">
                      📄 {{ nodeSelec.name }}
                    </h1>


                  </div>

                </div>

                <!-- Link -->
                <div class="px-6 py-3 border-b bg-white">
                  <a :href="nodeSelec.web_view_link" target="_blank" class="inline-flex items-center gap-2
         px-5 py-3
         bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600
         hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700
         text-white font-semibold text-sm
         rounded-xl
         shadow-lg shadow-indigo-300/40
         hover:shadow-xl hover:shadow-violet-400/40
         transition-all duration-200">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14 3h7m0 0v7m0-7L10 14" />
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 14v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    </svg>

                    Ver documento original
                  </a>
                </div>

                <!-- Contenido -->
                <div class="p-6">
                  <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Contenido extraído
                  </h3>

                  <div class="max-h-[300px] overflow-y-auto  bg-gray-50 border border-gray-200 rounded-xl
             p-5 text-xs text-gray-700 text-left leading-relaxed font-mono" v-html="textoFormateado"></div>

                  <div class="mt-2 text-xs text-gray-500 flex flex-wrap gap-6 font-mono">
                    <span><strong>ID:</strong> {{ nodeSelec.id }}</span>
                    <span><strong>Tipo:</strong> {{ nodeSelec.mime_type }}</span>
                  </div>
                </div>

              </div>

            </div>

            <!-- FOOTER -->
            <div class="border-t p-4  bg-slate-950/70 ">
              <button @click="cerrar()" class="w-full py-2 rounded-xl
               bg-gray-200 hover:bg-gray-300
               text-gray-700 transition">
                Cerrar
              </button>
            </div>
 
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  nodeSelec: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['cerrarPanelDerecho'])
const textoFormateado = computed(() => {
  return props.nodeSelec?.text_content || ''
})

function cerrar(){
    emit('cerrarPanelDerecho')
}
</script>
