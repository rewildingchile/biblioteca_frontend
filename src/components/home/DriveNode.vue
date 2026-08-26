<template>

  <div class="node">

    <!-- FILA -->
    <div class="node-row text-sm text-left ">
 
      <span
        class="  tracking-widest   text-cyan-300/80  border border-cyan-500/20  bg-cyan-500/5  px-0 py-0 rounded-full  font-mono text-lg">

        <div v-if="is_editor">
          <div v-if="node.is_folder">
            <div
              class="grid grid-cols-2 gap-0 text-center rounded-xl  p-1 font-medium cursor-pointer transition hover:text-black ">
              <div class="hover:bg-blue-100  " @click="toggle">
                <span>+</span>
              </div>
              <div class="hover:bg-blue-100  ">
                <span title="contribuir a la carpeta" @click="handleClickCustom(node, 'request')" style="font-size: 18px;">
                  👩🏻‍💻
                </span>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              class="grid grid-cols-3 gap-0 text-center rounded-xl  p-1 font-medium cursor-pointer transition hover:text-black ">
              <span></span>
              <span></span>
              <span title="contribuir al archivo" @click="handleClick(node, 'info')" class="hover:bg-blue-100" style="font-size: 18px;">
                👩🏻‍💻
              </span>
            </div>
          </div>
        </div>

        <div v-if="is_admin" class="grid   gap-0  ">

          <div v-if="node.is_folder">

            <div class="grid grid-cols-3">
              <span @click="toggle" class=" text-center rounded-xl  p-1 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition ">
                +
              </span>
             
              
              <span title="añadir archivo a la carpeta" v-if="node.is_folder"
                class=" text-center rounded-xl  p-1 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition"
                @click="handleClickCustom(node, 'upload_file')" style="font-size: 18px;">
                📤
              </span>
              <span v-if="node.parent_drive_file_id" @click="handleClick(node, 'info')"
                class="  text-center rounded-xl  p-1 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition " style="font-size: 18px;">
                ✏️
              </span> 
            </div>
          </div>
          <div v-else>
            <div class="grid grid-cols-3">
              <span></span>
              <span></span>
              <span @click="handleClick(node, 'info')"
                class=" text-center rounded-xl  p-2 font-medium hover:bg-blue-100 hover:text-black cursor-pointer transition">
                ✏️
              </span>
            </div>
          </div>

        </div>


      </span>

      <!-- ICON -->
      <div @click="toggle" class="folder-icon "
        :class="{ 'folder-open': open && node.is_folder, 'file-icon': !node.is_folder }">

        <!-- FOLDER -->
        <svg v-if="node?.is_folder" fill="none" stroke="currentColor" stroke-width="1.8"  viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>

        <div v-else>
          <!-- PDF -->
          <svg v-if="node?.mime_type?.includes('pdf')" @click="handleClick(node, 'view')"
            class="w-8 h-8 text-red-600 cursor-pointer hover:scale-110 transition" fill="none" viewBox="0 0 24 24">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor"
              stroke-width="1.5" fill="white" />
            <path d="M14 3v5h5" stroke="currentColor" stroke-width="1.5" /><text x="12" y="17" text-anchor="middle"
              font-size="5" font-weight="bold" fill="currentColor">PDF</text>
          </svg>
          <!-- Imagen -->
          <svg v-else-if="node?.mime_type?.startsWith('image/')" @click="handleClick(node, 'view')"
            class="w-8 h-8 text-sky-600 cursor-pointer hover:scale-110 transition" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
            <circle cx="9" cy="10" r="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M5 17l5-5 3 3 3-2 3 4" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>

          <!-- Word -->
          <svg
            v-else-if="node?.mime_type?.includes('word') || node.mime_type?.includes('officedocument.wordprocessingml')"
            @click="handleClick(node, 'view')" class="w-8 h-8 text-blue-700 cursor-pointer hover:scale-110 transition"
            fill="none" viewBox="0 0 24 24">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor"
              stroke-width="1.5" fill="white" />
            <path d="M14 3v5h5" stroke="currentColor" stroke-width="1.5" /><text x="12" y="17" text-anchor="middle"
              font-size="5" font-weight="bold" fill="currentColor">DOC</text>
          </svg>
          <!-- Excel -->
          <svg v-else-if="node?.mime_type?.includes('sheet') || node.mime_type?.includes('spreadsheet')"
            @click="handleClick(node, 'view')" class="w-8 h-8 text-green-600 cursor-pointer hover:scale-110 transition"
            fill="none" viewBox="0 0 24 24">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor"
              stroke-width="1.5" fill="white" />
            <path d="M14 3v5h5" stroke="currentColor" stroke-width="1.5" /><text x="12" y="17" text-anchor="middle"
              font-size="5" font-weight="bold" fill="currentColor">XLS</text>
          </svg>
          <!-- Archivo genérico -->
          <svg v-else @click="handleClick(node, 'view')"
            class="w-8 h-8 text-slate-500 cursor-pointer hover:scale-110 transition" fill="none" viewBox="0 0 24 24">
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor"
              stroke-width="1.5" fill="white" />
            <path d="M14 3v5h5" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>

        
      </div>

      <span @click="handleClickCustom(node, 'list_request')" v-if="node.user_request" title="user request pendientes"
        class=" inline-block relative bell-wrapper ">
        🔔
        <!-- Indicador de notificación -->
        <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </span>

      <span v-if="!node.is_folder" class="cursor-pointer p-2" @click="handleClick(node, 'view')"> {{ node.name }} </span>
      <span v-else @click="toggle">{{ node.name }}</span>






    </div>

    <!-- CHILDREN -->
    <div v-if="open && node.children?.length" class="children">

      <DriveNode v-for="child in node.children" :key="child.id" :node="child" :area_id="area_id" :rol="rol" />

    </div>
  </div>
