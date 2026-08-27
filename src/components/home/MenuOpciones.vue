<template>
  <div class="flex justify-between">
    <span
      class="text-xs text-indigo-500 font-mono text-sm bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;MenuOpciones&#62;</span>
  </div>
 <!-- HEADER -->
<div
  class="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-sky-500 to-blue-600 border-b border-blue-200">
  <!-- Cerrar -->
  <button @click="cerrar()"
    class="w-10 h-10 flex items-center justify-center text-white rounded-xl hover:bg-white/20 hover:rotate-90 transition-all duration-300 group">
    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor"
      viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>

<!-- CONTENIDO -->
<div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50 via-white to-sky-50 ">

  <!-- ACCIONES -->
  <div class="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">

    <!-- Título del archivo/carpeta -->
    <div class="flex items-center gap-4 w-full mb-4  p-4">
      <!-- Icono con fondo -->
      <div
        class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-4xl shadow-inner border border-sky-200">
        {{ nodeSelec.is_folder ? '📁' : '📄' }}
      </div>

      <div class="flex-1 min-w-0">
        <div class="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-0.5">
          {{ nodeSelec.is_folder ? 'Carpeta' : 'Archivo' }} {{ formatBytesToMB(nodeSelec.size) }}
        </div>
        <h1 class="font-momo text-sm font-semibold text-gray-800  ">
          <span class="font-mono">{{ nodeSelectName }}</span>
        </h1>
      </div>
    </div>

    <!-- Separador -->
    <div class="border-t border-gray-100 my-4"></div>

    <!-- Botones de acción - Menú Vertical -->
    <div class="space-y-2 w-full">
      
      <!-- Ver (solo archivos) -->
      <button v-if="!nodeSelec.is_folder" @click="documentView()"
        class="w-full px-4 py-3 text-lg font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] border border-blue-200/50">
        <span class="text-2xl">👁️</span> Ver
      </button>

      <!-- Descargar (solo archivos) -->
      <button v-if="!nodeSelec.is_folder" @click="documentDownload()"
        class="w-full px-4 py-3 text-lg font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] border border-green-200/50">
        <span class="text-2xl">⬇️</span> Descargar
      </button>

      <!-- Acciones de administrador -->
      <template v-if="is_admin">
        <!-- Renombrar (para ambos) -->
        <button @click="confirmRename()"
          class="w-full px-4 py-3 text-lg font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] border border-purple-200/50">
          <span class="text-2xl">✏️</span> Renombrar
        </button>

        <!-- Borrar -->
        <button @click="confirmDelete()"
          class="w-full px-4 py-3 text-lg font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] border border-red-200/50">
          <span class="text-2xl">🗑️</span> Borrar
        </button>
      </template>

    </div>

  </div>

</div>

<!-- FOOTER -->
<div class="border-t border-blue-100 p-4 bg-sky-50 rounded-b-3xl">
  <button @click="cerrar()" class="w-full py-3 rounded-xl
    bg-sky-600 hover:bg-sky-700
    text-white font-mono text-sm
    transition-all shadow-md hover:shadow-lg">
    Cerrar ventana
  </button>
