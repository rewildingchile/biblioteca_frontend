<template>
   
  <div class="node">

    <!-- FILA -->
    <div  class="node-row text-lg"  @click="toggle" >

      <!-- ICON -->
      <div
        class="folder-icon"
        :class="{
          'folder-open': open && node.is_folder,
          'file-icon': !node.is_folder
        }"
      >

        <!-- FOLDER -->
        <svg
          v-if="node.is_folder"
          class="w-5 h-5"
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
        
       

 <!-- PDF FILE -->
<svg  v-else
  @click="handleClick(node)"
  class="w-24 h-24 text-red-600 cursor-pointer"
  fill="none"
  viewBox="0 0 24 24"
>
  <!-- Documento -->
  <path
    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
    stroke="currentColor"
    stroke-width="1.5"
    fill="white"
  />

  <!-- Esquina doblada -->
  <path
    d="M14 3v5h5"
    stroke="currentColor"
    stroke-width="1.5"
  />

  <!-- Texto PDF -->
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
      </div>

      {{ node.name }} 
      
      
    </div>
     <div v-if="open && node.is_folder"  class="children  contextual">
         

         <div class="grid grid-cols-10 gap-3  ">

  <div class="p-3 text-center rounded-xl  text-violet-200 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition"
   @click="handleClickCustom(node,'upload_file')">
    📤 Upload
  </div>


  <div class="p-3 text-center rounded-xl  text-violet-200 font-medium hover:bg-violet-100 0 hover:text-black  cursor-pointer transition">
    ✏ Rename
  </div> 

    <div class="p-3 text-center rounded-xl  text-red-600 font-medium hover:bg-red-100 cursor-pointer transition">
    🗑 Delete
  </div>


</div>
  
 
      </div>
    <!-- CHILDREN -->
    <div  v-if="open && node.children?.length"   class="children" >

      <DriveNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
      />

    </div>

  </div>
</template>

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
  gap: 12px;

  padding: 10px 12px;

  border-radius: 14px;

  transition: all .2s ease;

  cursor: pointer;
}

.node-row:hover {

  background: rgba(255,255,255,.04);
  color: #000 !important;;
  transform: translateX(2px);
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

.node-link {

  color: #ffcc00;

  text-decoration: none;

  font-size: 14px;

  transition: all .2s ease;
}

.node-link:hover {

  color: #000000;

  text-shadow:
    0 0 10px rgba(250,204,21,.45);
}

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

.node-row:hover {
  background: #f3f3f3;
  color:black;
}

.children {
  margin-left: 20px;
  border-left: 1px solid #ddd;
  padding-left: 10px;
}
</style>
<!-- DriveNode.vue -->
 
<script setup>
import { ref , inject, provide } from 'vue'
import DriveNode from './DriveNode.vue'

const nodoSelec = ref({});

const selecNodo = (valor) => {
    nodoSelec.value = valor;
 };

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const open = ref(false)

const toggle = () => {
  if (props.node.is_folder) {
    open.value = !open.value
  }
}

const panel = inject('panel')

const handleClick = (node) => {
 
  panel.setVisible(true)
  panel.setNode(node)
  panel.seccionVisible('info_file')
}
const handleClickCustom = (node,action) => {
  console.log(node)
  panel.setVisible(true)
  panel.setNode(node)
  panel.seccionVisible(action)
}
// Proveemos tanto el estado como la función
provide('nodo', {
  nodoSelec: nodoSelec,
  selecNodo: selecNodo
})

</script>

