 <template>
  
 <div class="flex items-center justify-between px-6 py-4 border-b ">
  <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/ListRequest.vue&#62;</span>
    </div>
    <h2 class="text-lg font-semibold text-black">
    Lista de solicitudes de actualización
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
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      >
        <!-- Encabezado con tipo -->
        <div 
          :class="[
            'px-4 py-3 border-b',
            item.carpeta ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
          ]"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <!-- Icono según tipo -->
              <span 
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  item.carpeta ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                ]"
              >
                {{ item.carpeta ? '📁 Carpeta' : '📄 Archivo' }}
              </span>
              <span 
                v-if="item.carpeta?.pendiente || item.archivo?.pendiente"
                class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
              >
                Pendiente
              </span>

              <span  class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"2>
              {{ item.carpeta?.type_action_request_nombre  }}
              {{ item.archivo?.type_action_request_nombre  }}
              </span>


            </div>
            <span class="text-xs text-gray-500">
              {{ formatDate(item.carpeta?.last_synced_at || item.archivo?.last_synced_at) }}
            </span>
          </div>
        </div>

        <!-- Contenido -->
        <div class="p-4">
          <!-- Datos de carpeta o archivo -->
          <div v-if="item.carpeta" class="space-y-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                📁{{ item.carpeta.name }}
              </h3>
              <p class="text-sm text-gray-500 truncate">
                ID: {{ item.carpeta.drive_file_id }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span class="text-gray-500">Acción:</span>
               
              </div>
              <div>
                <span class="text-gray-500">Origen:</span>
             
              </div>
              <div>
                <span class="text-gray-500">📁Destino:</span>
               
              </div>
              <div>
           
                <span class="ml-1 font-medium">{{ item.carpeta.type_action_request_nombre  }}</span>
              </div>
              <div>
                
                <span class="ml-1 font-medium">{{ item.carpeta.googledrivefile_folder_origin_name || 'N/A' }}</span>
              </div>
              <div>
                
                <span class="ml-1 font-medium">{{ item.carpeta.googledrivefile_folder_final_name || 'N/A' }}</span>
              </div>
            </div>

           <!-- <div class="text-sm">
              <span class="text-gray-500">Parent:</span>
              <span class="ml-1 font-medium">{{ item.carpeta.parent_name }}</span>
            </div>
            -->
           

            <!-- Children count -->
            <div v-if="item.children && item.children.length > 0" class="mt-2">
              <button 
                @click="toggleChildren(index)"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <span>{{ showChildren[index] ? '▼' : '▶' }}</span>
                <span class="ml-1">{{ item.children.length }} archivos</span>
              </button>

              <!-- Lista de children -->
              <div v-if="showChildren[index]" class="mt-2 space-y-2 max-h-60 overflow-y-auto">
                <div 
                  v-for="(child, childIndex) in item.children" 
                  :key="childIndex"
                  class="bg-gray-50 rounded p-2 text-sm border border-gray-200"
                >
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

          <!-- Datos de archivo -->
          <div v-else-if="item.archivo" class="space-y-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 truncate">
                {{ item.archivo.name }}
              </h3>
              <p> <span class="text-gray-500">MIME: {{ item.archivo.mime_type }}</span></p>
              <p class="text-sm text-gray-500 truncate">
                ID: {{ item.archivo.drive_file_id }}
              </p>
            </div>

            <div class="grid grid-cols-3 gap-2 text-sm">
               <div>
                <span class="text-gray-500">Acción:</span>
                
              </div>
              
              <div>
                <span class="text-gray-500">Origen:</span>
                
              </div>
              <div>
                <span class="text-gray-500">Destino:</span>
                 
              </div>
               
               <div>
               <span class="ml-1 font-medium">{{ item.archivo?.type_action_request_nombre  }}</span>
              </div>
              
              <div>
               
                <span class="ml-1 font-medium">{{ item.archivo?.parent_name }}</span>
              </div>
              <div>
                 
                <span class="ml-1 font-medium">📁{{ item.archivo.googledrivefile_folder_final_name || 'N/A' }}</span>
              </div>
            </div>

            <!---<div class="text-sm">
              <span class="text-gray-500">Parent:</span>
              <span class="ml-1 font-medium">{{ item.archivo.parent_name }}</span>
            </div>
            -->
            
          </div>

          <!-- Acciones -->
          <div class="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
          
            <button class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
              Anular
            </button>
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
const data = ref([])
const isPreparing = ref(false)
const emit = defineEmits(['cerrarPanelDerecho' ])  
 
async function loadFromApi() {
  
  
  try {
     // 2. Llamar al backend  
    console.log(`📁 buscando user_request ${props.area_id}`)
    const response = await api.post(API_PREPARE_ENDPOINT, {
      area_id: props.area_id,
    })
    data.value=response.data
    
  } catch (error) {
    console.error(`❌ Error leyendo api`, error)
    throw error
  }  
}
function cerrar(){
   emit('cerrarPanelDerecho')
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