</template>

<style scoped>
.bell-wrapper {
  display: inline-block;
  animation: bell-ring 2s ease-in-out infinite;
  transform-origin: top center;
  font-size: 1.2rem;
}

@keyframes bell-ring {

  0%,
  80%,
  100% {
    transform: rotate(0deg);
  }

  85% {
    transform: rotate(10deg);
  }

  90% {
    transform: rotate(-10deg);
  }

  95% {
    transform: rotate(5deg);
  }

  98% {
    transform: rotate(-5deg);
  }
}
</style>
<!-- DriveNode.vue -->

<script setup>
import { ref, inject, provide } from 'vue'
import DriveNode from './DriveNode.vue'



const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  area_id: {
    type: Number,
  },
  rol: {
    type: Object
  }
})
let is_admin
let is_editor
const rolUsr = props.rol
if (rolUsr) {
  is_admin = rolUsr?.id === 1
  is_editor = rolUsr?.id === 3
}


const nodoSelec = ref({});

const selecNodo = (valor) => {
  nodoSelec.value = valor;
};

const open = ref(false)

const toggle = () => {
  if (props.node.is_folder) {
    open.value = !open.value
  }
}

const panel = inject('panel')

const handleClick = (node, action) => {

  switch (action) {
    case 'info':
      panel.setVisible(true)
      panel.seccionVisible('info_file')
      break;
     case 'view':  
      panel.seccionVisible('show_file')
      break;
     case 'menucontext':  
      panel.seccionVisible('menucontext')
      break;
    }

  panel.setNode(node)
  panel.setAreaSelec(props.area_id)
}

const handleClickCustom = (node, action) => {

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
  color: black;
}


/* =========================
   ICON
========================= */

.folder-icon {

  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: rgba(250, 204, 21, .10);

  border: 1px solid rgba(250, 204, 21, .15);

  color: #facc15;

  transition: all .25s ease;
}

/* carpeta abierta */

.folder-open {

  background: rgba(34, 211, 238, .12);

  border-color: rgba(34, 211, 238, .25);

  color: #67e8f9;

  box-shadow:
    0 0 20px rgba(34, 211, 238, .18);
}

/* archivo */

.file-icon {

  background: rgba(255, 255, 255, .05);

  border: 1px solid rgba(255, 255, 255, .08);

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
    1px dashed rgba(255, 255, 255, .10);
}

.contextual {
  text-align: left;
  margin-left: 18px;

  padding-left: 16px;

  border-left:
    1px dashed rgba(255, 255, 255, .10);


}
</style>
<style scoped>
.node {
  margin-left: 0px;
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