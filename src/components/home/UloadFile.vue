 <template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-2">
        
        <p class="text-slate-500">Arrastra archivos o carpetas para comenzar</p>
      </div>

      <!-- Zona de drag & drop -->
      <div
        class="relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer"
        :class="dragOver 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
          : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="flex gap-4 text-4xl">
            <span class="text-slate-400">📄</span>
            <span class="text-slate-400">📁</span>
          </div>
          
          <p class="text-slate-600">Arrastra aquí archivos o carpetas</p>
          
          <div class="flex gap-3 flex-wrap justify-center">
            <button 
              @click="triggerFileInput"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>📄</span> Seleccionar archivos
            </button>
            <button 
              @click="triggerFolderInput"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>📁</span> Seleccionar carpeta
            </button>
          </div>

          <div class="flex gap-2 mt-2">
            <button 
              @click="pauseQueue" 
              :disabled="isPaused"
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-all duration-200 text-sm"
            >
              ⏸️ Pausar
            </button>
            <button 
              @click="resumeQueue" 
              :disabled="!isPaused"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg transition-all duration-200 text-sm"
            >
              ▶️ Reanudar
            </button>
            <button 
              @click="clearCompletedAndErrors"
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 text-sm flex items-center gap-1"
            >
              🗑️ Limpiar ({{ completedAndErrorsCount }})
            </button>
          </div>
        </div>

        <input ref="fileInput" type="file" multiple style="display: none" @change="handleFilesSelected" />
        <input ref="folderInput" type="file" webkitdirectory multiple style="display: none" @change="handleFolderSelected" />
      </div>

      <!-- Indicador de preparación -->
      <div v-if="isPreparing" class="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right">
        <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span class="text-sm font-medium">Preparando estructura de carpetas...</span>
      </div>

      <!-- Cola de subida CON SCROLL -->
      <div v-if="queue.length" class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-800">
            Cola de subida
            <span class="ml-2 px-2 py-0.5 bg-slate-200 rounded-full text-sm text-slate-600">{{ queue.length }}</span>
          </h2>
          <div v-if="totalProgress > 0" class="text-sm font-medium text-blue-600">
            {{ totalProgress }}% completado
          </div>
        </div>

        <!-- Contenedor con scroll vertical -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-slate-100">
              <div 
                v-for="item in queue" 
                :key="item.id" 
                class="p-4 hover:bg-slate-50 transition-colors duration-150"
              >
                <div class="flex items-start justify-between gap-4 flex-wrap">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xl">{{ item.relativePath ? '📁' : '📄' }}</span>
                      <strong class="text-slate-800 truncate">{{ item.name }}</strong>
                    </div>
                    <div class="text-xs text-slate-400 truncate" v-if="item.relativePath">
                      {{ item.relativePath }}
                    </div>
                    <div class="mt-2">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': item.status === 'pending',
                          'bg-blue-100 text-blue-800': item.status === 'uploading',
                          'bg-green-100 text-green-800': item.status === 'completed',
                          'bg-red-100 text-red-800': item.status === 'error',
                          'bg-gray-100 text-gray-800': item.status === 'cancelled'
                        }"
                      >
                        {{ statusText(item.status) }}
                      </span>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button 
                      v-if="item.status === 'uploading'" 
                      @click="cancelUpload(item)"
                      class="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      ⛔ Cancelar
                    </button>
                    <button 
                      v-if="item.status === 'pending'" 
                      @click="removeFromQueue(item)"
                      class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      ❌ Eliminar
                    </button>
                    <button 
                      v-if="item.status === 'error'" 
                      @click="retryUpload(item)"
                      class="px-3 py-1.5 text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
                    >
                      🔄 Reintentar
                    </button>
                  </div>
                </div>

                <!-- Barra de progreso -->
                <div v-if="item.status === 'uploading' || item.status === 'pending'" class="mt-3">
                  <div class="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-300"
                      :class="item.status === 'uploading' ? 'bg-blue-500' : 'bg-yellow-500'"
                      :style="{ width: item.progress + '%' }"
                    ></div>
                  </div>
                  <div class="text-right text-xs text-slate-500 mt-1">{{ item.progress }}%</div>
                </div>

                <!-- Mensaje de error -->
                <div v-if="item.error" class="mt-2 text-sm text-red-600 bg-red-50 rounded-lg p-2">
                  {{ item.error }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de progreso total -->
        <div v-if="totalProgress > 0" class="mt-6">
          <div class="bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              :style="{ width: totalProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="mt-8 text-center py-12">
        <div class="text-6xl mb-4 opacity-50">📤</div>
        <p class="text-slate-400">No hay archivos en la cola</p>
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

const props = defineProps({
  nodeSelec: {
    type: Object,
    required: true
  }
})

// ---------- Configuración ----------
const MAX_CONCURRENT_UPLOADS = 3      // subidas simultáneas
const MAX_FILE_SIZE_MB = 100          // 100 MB (ajustado a tu backend)
const API_ENDPOINT = '/api/v1/upload/'
const API_PREPARE_ENDPOINT = '/api/v1/prepare-upload/'  // Nuevo endpoint

// ---------- Estado ----------
const fileInput = ref(null)
const folderInput = ref(null)
const dragOver = ref(false)
// Estado reactivo (Vue refs)
const queue = ref([]) // Cola de archivos a subir
const isPaused = ref(false) // Control de pausa manual
const isPreparing = ref(false)  // Indicador de preparación

// Estado no-reactivo (variables normales)
let activeUploads = 0  // Contador de subidas activas
let processingLoop = false // Evita bucles múltiples
let folderCache = new Map()  // Cache local: relativePath -> folder_id

// Propiedades computadas
const totalProgress = computed(() => {
  if (queue.value.length === 0) return 0
  
  const total = queue.value.reduce((sum, item) => {
    return sum + (item.progress || 0)
  }, 0)
  
  return Math.floor(total / queue.value.length)
})

const completedAndErrorsCount = computed(() => {
  return queue.value.filter(item => 
    item.status === 'completed' || item.status === 'error'
  ).length
})

// ---------- Funciones auxiliares ----------
const generateId = () => Date.now() + '-' + Math.random().toString(36).substr(2, 9)

function statusText(status) {
  const map = {
    pending: '⏳ Pendiente',
    uploading: '⬆️ Subiendo...',
    completed: '✅ Completado',
    error: '❌ Error',
    cancelled: '🚫 Cancelado'
  }
  return map[status] || status
}

function isFileWithinLimit(file) {
  const limitBytes = MAX_FILE_SIZE_MB * 1024 * 1024
  if (file.size > limitBytes) {
    console.warn(`Archivo ${file.name} excede el límite de ${MAX_FILE_SIZE_MB} MB`)
    return false
  }
  return true
}

// ---------- NUEVO: Preparar carpeta en backend (UNA SOLA VEZ) ----------
async function prepareFolder(relativePath) {
  
  if (!relativePath) return props.nodeSelec?.drive_file_id
  
   // 1. Verificar caché local
  if (folderCache.has(relativePath)) {
    console.log(`♻️ Usando caché local para: ${relativePath}`)
    return folderCache.get(relativePath) // ✅ Evita llamadas repetidas
  }
  
  isPreparing.value = true
  
  try {
     // 2. Llamar al backend para crear/obtener la carpeta
    console.log(`📁 Preparando carpeta: ${relativePath}`)
    const response = await api.post(API_PREPARE_ENDPOINT, {
      folder_id: props.nodeSelec?.drive_file_id,
      relative_path: relativePath
    })
    // 3. Guardar en caché ♻️
    const folderId = response.data.folder_id
    folderCache.set(relativePath, folderId)
    console.log(`✅ Carpeta preparada: ${relativePath} -> ${folderId}`)
    return folderId
  } catch (error) {
    console.error(`❌ Error preparando carpeta ${relativePath}:`, error)
    throw error
  } finally {
    isPreparing.value = false
  }
}

// ---------- Procesamiento optimizado de cola ----------
async function processQueue() {
  if (processingLoop) return // Evita múltiples procesadores
  processingLoop = true

  while (true) {
      // 1. Verificar pausa
    if (isPaused.value) {
      await new Promise(resolve => setTimeout(resolve, 500))
      continue
    }
 // 2. Obtener archivos pendientes
    const pendingItems = queue.value.filter(item => item.status === 'pending' && item.file)
    if (pendingItems.length === 0) break

    // 🔥 3. OPTIMIZACIÓN: Preparar carpetas ÚNICAS primero
    const uniquePaths = [...new Set(pendingItems.map(item => item.relativePath))]
    
    for (const path of uniquePaths) {
      if (path && !folderCache.has(path)) {
        try {
          const folderId = await prepareFolder(path)
          // Actualizar todos los items con este relativePath
          queue.value.forEach(item => {
            if (item.relativePath === path && !item.preparedFolderId) {
              item.preparedFolderId = folderId
            }
          })
          await saveQueueToDB()
        } catch (error) {
          console.error(`Error preparando carpeta ${path}:`, error)
          // Marcar items como error
          queue.value.forEach(item => {
            if (item.relativePath === path && item.status === 'pending') {
              item.status = 'error'
              item.error = `No se pudo preparar la carpeta: ${error.message}`
            }
          })
          await saveQueueToDB()
        }
      } else if (path) {
        // Usar caché local
        const folderId = folderCache.get(path)
        queue.value.forEach(item => {
          if (item.relativePath === path && !item.preparedFolderId) {
            item.preparedFolderId = folderId
          }
        })
      }
    }

    // 4. Lanzar subidas (máximo MAX_CONCURRENT_UPLOADS)
    const stillPending = queue.value.filter(item => item.status === 'pending' && item.file)
    while (activeUploads < MAX_CONCURRENT_UPLOADS && stillPending.length > 0) {
      const nextItem = stillPending.shift()
      const currentItem = queue.value.find(i => i.id === nextItem.id)
      if (currentItem && currentItem.status === 'pending') {
        activeUploads++
        uploadFile(currentItem).finally(() => {
          activeUploads--
        })
      }
    }

    await new Promise(resolve => setTimeout(resolve, 200))
  }
  processingLoop = false
}

// ---------- Subir archivo (usando folder preparado) ----------
async function uploadFile(item) {
  if (!item.file) {
    item.status = 'error'
    item.error = 'Archivo no disponible'
    await saveQueueToDB()
    return
  }

  item.status = 'uploading'
  item.progress = 0
  item.error = null
  const abortController = new AbortController()
  item.abortController = abortController

  const formData = new FormData()
  formData.append('file', item.file)
  
  // ✅ Usar folder_id preparado o el default
  const finalFolderId = item.preparedFolderId || props.nodeSelec?.drive_file_id
  formData.append('folder_id', finalFolderId)
  
  // Solo enviar relativePath si es necesario (el folder ya está preparado)
  if (item.relativePath && !item.preparedFolderId) {
    formData.append('relativePath', item.relativePath)
  }

  try {
    const response = await api.post(API_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: abortController.signal,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        item.progress = percent
        saveQueueToDB()
      }
    })
    item.status = 'completed'
    item.progress = 100
    item.abortController = null
    console.log('✅ Subido:', response.data)
    await saveQueueToDB()
  } catch (error) {
    if (error.message === 'canceled' || error.name === 'CanceledError') {
      item.status = 'cancelled'
      item.error = 'Cancelado por el usuario'
    } else {
      item.status = 'error'
      item.error = error.response?.data?.error || error.message
    }
    item.abortController = null
    await saveQueueToDB()
  }
}