</div>

  <div v-if="showConfirmDelete"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <!-- Icono -->
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-16 h-16 p-2 rounded-full bg-red-900 text-lg"
          style="font-size: 40px;">
          ☠️
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



        <button @click="borrarArchivo" class="px-5 py-2 rounded-xl
               bg-red-600 text-white
               hover:bg-red-700
               shadow-md transition">
          Sí, borrar
        </button>

        <button @click="showConfirmDelete = false" class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition">
          Cancelar
        </button>

        <span v-if="borrando" class="text-blink">Borrando archivo ...</span>

      </div>

    </div>
  </div>


  <div v-if="showConfirmViewFile"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
    <div
      class="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden border border-white/10">

      <!-- Header con gradiente -->
      <div
        class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/20 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl  text-white">Vista previa del archivo</h2>
            <p class="text-sm text-white/70">{{ fileName || 'Documento' }}</p>
          </div>
        </div>
        <button @click="showConfirmViewFile = False"
          class="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group">
          <svg class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido del PDF con scroll -->
      <div class="flex-1 overflow-auto p-4 bg-gray-50/50">
        <div class="pdf-viewer-simple h-full bg-white rounded-lg shadow-inner">
          <!-- Aquí va tu visor de PDF -->
          <div class="p-4">
            <iframe ref="pdfFrame" :src="pdfUrl" width="100%" height="800" />
          </div>
        </div>
      </div>

      <!-- Footer con acciones -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        <button @click="showConfirmViewFile = False"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          Cerrar
        </button>
        <button @click="downloadFile"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar
        </button>
      </div>
    </div>
  </div>


  <div v-if="showConfirmSendRequestDelete"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <!-- Icono -->
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-16 h-16  p-2 rounded-full bg-red-700 text-lg"
          style="font-size: 40px;">
          ☠️
        </div>
      </div>



      <!-- Título -->
      <h2 class="text-xl font-bold text-center text-gray-800">
        Confirmo que estoy solicitando borrar
        <span v-if="nodeSelec.is_folder">esta carpeta </span>
        <span v-else>este archivo </span>
        de la biblioteca
      </h2>

      <!-- Mensaje -->
      <p class="mt-3 text-center text-gray-600">
        ¿Confirma enviar solicitud?
      </p>


      <!-- Botones -->
      <div class="mt-6 flex justify-center gap-3">



        <button @click="enviarRequest('delete')" class="px-5 py-2 rounded-xl
               bg-red-600 text-white
               hover:bg-red-700
               shadow-md transition">
          Sí, enviar solicitud
        </button>

        <button @click="showConfirmSendRequestDelete = false" class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition">
          Cancelar
        </button>

      </div>

    </div>
  </div>


  <div v-if="showConfirmSendRequestRename"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <!-- Icono -->
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-16 h-16 p-2  rounded-full bg-blue-900 text-lg "
          style="font-size: 40px;">
          ✏️
        </div>
      </div>

      <div class="p-6 ">

        <div class="flex items-center gap-2 mb-1">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5h2m-1-1v2m-7 5h14M5 13h14M5 17h10" />
          </svg>
          <span class="text-sm text-sky-700"> {{ nodeSelectName }}</span>
        </div>

        <div class="max-h-[200px] overflow-y-auto   bg-sky-50 border border-sky-100 rounded-2xl py-5 px-6">


          <textarea :value="nodeSelectName" @input="new_name = $event.target.value" :placeholder="nodeSelectName" class="w-full bg-transparent outline-none resize-none
            text-sm text-slate-700  border-sky-600"></textarea>
        </div>

      </div>

      <!-- Título -->
      <h2 class="text-xl font-bold text-center text-gray-800">
        Confirmo que estoy solicitando renombrar
        <span v-if="nodeSelec.is_folder">esta carpeta </span>
        <span v-else>este archivo </span>
        en la biblioteca
      </h2>

      <!-- Mensaje -->
      <p class="mt-3 text-center text-gray-600">
        ¿Confirma enviar solicitud?
      </p>


      <!-- Botones -->
      <div class="mt-6 flex justify-center gap-3">



        <button @click="enviarRequest('rename')" class="px-5 py-2 rounded-xl
               bg-blue-600 text-white
               hover:bg-blue-700
               shadow-md transition">
          Sí, enviar solicitud
        </button>
        <button @click="showConfirmSendRequestRename = false" class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition">
          Cancelar
        </button>

      </div>

    </div>
  </div>



  
  <div v-if="showConfirmRename"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <!-- Icono -->
      <div class="flex justify-center mb-4">
        <div class="flex items-center justify-center w-16 h-16 p-2  rounded-full bg-blue-900 text-lg "
          style="font-size: 40px;">
          ✏️
        </div>
      </div>

      <div class="p-6 ">

        <div class="flex items-center gap-2 mb-1">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5h2m-1-1v2m-7 5h14M5 13h14M5 17h10" />
          </svg>
          <span class="text-sm text-sky-700"> {{ nodeSelectName }}</span>
        </div>

        <div class="max-h-[200px] overflow-y-auto   bg-sky-50 border border-sky-100 rounded-2xl py-5 px-6">


          <textarea :value="nodeSelectName" @input="new_name = $event.target.value" :placeholder="nodeSelectName" class="w-full bg-transparent outline-none resize-none
            text-sm text-slate-700  border-sky-600"></textarea>
        </div>

      </div>

      <!-- Título -->
      <h2 class="text-xl font-bold text-center text-gray-800">
        Vas a renombrar
        <span v-if="nodeSelec.is_folder">esta carpeta </span>
        <span v-else>este archivo </span>
        en la biblioteca
      </h2>

      <!-- Mensaje -->
      <p class="mt-3 text-center text-gray-600">
        ¿Confirmas?
      </p>


      <!-- Botones -->
      <div class="mt-6 flex justify-center gap-3">



        <button @click="renombrar" class="px-5 py-2 rounded-xl
               bg-blue-600 text-white
               hover:bg-blue-700
               shadow-md transition">
          Sí, renombrar
        </button>
        <button @click="showConfirmRename = false" class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition">
          Cancelar
        </button>
        <span v-if="loading">Cargando ...</span> 
      </div>

    </div>
  </div>
