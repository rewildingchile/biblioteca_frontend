<template>
   
<div class="bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-100 shadow-md overflow-hidden rounded-xl hover:shadow-xl hover:border-sky-300 transition-all duration-300 font-mono">
  <div class="px-5 py-5 sm:p-6">

    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center">

          <!-- file icon -->
          <div class="flex-shrink-0">
            <ShowMimeIcon :node="props.document"></ShowMimeIcon>
          </div>

          <h3 class="ml-2 text-lg font-semibold text-slate-800 truncate">
            <a 
              class="hover:text-sky-600 transition-colors duration-200  pointer cursor-pointer"
               @click="handleClick(document,'view')"
            >
              {{ document.name }}
            </a>
          </h3>
        </div>
      </div>

      <!-- Relevancia -->
      <div class="ml-4 flex-shrink-0">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200"
        >
          {{ document.relevance_score.toFixed(2) }}% relevancia
        </span>
      </div>
    </div>

  

    <!-- Ruta -->
    <div class="mt-2 flex items-start text-xs text-slate-600 bg-blue-50 rounded-lg p-2 border border-blue-100">
      <svg
        class="flex-shrink-0 mr-2 h-4 w-4 text-sky-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>

      <span class="break-all">
     {{ document.full_path?.replaceAll('>', ' 📁 ') }}
      </span>
    </div>

    <!-- Campos encontrados -->
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="match in document.matches_found_in"
        :key="match"
        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 border border-cyan-200"
      >
        <svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>

        {{ getFieldLabel(match) }}
      </span>
    </div>

    <!-- Términos coincidentes -->
    <div
      v-if="document.matched_terms && document.matched_terms.summary"
      class="mt-4"
    >
      <div class="flex flex-wrap gap-3">
        <div
          v-for="(terms, field) in document.matched_terms.summary"
          :key="field"
          class="text-xs"
        >
          <span class="font-semibold text-slate-700">
            {{ getFieldLabel(field) }}:
          </span>

          <span
            v-for="(term, index) in terms"
            :key="index"
            class="ml-1 inline-flex items-center px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200"
          >
            {{ term }}
          </span>
        </div>
      </div>
    </div>

 
 
      <div class="drive-tree  rounded-2xl p-5 " v-if="nodes?.length>0">
        <div class="flex justify-end">
        <span @click="nodes=[]"  class="text-white text-lg cursor-pointer hover:text-red-300 transition">X</span>
        </div>
        <DriveTree    :nodes="nodes"  />

      </div>
            
    <!-- Footer -->
    <div class="mt-5 pt-4 border-t border-blue-100">
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">

        <div class="flex items-center gap-4">

          <span class="flex items-center">
            <svg
              class="mr-1 h-4 w-4 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            {{ document.last_known_modified_time }}   {{ document.mime_type }}
          </span>

          <span
            v-if="document.area_name"
            class="flex items-center"
          >
            <svg
              class="mr-1 h-4 w-4 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>

            {{ document.area_name }}
          </span>

        </div>

        <div class="flex items-center gap-2">

          <span
            class="px-2 py-1 bg-sky-50 border border-sky-100 rounded text-sky-700"
          >
            ID: {{ document.drive_file_id.substring(0, 8) }}...
          </span>

          <a
            
            @click="handleClick(document,'view')"
    
            class="inline-flex items-center font-medium text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
          >
            Ver  

            <svg
              class="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

        </div>

      </div>
          <!-- Contexto -->
    <div v-if="hasMatchedText" class="mt-5">

      <button
        @click="showContext = !showContext"
        class="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
      >
        {{ showContext ? 'Ocultar' : 'Mostrar' }}
        contexto de coincidencias
      </button>

      <div
        v-if="showContext"
        class="mt-3 space-y-3"
      >
        <div
          v-for="(fieldData, field) in document.matched_texts.by_field"
          :key="field"
          class="bg-blue-50 rounded-xl p-3 border border-blue-100"
        >
          <h5 class="text-xs font-semibold text-slate-700 mb-3">
            {{ getFieldLabel(field) }}
            ({{ fieldData.count }} coincidencias)
          </h5>

          <div class="space-y-2">
            <div
              v-for="(item, index) in fieldData.items.slice(0, 5)"
              :key="index"
              class="bg-white rounded-lg p-3 border border-blue-100 shadow-sm"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-sky-700">
                  "{{ item.term }}"
                </span>

                <span class="text-xs text-slate-400">
                  posición {{ item.position }}
                </span>
              </div>

              <p
                class="text-xs text-slate-700 font-mono bg-sky-50 p-2 rounded border border-sky-100"
              >
                {{ item.context }}
              </p>
            </div>

            <p
              v-if="fieldData.items.length > 5"
              class="text-xs text-slate-500"
            >
              y
              {{ fieldData.items.length - 5 }}
              coincidencia{{ fieldData.items.length - 5 !== 1 ? 's' : '' }}
              más
            </p>
          </div>
        </div>
      </div>

    </div>
    </div>

  </div>
</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import ShowMimeIcon from './ShowMimeIcon.vue'
import api from "@/api/axios";

import DriveTree from './DriveTree.vue'


const panel = inject('panel') 



const props = defineProps({
  document: {
    type: Object,
    required: true
  },
  searchTerms: {
    type: Array,
    default: () => []
  }
})


const nodes = ref([])

const showContext = ref(false)

const hasMatchedText = computed(() => {
  return props.document.matched_texts && 
         props.document.matched_texts.by_field &&
         Object.keys(props.document.matched_texts.by_field).length > 0
})

const getFieldLabel = (field) => {
  const labels = {
    'name': 'Nombre',
    'parent_name': 'Carpeta padre',
    'search_vector': 'search_vector',
    'description_vector': 'description_vector',
    'text_content': 'text_content'
  }
  return labels[field] || field
}

const handleClick = (node,action) => {

  if (node.mime_type==='application/vnd.google-apps.folder'){

       listar(node)

  }else{

      if (action==='info'){
         panel.setVisible(true)
         panel.seccionVisible('info_file')
      }else{
         panel.seccionVisible('show_file')
      }
      panel.setNode(node)
      panel.setAreaSelec(props.area_id)

  }


}

const ordenarChildrenAscendente = (nodes) => {
  // validar array
  if (!Array.isArray(nodes)) return

  // ordenar actual nivel
  nodes.sort((a, b) =>
    a.name.localeCompare(
      b.name,
      'es',
      { sensitivity: 'base' }
    )
  )

  // recorrer hijos recursivamente
  nodes.forEach(node => {
    if (node.children && node.children.length > 0) {
       
      ordenarChildrenAscendente(node.children)
    }
  })
}

const listar = async (node) => {
  try {
    const r = await api.get(`drive/tree/node/${node.drive_file_id}/`)
    nodes.value = r.data
    ordenarChildrenAscendente(nodes.value)
  } catch (error) {
    console.error("error obteniendo arbol", error)
    throw error
  }
}


 
</script>

<style scoped>
.drive-tree{
  
  margin: 6px;
  background-color: #000;
}
 
</style>