// ---------- Agregar archivos a la cola (optimizado) ----------
async function addFilesToQueue(files, basePath = '') {
  // Agrupar por relativePath para preparar carpetas en batch
  const filesByPath = new Map()
  
  for (const file of files) {
    if (!isFileWithinLimit(file)) continue
    
    let relativePath = file.webkitRelativePath || basePath
    if (relativePath) {
      const lastSlash = relativePath.lastIndexOf('/')
      relativePath = lastSlash >= 0 ? relativePath.substring(0, lastSlash) : ''
    }
    
    if (!filesByPath.has(relativePath)) {
      filesByPath.set(relativePath, [])
    }
    filesByPath.get(relativePath).push(file)
  }
  
  // Primero, preparar TODAS las carpetas necesarias
  for (const [relativePath, pathFiles] of filesByPath) {
    if (relativePath && !folderCache.has(relativePath)) {
      try {
        const folderId = await prepareFolder(relativePath)
        folderCache.set(relativePath, folderId)
      } catch (error) {
        console.error(`Error preparando ${relativePath}:`, error)
        // Continuar de todas formas, el backend manejará el error
      }
    }
  }
  
  // Luego agregar archivos a la cola
  const newItems = []
  for (const file of files) {
    if (!isFileWithinLimit(file)) continue
    
    let relativePath = file.webkitRelativePath || basePath
    if (relativePath) {
      const lastSlash = relativePath.lastIndexOf('/')
      relativePath = lastSlash >= 0 ? relativePath.substring(0, lastSlash) : ''
    }
    
    newItems.push({
      id: generateId(),
      file: file,
      name: file.name,
      relativePath: relativePath,
      preparedFolderId: folderCache.get(relativePath), // Usar folder preparado
      status: 'pending',
      progress: 0,
      error: null,
      abortController: null
    })
  }
  
  if (newItems.length) {
    queue.value.push(...newItems)
    await saveQueueToDB()
    processQueue()
  }
}

