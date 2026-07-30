<template>
   <!--- <span  class="  tracking-widest   text-cyan-300/80
                 border border-cyan-500/20  bg-cyan-500/5  px-3 py-1 rounded-full
                 font-mono text-sm"  >{{ rol }} </span>  -->
   <DriveNode  v-for="node in nodes"  
                :key="node.id"
                :node="node"
                :area_id="area_id" 
                :rol="rol"/>
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
  },
  rol:{
    type: Object
  }
})
</script>


