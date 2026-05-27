<template>
  <div class="drive-tree">
    <DriveNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
    />
  </div>
</template>

<script setup>
import DriveNode from './DriveNode.vue'

defineProps({
  nodes: {
    type: Array,
    required: true
  }
})
</script>