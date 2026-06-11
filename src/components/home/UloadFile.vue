<template>
<div class="w-full h-full bg-white p-4">
  <div class="uploader">
    <!-- Zona de drag & drop y botones -->
    <div
      class="drop-zone"
      :class="{ 'drag-over': dragOver }"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <p>Arrastra aquí archivos o carpetas</p>
      <div class="buttons">
        <button @click="triggerFileInput">📄 Seleccionar archivos</button>
        <button @click="triggerFolderInput">📁 Seleccionar carpeta</button>
        <button @click="pauseQueue" :disabled="isPaused">⏸️ Pausar</button>
        <button @click="resumeQueue" :disabled="!isPaused">▶️ Reanudar</button>
        <button @click="clearCompleted">🗑️ Limpiar completados</button>
      </div>
      <input ref="fileInput" type="file" multiple style="display: none" @change="handleFilesSelected" />
      <input ref="folderInput" type="file" webkitdirectory multiple style="display: none" @change="handleFolderSelected" />
    </div>

    <!-- Indicador de preparación -->
    <div v-if="isPreparing" class="preparing-indicator">
      <div class="spinner"></div>
      <span>Preparando estructura de carpetas en Google Drive...</span>
    </div>

    <!-- Cola de subida -->
    <div class="queue" v-if="queue.length">
      <h3>Cola de subida ({{ queue.length }})</h3>
      <div v-for="item in queue" :key="item.id" class="queue-item">
        <div class="info">
          <strong>{{ item.name }}</strong>
          <span class="path">{{ item.relativePath || 'Archivo suelto' }}</span>
          <span class="status" :class="item.status">{{ statusText(item.status) }}</span>
          <div class="actions">
            <button v-if="item.status === 'uploading'" @click="cancelUpload(item)">⛔ Cancelar</button>
            <button v-if="item.status === 'pending'" @click="removeFromQueue(item)">❌ Eliminar</button>
            <button v-if="item.status === 'error'" @click="retryUpload(item)">🔄 Reintentar</button>
          </div>
        </div>
        <div class="progress-bar" v-if="item.status === 'uploading' || item.status === 'pending'">
          <div class="progress" :style="{ width: item.progress + '%' }"></div>
        </div>
        <div class="error" v-if="item.error">{{ item.error }}</div>
      </div>
      <div class="total-progress" v-if="totalProgress > 0">
        Progreso total: {{ totalProgress }}%
      </div>
    </div>
  </div>
  </div>
</template>

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
const queue = ref([])
const isPaused = ref(false)
const isPreparing = ref(false)  // Estado de preparación
let activeUploads = 0
let processingLoop = false
let folderCache = new Map()  // Cache local: relativePath -> folder_id

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
  
  // Verificar caché local
  if (folderCache.has(relativePath)) {
    console.log(`♻️ Usando caché local para: ${relativePath}`)
    return folderCache.get(relativePath)
  }
  
  isPreparing.value = true
  
  try {
    console.log(`📁 Preparando carpeta: ${relativePath}`)
    const response = await api.post(API_PREPARE_ENDPOINT, {
      folder_id: props.nodeSelec?.drive_file_id,
      relative_path: relativePath
    })
    
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
  if (processingLoop) return
  processingLoop = true

  while (true) {
    if (isPaused.value) {
      await new Promise(resolve => setTimeout(resolve, 500))
      continue
    }

    const pendingItems = queue.value.filter(item => item.status === 'pending' && item.file)
    if (pendingItems.length === 0) break

    // 🔥 OPTIMIZACIÓN: Preparar carpetas ÚNICAS primero
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

    // Lanzar subidas
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

// ---------- Progreso total ----------
const totalProgress = computed(() => {
  if (queue.value.length === 0) return 0
  const total = queue.value.reduce((sum, item) => sum + item.progress, 0)
  return Math.round(total / queue.value.length)
})

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

<style scoped>
/* Estilos existentes + nuevos */
.uploader { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
.drop-zone { border: 2px dashed #aaa; border-radius: 8px; padding: 2rem; text-align: center; background: #f9f9f9; transition: background 0.2s; }
.drop-zone.drag-over { background: #e1f5fe; border-color: #2196f3; }
.buttons button { margin: 0.5rem; padding: 0.5rem 1rem; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
.queue { margin-top: 2rem; }
.queue-item { border: 1px solid #ddd; border-radius: 4px; padding: 0.75rem; margin-bottom: 0.75rem; }
.info { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.path { font-size: 0.8rem; color: #666; }
.status { font-size: 0.8rem; font-weight: bold; }
.status.pending { color: #ff9800; }
.status.uploading { color: #2196f3; }
.status.completed { color: #4caf50; }
.status.error { color: #f44336; }
.status.cancelled { color: #9e9e9e; }
.actions button { margin-left: 8px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer; }
.progress-bar { background: #e0e0e0; border-radius: 4px; height: 8px; overflow: hidden; margin-top: 8px; }
.progress { background: #4caf50; height: 100%; width: 0%; transition: width 0.3s; }
.error { color: red; font-size: 0.8rem; margin-top: 4px; }
.total-progress { margin-top: 1rem; font-weight: bold; text-align: center; }

/* Nuevos estilos */
.preparing-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #2196f3;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>