// ---------- Resto de funciones (cancelUpload, removeFromQueue, retryUpload, clearCompleted, pauseQueue, resumeQueue) ----------
// ... (mantener igual que antes)

function cancelUpload(item) {
  if (item.abortController) {
    item.abortController.abort()
  }
}

async function removeFromQueue(item) {
  const index = queue.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    if (item.abortController) item.abortController.abort()
    queue.value.splice(index, 1)
    await saveQueueToDB()
  }
}

async function retryUpload(item) {
  if (item.status === 'error' || item.status === 'cancelled') {
    item.status = 'pending'
    item.progress = 0
    item.error = null
    await saveQueueToDB()
    processQueue()
  }
}

async function clearCompleted() {
  queue.value = queue.value.filter(item => item.status !== 'completed')
  await saveQueueToDB()
}

function pauseQueue() {
  isPaused.value = true
}

function resumeQueue() {
  isPaused.value = false
  processQueue()
}

async function clearCompletedAndErrors(){
  queue.value = queue.value.filter(item => 
    item.status !== 'completed' && item.status !== 'error'
  )
    await saveQueueToDB()
}

// ---------- Manejadores de UI ----------
function triggerFileInput() { fileInput.value.click() }
function triggerFolderInput() { folderInput.value.click() }

function handleFilesSelected(event) {
  const files = Array.from(event.target.files)
  if (files.length) addFilesToQueue(files)
  event.target.value = ''
}

