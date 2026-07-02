<template>
   
  <div class="node">

    <!-- FILA -->
    <div  class="node-row text-sm text-left text-"  @click="toggle" >
    
      <!-- ICON -->
      <div
        class="folder-icon "  :class="{
          'folder-open': open && node.is_folder,
          'file-icon': !node.is_folder
        }"
      >

        <!-- FOLDER -->

        <svg
          v-if="node.is_folder"
         
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
          />

        </svg>
        
       

 
 <!--- DEPENDIENDO DE node.mime_type--> 
 <!--  MOSTRAR SVG (pdf, imagen, word, )-->

<div v-else >
 
 
 

<!-- PDF -->
<svg
  v-if="node.mime_type.includes('pdf')"
  @click="handleClick(node,'view')"
  class="w-8 h-8 text-red-600 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    stroke="currentColor"
    stroke-width="1.5"
    fill="white"
  />
  <path
    d="M14 3v5h5"
    stroke="currentColor"
    stroke-width="1.5"
  />
  <text
    x="12"
    y="17"
    text-anchor="middle"
    font-size="5"
    font-weight="bold"
    fill="currentColor"
  >
    PDF
  </text>
</svg>

<!-- Imagen -->
<svg
  v-else-if="node.mime_type.startsWith('image/')"
  @click="handleClick(node,'view')"
  class="w-8 h-8 text-sky-600 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <rect
    x="3"
    y="5"
    width="18"
    height="14"
    rx="2"
    stroke="currentColor"
    stroke-width="1.5"
  />
  <circle
    cx="9"
    cy="10"
    r="2"
    stroke="currentColor"
    stroke-width="1.5"
  />
  <path
    d="M5 17l5-5 3 3 3-2 3 4"
    stroke="currentColor"
    stroke-width="1.5"
    fill="none"
  />
</svg>

<!-- Word -->
<svg
  v-else-if="
    node.mime_type.includes('word') ||
    node.mime_type.includes('officedocument.wordprocessingml')
  "
  @click="handleClick(node,'view')"
  class="w-8 h-8 text-blue-700 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    stroke="currentColor"
    stroke-width="1.5"
    fill="white"
  />
  <path
    d="M14 3v5h5"
    stroke="currentColor"
    stroke-width="1.5"
  />
  <text
    x="12"
    y="17"
    text-anchor="middle"
    font-size="5"
    font-weight="bold"
    fill="currentColor"
  >
    DOC
  </text>
</svg>

<!-- Excel -->
<svg
  v-else-if="
    node.mime_type.includes('sheet') ||
    node.mime_type.includes('spreadsheet')
  "
  @click="handleClick(node,'view')"
  class="w-8 h-8 text-green-600 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    stroke="currentColor"
    stroke-width="1.5"
    fill="white"
  />
  <path
    d="M14 3v5h5"
    stroke="currentColor"
    stroke-width="1.5"
  />
  <text
    x="12"
    y="17"
    text-anchor="middle"
    font-size="5"
    font-weight="bold"
    fill="currentColor"
  >
    XLS
  </text>
</svg>

<!-- Archivo genérico -->
<svg
  v-else
  @click="handleClick(node,'view')"
  class="w-8 h-8 text-slate-500 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    stroke="currentColor"
    stroke-width="1.5"
    fill="white"
  />
  <path
    d="M14 3v5h5"
    stroke="currentColor"
    stroke-width="1.5"
  />
</svg>
</div>
</div>

    {{ node.name }}  
<div v-if="is_admin" class="grid grid-cols-2 gap-1 ">  
  <span v-if="!node.is_folder"  @click="handleClick(node,'info')">✏️</span> 
  
  <div v-if="node.parent_drive_file_id" @click="handleClick(node,'info')" class="px-2 text-center rounded-xl  text-red-100 font-medium hover:bg-blue-100 cursor-pointer transition">
   🗑️
  </div> 
  <div  v-if="node.is_folder" class="p-1 text-center rounded-xl  text-violet-200 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition"
   @click="handleClickCustom(node,'upload_file')">
   ⬆️  
  </div>
</div>
      
</div>
<div v-if="open && node.is_folder"  class="children  contextual">
  <div class="grid grid-cols-2 gap-2  ">
  
 

</div>
  
</div>
    <!-- CHILDREN -->
    <div  v-if="open && node.children?.length"   class="children" >

      <DriveNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :area_id="area_id"
      />

    </div>

  </div>
</template>


<!-- DriveNode.vue -->
 
<script setup>
import { ref , inject, provide } from 'vue'
import DriveNode from './DriveNode.vue'

const is_admin = ref(true)

const nodoSelec = ref({});

const selecNodo = (valor) => {
    nodoSelec.value = valor;
 };

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  area_id:{
    type:Number,
  }
})

const open = ref(false)

const toggle = () => {
  if (props.node.is_folder) {
    open.value = !open.value
  }
}

const panel = inject('panel')

const handleClick = (node,action) => {
 
  if (action==='info'){
  panel.setVisible(true)
    panel.seccionVisible('info_file')
  }else{
      panel.seccionVisible('show_file')
  }

  panel.setNode(node)
  panel.setAreaSelec(props.area_id)
}
const handleClickCustom = (node,action) => {
  
  panel.setVisible(true)
  panel.setNode(node)
  panel.seccionVisible(action)
  panel.setAreaSelec(props.area_id)  
}
// Proveemos tanto el estado como la función
provide('nodo', {
  nodoSelec: nodoSelec,
  selecNodo: selecNodo
})

</script>

<style scoped>

/* =========================
   NODE
========================= */

.node {
  color: white;
  font-family: monospace;
}

/* =========================
   ROW
========================= */

.node-row {

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 10px 12px;

  border-radius: 14px;

  transition: all .2s ease;

  cursor: pointer;
}
.node-row:hover {
  background: rgba(212, 212, 211, 0.6);
  color:black;
}
 

/* =========================
   ICON
========================= */

.folder-icon {

  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: rgba(250,204,21,.10);

  border: 1px solid rgba(250,204,21,.15);

  color: #facc15;

  transition: all .25s ease;
}

/* carpeta abierta */

.folder-open {

  background: rgba(34,211,238,.12);

  border-color: rgba(34,211,238,.25);

  color: #67e8f9;

  box-shadow:
    0 0 20px rgba(34,211,238,.18);
}

/* archivo */

.file-icon {

  background: rgba(255,255,255,.05);

  border: 1px solid rgba(255,255,255,.08);

  color: #cbd5e1;
   
}

/* =========================
   LINK
========================= */

 
 

/* =========================
   CHILDREN
========================= */

.children {

  margin-left: 18px;

  padding-left: 16px;

  border-left:
    1px dashed rgba(255,255,255,.10);
}
.contextual {
  text-align: left;
  margin-left: 18px;

  padding-left: 16px;

  border-left:
    1px dashed rgba(255,255,255,.10);

     
}

</style>
<style scoped>
.node {
  margin-left: 10px;
}

.node-row {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
}



.children {
  margin-left: 20px;
  border-left: 1px solid #ddd;
  padding-left: 10px;
}
</style>