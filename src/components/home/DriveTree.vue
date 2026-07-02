<template>
    <!-- <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/DriveTree.vue&#62;</span>
    </div>
     <div class="flex justify-between">
      <span class="text-xs text-indigo-500 font-mono bg-indigo-50 px-3 py-1 rounded-full shadow-sm">&#60;Home/DriveNode.vue&#62;</span>
    </div>  -->

    <DriveNode  v-for="node in nodes"  
                :key="node.id"
                :node="node"
                :area_id="area_id" />
 </template>

<script setup>
import DriveNode from './DriveNode.vue'

defineProps({
  nodes: {
    type: Array,
    required: true
  },
  area_id:{
    type: Number
  }
})
</script>