function handleFolderSelected(event) {
  const files = Array.from(event.target.files)
  if (files.length) addFilesToQueue(files)
  event.target.value = ''
}

async function handleDrop(event) {
  dragOver.value = false
  const items = event.dataTransfer.items
  const files = []

  async function traverseFileTree(item, path = '') {
    if (item.isFile) {
      return new Promise((resolve) => {
        item.file((file) => {
          Object.defineProperty(file, 'webkitRelativePath', {
            value: path ? path + '/' + file.name : file.name,
            configurable: true
          })
          files.push(file)
          resolve()
        })
      })
    } else if (item.isDirectory) {
      const dirReader = item.createReader()
      return new Promise((resolve) => {
        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, path ? path + '/' + item.name : item.name)
          }
          resolve()
        })
      })
    }
  }

  const entries = []
  for (let i = 0; i < items.length; i++) {
    const entry = items[i].webkitGetAsEntry()
    if (entry) entries.push(entry)
  }

  await Promise.all(entries.map(entry => traverseFileTree(entry)))
  if (files.length) addFilesToQueue(files)
}

 

// ---------- IndexedDB (persistencia) ----------
const DB_NAME = 'UploadQueueDB'
const STORE_NAME = 'queue'
let db = null

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2) // Versión actualizada
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function saveQueueToDB() {
  if (!db) return
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  await store.clear()
  for (const item of queue.value) {
    const itemToStore = {
      ...item,
      file: item.file instanceof File ? item.file : null,
      abortController: null // No serializable
    }
    store.put(itemToStore)
  }
  return tx.complete
}

async function loadQueueFromDB() {
  if (!db) return []
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const items = await new Promise((resolve) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve([])
  })
  return items.map(item => ({
    ...item,
    file: item.file ? new File([item.file], item.name, { type: item.file.type }) : null,
    status: item.status === 'uploading' ? 'pending' : item.status,
    progress: 0,
    abortController: null
  }))
}

// ---------- Ciclo de vida ----------
onMounted(async () => {
  db = await openDB()
  const savedItems = await loadQueueFromDB()
  if (savedItems.length) {
    queue.value = savedItems
    processQueue()
  }
})

onBeforeUnmount(async () => {
  if (db) db.close()
})
</script>

