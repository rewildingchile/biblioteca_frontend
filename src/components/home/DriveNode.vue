<template>
  <div class="node">

    <!-- FILA -->
    <div
      class="node-row"
      @click="toggle"
    >

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

        <!-- FILE -->
        <svg
          v-else
          @click="handleClick"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h6"
          />

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 16h6"
          />

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
          />

        </svg>
 
      </div>

      <!-- LINK -->
      <a
        :href="node.web_view_link"
        target="_blank"
        @click.stop
        class="node-link"
      >
       {{ node.name }}
      </a>
 {{ node.text_content }}
    </div>

    <!-- CHILDREN -->
    <div
      v-if="open && node.children?.length"
      class="children"
    >

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

</style>
vue
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

const handleClick = () => {
  panel.setVisible(true)
}

// Proveemos tanto el estado como la función
provide('nodo', {
  nodoSelec: nodoSelec,
  selecNodo: selecNodo
})

</script>

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