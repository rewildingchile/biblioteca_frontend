 <template>
  
 <div class="flex items-center justify-between px-6 py-4 border-b ">
  <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/ListRequest.vue&#62;</span>
    </div>
    <h2 class="text-lg font-semibold text-black">
    Listar user request
    </h2>

    <button @click="cerrar()" class="w-8 h-8 flex items-center justify-center text-black
               rounded-lg hover:bg-gray-200 transition">
      ✕
    </button>
  </div>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
    <div class="max-w-4xl mx-auto">
      
    
 
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
const isPreparing = ref(false)
const emit = defineEmits(['cerrarPanelDerecho' ])  
 
async function loadFromApi() {
  
  
  try {
     // 2. Llamar al backend  
    console.log(`📁 buscando user_request ${props.area_id}`)
    const response = await api.post(API_PREPARE_ENDPOINT, {
      area_id: props.area_id,
    })
    console.log(response)
  } catch (error) {
    console.error(`❌ Error leyendo api`, error)
    throw error
  }  
}
function cerrar(){
   emit('cerrarPanelDerecho')
} 
     
// ---------- Ciclo de vida ----------
onMounted(async () => {
 
 
  const savedItems = await loadFromApi()
  console.log("savedItems:",savedItems )
  
})

onBeforeUnmount(async () => {
  
})
</script>

