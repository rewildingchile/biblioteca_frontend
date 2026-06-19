<template>

            <!-- HEADER -->
            <div class="flex items-center justify-between px-6 py-4 border-b ">
              <h2 class="text-lg font-semibold text-black">
                   <span v-if="nodeSelec.is_folder">CARPETA</span>
                   <span v-else>ARCHIVO</span>
                   area : {{ area_id }}
              </h2>

              <button @click="cerrar()" class="w-8 h-8 flex items-center justify-center text-black
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
                      Elemento seleccionado
                    </p>
                    <h1 class="text-2xl mt-3 font-bold text-gray-800">
                      <span v-if="nodeSelec.is_folder">📁</span>
                      <span v-else> 📄 </span>
                     
                      
                      {{ nodeSelec.name }}
                    </h1>


                  </div>

                </div>

                <!-- Link -->
                  
                <div  v-if="!nodeSelec.is_folder" class="px-6 py-3 border-b bg-white">
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
                 
                  <div  v-if="!nodeSelec.is_folder">
                  <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Contenido extraído
                  </h3>

                  <div class="max-h-[300px] overflow-y-auto  bg-gray-50 border border-gray-200 rounded-xl
                 p-5 text-xs text-gray-700 text-left leading-relaxed font-mono" v-html="textoFormateado">
                  </div>
                  </div>

                  <div class="mt-2 text-xs text-gray-500 flex flex-wrap gap-6 font-mono">
                    <span><strong>ID:</strong> {{ nodeSelec.id }}</span>
                    <span><strong>Tipo:</strong> {{ nodeSelec.mime_type }}</span>
                  </div>
                  <div class="mt-2 text-xs text-gray-500 flex flex-wrap gap-6 font-mono">
                      <a 
                      @click="confirmDelete()"
                      class="inline-flex items-center gap-2
                    px-5 py-3
                    bg-gradient-to-r from-red-600 to-rose-600
                    hover:from-red-700 hover:to-rose-700
                    text-white font-semibold
                    rounded-xl
                    shadow-lg
                    hover:shadow-xl
                    transition-all duration-200">
                        🗑 Borrar este elemento
                      </a>
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

      
  <div
  v-if="showConfirmDelete"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
>
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

    <!-- Icono -->
    <div class="flex justify-center mb-4">
      <div class="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        <svg
          class="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 7L5 7M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
          />
        </svg>
      </div>
    </div>

    

    <!-- Título -->
    <h2 class="text-xl font-bold text-center text-gray-800">
      Confirmar eliminación de 
      <span v-if="nodeSelec.is_folder">esta carpeta </span>
      <span v-else>este archivo </span>
    </h2>

    <!-- Mensaje -->
    <p class="mt-3 text-center text-gray-600">
      ¿Confirma que desea borrar este elemento?
    </p>
 <p v-if="nodeSelec.is_folder" class="mt-2 text-center text-sm text-red-600">
     Se borrará la carpeta y todas las subcarpetas y archivos contenidos dentro de ella.
    </p>
    <p class="mt-2 text-center text-sm text-red-600">
      Esta acción no se puede deshacer.
    </p>

    <!-- Botones -->
    <div class="mt-6 flex justify-center gap-3">

      <button
        @click="showConfirmDelete = false"
        class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition"
      >
        Cancelar
      </button>

      <button 
        @click="borrarArchivo"
        class="px-5 py-2 rounded-xl
               bg-red-600 text-white
               hover:bg-red-700
               shadow-md transition"
      >
        Sí, borrar
      </button>
      
      <span v-if="borrando" class="text-blink">Borrando archivo ...</span>

    </div>

  </div>
</div>
</template>

<script setup>
import api from "@/api/axios";
import {  ref } from 'vue'
import { computed } from 'vue'
const API_ENDPOINT = '/api/v1/deletefile/'
let showConfirmDelete = ref(false)
let borrando=ref(false)
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
function confirmDelete(){
  showConfirmDelete.value=true
}
async function borrarArchivo(){
    console.log(`⚠️ Borrando archivo: ${props.nodeSelec?.drive_file_id}`)
    borrando.value = true
    const response = await api.post(API_ENDPOINT, {
      drive_file_id: props.nodeSelec?.drive_file_id
    })
    console.log(response)
    if (response.data.success){
      emit('cerrarPanelDerecho')
    }
}
</script>
