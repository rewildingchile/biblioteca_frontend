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
const MAX_FILE_SIZE_MB = 10           // límite por archivo (10 MB)
const API_ENDPOINT = '/api/v1/upload/'

// ---------- Estado ----------
const fileInput = ref(null)
const folderInput = ref(null)
const dragOver = ref(false)
const queue = ref([])                 // items de cola
const isPaused = ref(false)           // pausa manual
let activeUploads = 0                 // contador de subidas activas (no reactivo)
let processingLoop = false            // evita múltiples bucles de procesamiento

// ---------- Funciones auxiliares ----------
const generateId = () => Date.now() + '-' + Math.random().toString(36).substr(2, 9)

// Texto legible
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

// Validar tamaño
function isFileWithinLimit(file) {
  const limitBytes = MAX_FILE_SIZE_MB * 1024 * 1024
  if (file.size > limitBytes) {
    console.warn(`Archivo ${file.name} excede el límite de ${MAX_FILE_SIZE_MB} MB`)
    return false
  }
  return true
}

// ---------- Persistencia con IndexedDB ----------
const DB_NAME = 'UploadQueueDB'
const STORE_NAME = 'queue'
let db = null

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
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
  // Limpiar todo y guardar los items actuales (serializamos Files como Blob)
  await store.clear()
  for (const item of queue.value) {
    // Guardamos el archivo como Blob (File hereda de Blob)
    const itemToStore = {
      ...item,
      file: item.file instanceof File ? item.file : null
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
  // Reconstruir objetos File a partir de los Blobs guardados
  return items.map(item => ({
    ...item,
    file: item.file ? new File([item.file], item.name, { type: item.file.type }) : null,
    status: item.status === 'uploading' ? 'pending' : item.status, // las subidas activas se reinician
    progress: 0,
    abortController: null
  }))
}

// ---------- Procesamiento de cola con concurrencia limitada ----------
async function processQueue() {
  if (processingLoop) return
  processingLoop = true

  while (true) {
    // Si está pausado, esperar
    if (isPaused.value) {
      await new Promise(resolve => setTimeout(resolve, 500))
      continue
    }

    // Buscar items pendientes
    const pendingItems = queue.value.filter(item => item.status === 'pending' && item.file)
    if (pendingItems.length === 0) break

    // Lanzar subidas hasta alcanzar el límite de concurrencia
    while (activeUploads < MAX_CONCURRENT_UPLOADS && pendingItems.length > 0) {
      const nextItem = pendingItems.shift()
      // Verificar que siga pendiente (pudo cambiar)
      const currentItem = queue.value.find(i => i.id === nextItem.id)
      if (currentItem && currentItem.status === 'pending') {
        activeUploads++
        uploadFile(currentItem).finally(() => {
          activeUploads--
        })
      }
    }

    // Esperar un poco antes de revisar de nuevo
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  processingLoop = false
}

async function uploadFile(item) {
  if (!item.file) {
    item.status = 'error'
    item.error = 'Archivo no disponible (recargar página?)'
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
  if (item.relativePath) {
    formData.append('relativePath', item.relativePath)
  }
  formData.append('folder_id', props.nodeSelec?.drive_file_id) 

  try {
    const response = await api.post(API_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: abortController.signal,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        item.progress = percent
        saveQueueToDB() // guardar progreso
      }
    })
    item.status = 'completed'
    item.progress = 100
    item.abortController = null
    console.log('Subido:', response.data)
    await saveQueueToDB()
  } catch (error) {
    if (api.isCancel(error)) {
      item.status = 'cancelled'
      item.error = 'Cancelado por el usuario'
    } else {
      item.status = 'error'
      item.error = error.message
    }
    item.abortController = null
    await saveQueueToDB()
  }
}

// Cancelar una subida en curso
function cancelUpload(item) {
  if (item.abortController) {
    item.abortController.abort()
  }
}

// Eliminar item de la cola (cualquier estado)
async function removeFromQueue(item) {
  const index = queue.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    if (item.abortController) item.abortController.abort()
    queue.value.splice(index, 1)
    await saveQueueToDB()
  }
}

// Reintentar un item con error
async function retryUpload(item) {
  if (item.status === 'error' || item.status === 'cancelled') {
    item.status = 'pending'
    item.progress = 0
    item.error = null
    await saveQueueToDB()
    processQueue()
  }
}

// Limpiar items completados
async function clearCompleted() {
  queue.value = queue.value.filter(item => item.status !== 'completed')
  await saveQueueToDB()
}

// Pausar / Reanudar
function pauseQueue() {
  isPaused.value = true
}

function resumeQueue() {
  isPaused.value = false
  processQueue()
}

// ---------- Agregar archivos a la cola con validación de tamaño ----------
async function addFilesToQueue(files, basePath = '') {
  const newItems = []
  for (const file of files) {
    if (!isFileWithinLimit(file)) {
      console.warn(`No se agregó ${file.name} - excede tamaño máximo`)
      continue
    }
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

// ---------- Ciclo de vida ----------
onMounted(async () => {
  db = await openDB()
  const savedItems = await loadQueueFromDB()
  if (savedItems.length) {
    queue.value = savedItems
    // Reanudar automáticamente los pendientes
    processQueue()
  }
})

onBeforeUnmount(async () => {
  if (db) db.close()
})
</script>

<style scoped>
/* mismos estilos del ejemplo anterior, se pueden reutilizar */
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
</style>