</template>


<script setup>
import api from "@/api/axios";
import { ref } from 'vue'
import { computed } from 'vue'
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()


const API_ENDPOINT = '/api/v1/deletefile/'
const API_ENDPOINT_POST_REQUEST = '/api/v1/user_request/post/'
let showConfirmDelete = ref(false)
let showConfirmViewFile = ref(false)
let showConfirmSendRequestDelete = ref(false)
let showConfirmSendRequestRename = ref(false)
let showConfirmRename = ref(false)
let pdfUrl = ref('')
let pdfData = ref('')
let borrando = ref(false)
let enviandorequest = ref(false)
let loading = ref(false)
let new_name = ref('')
let nodeSelectName  = ref('')
const props = defineProps({
  nodeSelec: {
    type: Object,
    required: true
  },
  rol: {
    type: Object
  },
  area_id: {
    type: Number,
    required: true
  }
})


let is_admin = false
let is_editor = false
//const rolUsr = props.rol
let rolUsr;
switch(props.area_id)
{
  case 1:
  rolUsr =  store.state.auth.userLogin.rolFinanzas
  break;
  case 2:
  rolUsr =  store.state.auth.userLogin.rolConservacion
  break;
}


console.log('rol:',rolUsr.id)
if (rolUsr) {
  is_admin = rolUsr?.id === 1
  is_editor = rolUsr?.id === 3
}

const descripcion = ref(props.nodeSelec?.description || '')
nodeSelectName.value = props.nodeSelec?.name

const handleBlurDescripcion = (event) => {
  const value = event.target.value
  updDescrip(value)
}
const emit = defineEmits(['cerrarPanelDerecho'])
const textoFormateado = computed(() => {
  return props.nodeSelec?.text_content || ''
})
async function documentView() {
  showConfirmViewFile.value = true
  loadPDF()
}
function cerrar() {

  emit('cerrarPanelDerecho')
}
function confirmDelete() {
  showConfirmDelete.value = true
}
function confirmRename(){
  showConfirmRename.value = true
}
function confirmSendRequestDelete() {
  showConfirmSendRequestDelete.value = true
}
function confirmSendRequestRename() {
  showConfirmSendRequestRename.value = true
}
async function borrarArchivo() {
  console.log(`⚠️ Borrando archivo: ${props.nodeSelec?.drive_file_id}`)
  borrando.value = true
  const response = await api.post(API_ENDPOINT, {
    drive_file_id: props.nodeSelec?.drive_file_id,
    area_id: props.area_id, 
  })
  console.log(response)
  if (response.data.success) {
    emit('cerrarPanelDerecho')
  }
}

async function enviarRequest(accion_label) {
  console.log(`⚠️ enviando request accion ${accion_label} ${props.nodeSelec?.drive_file_id}`)
  enviandorequest.value = true
  const response = await api.post(API_ENDPOINT_POST_REQUEST, {
    drive_file_id: props.nodeSelec?.drive_file_id,
    accion_label: accion_label,
    area_id: props.area_id,
    new_name: new_name.value,
  })
  console.log(response.data)
  if (response.data.success) {
    showConfirmSendRequestRename.value = false
    showConfirmSendRequestDelete.value = false
    emit('cerrarPanelDerecho')
  }
}
async function renombrar(value){
   try {
    
    loading.value=true
    const data = {area_id: props.area_id, 
                  drive_file_id: props.nodeSelec?.drive_file_id, 
                  new_name: new_name.value };
    console.log('data', data)
    const resp = await api.post(
      `api/v1/filedocumentname/update/`,
      data,
      { headers: { "Content-Type": "application/json" } }
    );
    const status = resp.data.status;
    switch (status) {
      case 200:
        loading.value=false
        nodeSelectName.value =new_name.value 
        showConfirmRename.value=false
        break;
      default:
        console.error("");
    }
    
    return true;
  } catch (err) {
    console.log(err);
  }
}
async function updDescrip(value) {
  try {
    const data = { file_id: props.nodeSelec?.drive_file_id, description: value };
    console.log('data', data)
    const resp = await api.post(
      `api/v1/filedocument/description/`,
      data,
      { headers: { "Content-Type": "application/json" } }
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

function formatBytesToMB(bytes, decimals = 2) {
  if (bytes === 0) return '0 MB';
  const mb = bytes / 1048576;
  return mb.toFixed(decimals) + ' MB';
}

// Métodos
async function loadPDF() {
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
