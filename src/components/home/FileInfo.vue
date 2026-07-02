<template>

  <!-- HEADER -->
  <div
    class="flex items-center justify-between px-6 py-5
    bg-gradient-to-r from-sky-500 to-blue-600
     border-b border-blue-200"
  >

    <div>
      <div class="text-xs font-semibold tracking-wider text-sky-100 uppercase">
        <span v-if="nodeSelec.is_folder">Carpeta</span>
        <span v-else>Archivo</span>
      </div>

      <h1 class="text-2xl font-bold text-white mt-1 break-all">
        <span v-if="nodeSelec.is_folder">📁</span>
        <span v-else>📄</span>
        {{ nodeSelec.name }}
      </h1>
    </div>

    <button
      @click="cerrar()"
      class="w-10 h-10 flex items-center justify-center
      text-white rounded-xl
      hover:bg-white/20 transition"
    >
      ✕
    </button>

  </div>

  <!-- CONTENIDO -->
  <div
    class="flex-1 overflow-y-auto p-4 space-y-4
    bg-gradient-to-br from-blue-50 via-white to-sky-50"
  >

    <!-- ACCIONES -->
    <div
      class="flex flex-wrap items-center gap-3
      p-4 bg-white rounded-2xl
      border border-blue-100 shadow-sm"
    >

      <!-- VER -->
      <div v-if="!nodeSelec.is_folder">
        <a
          @click="documentView()"
          target="_blank"
          class="cursor-pointer inline-flex items-center gap-2
          px-5 py-3
          bg-sky-600 hover:bg-sky-700
          text-white font-semibold text-sm
          rounded-xl shadow-md hover:shadow-lg
          transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.2-4.2" stroke-linecap="round" />
          </svg>

          Ver
        </a>
      </div>

      <!-- GDRIVE -->
      <div v-if="!nodeSelec.is_folder">
        <a
          :href="nodeSelec.web_view_link"
          target="_blank"
          class="inline-flex items-center gap-2
          px-5 py-3
          bg-blue-600 hover:bg-blue-700
          text-white font-semibold text-sm
          rounded-xl shadow-md hover:shadow-lg
          transition-all duration-200"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 3h8l5 9-4 7H7l-4-7z"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 3l4 7m4-7l-4 7M4 12h17"
            />
          </svg>

          Google Drive
        </a>
      </div>

      <!-- BORRAR -->
      <div>
        <a
          @click="confirmDelete()"
          class="cursor-pointer inline-flex items-center gap-2
          px-5 py-3
          bg-red-500 hover:bg-red-600
          text-white font-semibold
          rounded-xl shadow-md hover:shadow-lg
          transition-all duration-200"
        >
          🗑 Borrar
        </a>
      </div>

    </div>

    <!-- INFORMACIÓN -->
    <div
      class="bg-white rounded-3xl
      shadow-lg border border-blue-100 overflow-hidden"
    >

      <!-- DESCRIPCIÓN -->
      <div class="p-6">

        <div class="flex items-center gap-2 mb-1">
          <svg
            class="w-5 h-5 text-sky-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5h2m-1-1v2m-7 5h14M5 13h14M5 17h10"
            />
          </svg>

          <span class="text-sm font-semibold text-sky-700">
            Agregar información adicional 
          </span>
        </div>

        <div
          class="max-h-[200px] overflow-y-auto
          bg-sky-50 border border-sky-100
          rounded-2xl py-5 px-6"
        >
          <textarea
            :value="descripcion"
            @input="descripcion = $event.target.value"
            @blur="handleBlurDescripcion"
            class="w-full bg-transparent outline-none resize-none
            text-sm text-slate-700"
          ></textarea>
        </div>

      </div>

      <div class="p-6" v-if="!nodeSelec.is_folder"> 

          <div class="flex items-center gap-2 mb-1">
          <svg
            class="w-5 h-5 text-sky-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5h2m-1-1v2m-7 5h14M5 13h14M5 17h10"
            />
          </svg>

          <span class="text-sm font-semibold text-sky-700">
            Texto extraido automaticamente
          </span>
        </div>


          <div
            class="max-h-[300px] overflow-y-auto
            bg-sky-50 border border-sky-100
            rounded-2xl p-5
            text-xs text-slate-700
            text-left leading-relaxed font-mono"
            v-html="textoFormateado"
          >
          </div>

        </div>

        <!-- METADATOS -->
        <div class="mt-0 flex flex-wrap gap-3">

          <span
            class="px-3 py-1 rounded-full
            bg-sky-100 text-sky-700
            border border-sky-200
            text-xs font-medium"
          >
            ID: {{ nodeSelec.id }}
          </span>

          <span
            class="px-3 py-1 rounded-full
            bg-blue-100 text-blue-700
            border border-blue-200
            text-xs font-medium"
          >
            Tipo: {{ nodeSelec.mime_type }}
          </span>

        </div>

      </div>

     

  </div>

  <!-- FOOTER -->
  <div
    class="border-t border-blue-100
    p-4 bg-sky-50 rounded-b-3xl"
  >
    <button
      @click="cerrar()"
      class="w-full py-3 rounded-xl
      bg-sky-600 hover:bg-sky-700
      text-white font-semibold
      transition-all shadow-md hover:shadow-lg"
    >
      Cerrar
    </button>
  </div>


  <div v-if="showConfirmDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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


  <div v-if="showConfirmViewFile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
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
            <p class="text-sm text-white/70">{{ fileName || 'Documento' }}</p>
          </div>
        </div>
        <button 
          @click="closeModal" 
          class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
        >
          <svg class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Contenido del PDF con scroll -->
      <div class="flex-1 overflow-auto p-4 bg-gray-50/50">
        <div class="pdf-viewer-simple h-full bg-white rounded-lg shadow-inner">
          <!-- Aquí va tu visor de PDF -->
          <div class="p-4">
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
          @click="closeModal"
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


const descripcion = ref(props.nodeSelec?.description || '')

const handleBlurDescripcion = (event) => {
  const value = event.target.value
  updDescrip(value)
}

const emit = defineEmits(['cerrarPanelDerecho'])
const textoFormateado = computed(() => {
  return props.nodeSelec?.text_content || ''
})
async function documentView(){
   showConfirmViewFile.value=true
   loadPDF()
}
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
 async function updDescrip(value) {
      try {
        const data = { file_id: props.nodeSelec?.drive_file_id,description:value };
        console.log('data',data)
        const resp = await api.post(
          `api/v1/filedocument/description/`,
          data,
          { headers: { "Content-Type": "application/json"  } }
        );
        const status = resp.data.status;
        switch (status) {
          case 200:
            console.log("actualizado");
          
            break;
          default:
            console.error("");
        }
        return true;
      } catch (err) {
        console.log(err);
      }
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
