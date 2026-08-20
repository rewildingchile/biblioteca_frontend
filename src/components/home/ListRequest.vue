 <template>
  
 <div class="flex items-center justify-between px-6 py-4 border-b ">
  <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/ListRequest.vue&#62;</span>
    </div>
    <h2 class="text-sm  font-mono">
    
      Solicitudes modificación - {{ nom_area }}
    </h2>

    <button @click="cerrar()" class="w-8 h-8 flex items-center justify-center text-black
               rounded-lg hover:bg-gray-200 transition">
      ✕
    </button>
  </div>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
    <div class="max-w-4xl mx-auto">
      <div class="p-6 max-w-7xl mx-auto">
    
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="max-h-[60rem] overflow-y-auto font-mono">
            <!-- Grid de elementos -->
            <div class="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">

              <div v-for="(item, index) in data" :key="index"
                class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <!-- Encabezado con tipo -->
                <div
                  :class="['px-4 py-3 border-b', item.carpeta ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200']">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <!-- Información general -->
                    <div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs">
                      <!-- Área -->
                      <div class="flex items-center gap-1">
                        <span class="text-gray-600 font-medium">Área:</span>
                        <span class="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                          {{ item.carpeta?.area || item.archivo?.area }}
                        </span>
                      </div>

                      <!-- De -->
                      <div class="flex items-center gap-1">
                        <span class="text-gray-600 font-medium">De:</span>
                        <span class="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                          {{ item.carpeta?.user_name || item.archivo?.user_name }}
                        </span>
                      </div>



                      <!-- Acción Requerida -->
                      <div class="flex items-center gap-1">
                        <span class="text-gray-600 font-medium">Acción Requerida :</span>
                        <span class="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                          {{ item.carpeta?.type_action_request_nombre || item.archivo?.type_action_request_nombre }}
                        </span>
                      </div>
                    </div>
                    <!-- Estado -->
                    <div class="flex items-center gap-1 ">

                      <span v-if="item.carpeta?.pendiente || item.archivo?.pendiente"
                        class="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                      <span v-else class="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                        Completado
                      </span>
                    </div>
                    <!-- Fecha -->
                    <span class="text-xs text-gray-500 whitespace-nowrap">
                      {{ formatDate(item.carpeta?.last_synced_at || item.archivo?.last_synced_at) }}
                    </span>
                  </div>
                </div>

                <!-- Contenido -->
                <div class="p-4">
                  <!--  📁 📁 📁 SOLO CARPETA -->
                  <div v-if="item.carpeta" class="space-y-3">
                    <!-- <div class="text-lg font-semibold text-gray-900">   {{ item.carpeta?.type_action_request_nombre }} </div> -->
                    <div class="text-sm text-gray-800 ">


                      📁 {{ item.carpeta.name }}


                    </div>

                    <div v-if="TYPE_ACTION_REQUEST_NEW == item.carpeta?.type_action_request_id">
                      <span class="text-sm text-gray-800 ">
                        Carpeta destino: {{ item.carpeta?.googledrivefile_folder_final_name }}
                      </span>
                    </div>
                    <div v-if="TYPE_ACTION_REQUEST_RENAME == item.carpeta?.type_action_request_id">

                      <span class="text-sm text-gray-800 ">
                        Nuevo nombre: {{ item.carpeta.new_name }}
                      </span>
                    </div>


                    <!-- <div class="text-sm">
              <span class="text-gray-500">Parent:</span>
              <span class="ml-1 font-medium">{{ item.carpeta.parent_name }}</span>
            </div>
            -->


                    <!-- Children count -->
                    <div v-if="item.children && item.children.length > 0" class="mt-2">
                      <button @click="toggleChildren(index)"
                        class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                        <span>{{ showChildren[index] ? '▼' : '▶' }}</span>
                        <span class="ml-1">{{ item.children.length }} archivos</span>
                      </button>

                      <!-- Lista de children -->
                      <div v-if="showChildren[index]" class="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        <div v-for="(child, childIndex) in item.children" :key="childIndex"
                          class="bg-gray-50 rounded p-2 text-sm border border-gray-200 cursor-pointer" @click="documentView(child.drive_file_id)">
                          <div class="flex items-center justify-between">
                            <span class="font-medium truncate">{{ child.name }}</span>
                            <span class="text-xs text-gray-500">{{ child.mime_type }}</span>
                            
                          </div>
                          <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Parent: {{ child.parent_name }}</span>
                            <span>Acción: {{ child.type_action_request_nombre }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!--📕📕📕📕 SOLO ARCHIVO -->
                  <div v-else-if="item.archivo" class="space-y-3">
                
                   
                    <!-- <div class="text-lg font-semibold text-gray-900"> {{ item.archivo?.type_action_request_nombre }}</div> -->

                    <div class="text-sm text-gray-800   cursor-pointer"   @click="documentView(item.archivo.drive_file_id)">


                      📕 {{ item.archivo.name }}


                    </div>



                    <div v-if="TYPE_ACTION_REQUEST_NEW == item.archivo?.type_action_request_id">
                      <span class="text-sm text-gray-800 ">
                        Carpeta destino: {{ item.archivo?.googledrivefile_folder_final_name }}
                      </span>
                    </div>
                    <div v-if="TYPE_ACTION_REQUEST_RENAME == item.archivo?.type_action_request_id">
                      <span class="text-sm text-gray-800 ">
                        Nuevo nombre: {{ item.archivo?.new_name }}
                      </span>
                    </div>




                  </div>

                  <!-- Acciones -->
                  <div class="mt-4 pt-3 border-t border-gray-200 flex space-x-2 font-mono text-xs text-gray-400">

                    <!-- <button v-if="item.archivo?.id " @click="anular(  item.archivo.id  )" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                      Anular solicitud
                    </button> -->

                    <button v-if="item?.archivo?.id" @click="borrar(item?.archivo?.id)"
                      class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                      Borrar solicitud
                    </button>
                    <button v-if="item?.carpeta?.id" @click="borrar(item?.carpeta?.id)"
                      class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                      Borrar solicitud
                    </button>
                    <p> {{ item.archivo?.drive_file_id || item.carpeta?.drive_file_id }} </p>

                    <p>📁 Ubicación:{{ item.carpeta?.parent_name || item.archivo?.parent_name }}/</p>
                    <p> MIME: {{ item.archivo?.mime_type }} </p>
                  </div>
                </div>
              </div>
            </div>



            <!-- Estadísticas -->
            <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <p class="text-2xl font-bold text-blue-600">{{ totalCarpetas }}</p>
                  <p class="text-sm text-gray-600">Carpetas</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-600">{{ totalArchivos }}</p>
                  <p class="text-sm text-gray-600">Archivos</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-yellow-600">{{ totalPendientes }}</p>
                  <p class="text-sm text-gray-600">Pendientes</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-600">{{ totalChildren }}</p>
                  <p class="text-sm text-gray-600">Total Children</p>
                </div>
              </div>
            </div>
          </div>
        </div>

  
  </div>
 
    </div>
  </div>

    <div v-if="showConfirmAnularRequest" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
    <!-- Icono -->
    <div class="flex justify-center mb-4">
      <div class="flex items-center justify-center w-16 h-16  p-2 rounded-full bg-red-700 text-lg"  style="font-size: 40px;"> 
         ☠️
      </div>
    </div>

    

    <!-- Título -->
    <h2 class="text-xl font-bold text-center text-gray-800">
    Quiero anular esta solicitud
      
    </h2>

    <!-- Mensaje -->
    <p class="mt-3 text-center text-gray-600">
      ¿Confirma anulación?
    </p>
 

    <!-- Botones -->
    <div class="mt-6 flex justify-center gap-3">



      <button 
        @click="anularRequest"
        class="px-5 py-2 rounded-xl
               bg-red-600 text-white
               hover:bg-red-700
               shadow-md transition"
      >
        Sí, confirmo anulación
      </button>
      
             <button
        @click="showConfirmAnularRequest = false"
        class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition"
      >
        Cancelar
      </button>

    </div>

  </div>
  </div>
    <div v-if="showConfirmBorrarRequest" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-mono">
  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
    <!-- Icono -->
    <div class="flex justify-center mb-4">
      <div class="flex items-center justify-center w-16 h-16  p-2 rounded-full bg-red-700 text-lg"  style="font-size: 40px;"> 
         ☠️
      </div>
    </div>

    

    <!-- Título -->
    <h2 class="text-xl font-bold text-center text-gray-800">
    Quiero borrar esta solicitud
      
    </h2>

    <!-- Mensaje -->
    <p class="mt-3 text-center text-gray-600">
      ¿Confirma anulación?
    </p>
 

    <!-- Botones -->
    <div class="mt-6 flex justify-center gap-3">



      <button 
        @click="borrarRequest"
        class="px-5 py-2 rounded-xl
               bg-red-600 text-white
               hover:bg-red-700
               shadow-md transition"
      >
        Sí, confirmo anulación
      </button>
      
             <button
        @click="showConfirmBorrarRequest = false"
        class="px-5 py-2 rounded-xl
               bg-gray-100 text-gray-700
               hover:bg-gray-200 transition"
      >
        Cancelar
      </button>

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
            <h2 class="text-xl  text-white">Vista previa del archivo</h2>
            <p class="text-sm text-white/70">{{ fileName || 'Documento' }}</p>
          </div>
        </div>
        <button 
          @click="showConfirmViewFile=False"
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
          @click="showConfirmViewFile=False"
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

<style scoped>
@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-in {
  animation: slide-in-from-right 0.3s ease-out;
}

/* Scrollbar personalizado */
.max-h-96::-webkit-scrollbar {
  width: 8px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from "@/api/axios";
const API_PREPARE_ENDPOINT = '/api/v1/user_request/'  // Nuevo endpoint
const API_ENDPOINT_CANCELAR_REQUEST = '/api/v1/user_request/cancel/'  // Nuevo endpoint
const API_ENDPOINT_BORRAR_REQUEST = '/api/v1/user_request/delete/'  // Nuevo endpoint
const props = defineProps({
  nodeSelec: {
    type: Object,
    required: true
  },
  area_id:{
    type:Number,
    required:true
  }
})
/*
En Vue 3, no puedes acceder directamente a las variables de entorno desde el template. 
Debes importarlas o exponerlas en el componente. */
const TYPE_ACTION_REQUEST_DELETE = import.meta.env.VITE_TYPE_ACTION_REQUEST_DELETE
const TYPE_ACTION_REQUEST_RENAME = import.meta.env.VITE_TYPE_ACTION_REQUEST_RENAME
const TYPE_ACTION_REQUEST_NEW = import.meta.env.VITE_TYPE_ACTION_REQUEST_NEW
const data = ref([])
const isPreparing = ref(false)
const emit = defineEmits(['cerrarPanelDerecho' ])  
const showConfirmAnularRequest = ref(false)
const showConfirmBorrarRequest = ref(false)
const request_id = ref('')
let loading = ref(false)
let showConfirmViewFile = ref(false)
let pdfUrl = ref('')
let  is_admin = ref(false)
let nom_area = ref('')
async function loadFromApi() {
  
  
  try {
     // 2. Llamar al backend  
    console.log(`📁 buscando area_id ${props.area_id}`)
    const response = await api.post(API_PREPARE_ENDPOINT, {
      area_id: props.area_id,
    })
    nom_area.value = response.data.area
    data.value=response.data.solicitudes
    
  } catch (error) {
    console.error(`❌ Error leyendo api`, error)
    throw error
  }  
}

function anular(id){
  console.log(request_id)
  showConfirmAnularRequest.value=true
  request_id.value=id
}
function borrar(id){
 
  showConfirmBorrarRequest.value=true
  request_id.value=id
}

async function anularRequest(){
    console.log(`⚠️ anulando request ${request_id}`)
 
    const response = await api.post(API_ENDPOINT_CANCELAR_REQUEST, {
      request_id: request_id.value,
     
    })
    request_id.value=0
    if (response && response.data.success){
       console.log('request anulado exitosamente')
        showConfirmAnularRequest.value=false
        loadFromApi()
    }
   
}

async function borrarRequest(){
    console.log(`⚠️ borrando request ${request_id}`)
 
    const response = await api.post(API_ENDPOINT_BORRAR_REQUEST, {
      request_id: request_id.value,
     
    })
    request_id.value=0
    if (response && response.data.success){
       console.log('request anulado exitosamente')
        showConfirmBorrarRequest.value=false
        loadFromApi()
    }
   
}


function cerrar(){
   emit('cerrarPanelDerecho')
} 
async function documentView(drive_file_id){
   showConfirmViewFile.value=true
   loadPDF(drive_file_id)
}
// Métodos
async function loadPDF(drive_file_id){
  loading.value = true  
  try {
    // Obtener el PDF del backend
    const response = await api.get(`/api/v1/drive/files/${drive_file_id}/view/`)
    
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



// Estado para mostrar/ocultar children
const showChildren = ref({})

const toggleChildren = (index) => {
  showChildren.value[index] = !showChildren.value[index]
}

// Computed properties para estadísticas
const totalCarpetas = computed(() => {
  return data.value.filter(item => item.carpeta).length
})

const totalArchivos = computed(() => {
  return data.value.filter(item => item.archivo).length
})

const totalPendientes = computed(() => {
  return data.value.filter(item => 
    (item.carpeta?.pendiente || item.archivo?.pendiente)
  ).length
})

const totalChildren = computed(() => {
  return data.value.reduce((acc, item) => {
    return acc + (item.children?.length || 0)
  }, 0)
})

// Funciones helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}     



// ---------- Ciclo de vida ----------
onMounted(async () => {
 
 
  const savedItems = await loadFromApi()
  console.log("savedItems:",savedItems )
  
 
  
})

onBeforeUnmount(async () => {
  
})



</script>

