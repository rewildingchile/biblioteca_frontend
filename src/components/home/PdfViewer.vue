<template>
  
  <div  class="fixed inset-0 z-50 flex items-center justify-center ">
    <div class="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden border border-white/10">
      
      <!-- Header con gradiente -->
      <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-white">Vista previa del archivo</h2>
            <p class="text-sm text-white/70">{{ props.nodeSelec.name  }}</p>
          </div>
        </div>
        <button 
         @click="cerrar()" 
          class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
        >
          <svg class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
 
      <div class="flex-1 overflow-auto p-0 bg-gray-50/50">
        <div class="pdf-viewer-simple h-full bg-white rounded-lg shadow-inner">
          <!--  visor de PDF -->
         <div
            v-if="loading"
            class="fixed inset-0 z-[9999]  flex items-center justify-center"
             >
            <div class="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span class="mt-4 text-gray-700 font-medium">
                Cargando...
              </span>
            </div>
          </div>
          <div class="p-0">
           <iframe
      ref="pdfFrame"
      :src="pdfUrl"
      width="100%"
      height="800"
    />
          </div>
        </div>
      </div>
      
      <!-- Footer con acciones -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button 
          @click="cerrar()"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cerrar
        </button>
        <button 
          @click="downloadFile"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api/axios";
import {  ref } from 'vue'
import { computed } from 'vue'   
import {  onMounted, onBeforeUnmount, watch } from 'vue'

 
 
const API_ENDPOINT = '/api/v1/deletefile/'
let showConfirmDelete   = ref(false)
let showConfirmViewFile = ref(false)
let pdfUrl = ref('')
let pdfData = ref('')
let borrando=ref(false)
let loading = ref(false)
const props = defineProps({
  nodeSelec: {
    type: Object,
    required: true
  }
})

 
const emit = defineEmits(['cerrarPdfViewer'])
 
onMounted(async () => {
  await loadPDF()
})

function cerrar(){
  console.log('cerrando')
    emit('cerrarPdfViewer')
}
 
 
 

// Métodos
async function loadPDF(){
  loading.value = true
 
  
  try {
    // Obtener el PDF del backend
    const response = await api.get(`/api/v1/drive/files/${props.nodeSelec?.drive_file_id}/view/`)
    
    if (response.data.success) {
     
      const base64Content = response.data.file.content;
      
  
      
      // Convertir base64 a Blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Crear URL de objeto
      const url = URL.createObjectURL(blob);
      pdfUrl.value = url;
      
 
      loading.value = false
    }
  } catch (err) {
    console.error('❌ Error cargando PDF:', err) 
    loading.value = false
  }
}



 



 
</script>
