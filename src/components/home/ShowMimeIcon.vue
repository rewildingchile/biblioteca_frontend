<template>
  <!-- PDF -->
  <svg
    v-if="node.mime_type?.includes('pdf')"
    @click="handleClick(node, 'view')"
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
    v-else-if="node.mime_type?.startsWith('image/')"
    @click="handleClick(node, 'view')"
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
      node.mime_type?.includes('word') ||
      node.mime_type?.includes('officedocument.wordprocessingml')
    "
    @click="handleClick(node, 'view')"
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
      node.mime_type?.includes('sheet') ||
      node.mime_type?.includes('spreadsheet')
    "
    @click="handleClick(node, 'view')"
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

<!-- Folder -->
<svg
  v-else-if="
    node.mime_type?.includes('folder') ||
    node.mime_type === 'application/vnd.google-apps.folder'
  "
  @click="handleClick(node, 'view')"
  class="w-8 h-8 text-amber-500 cursor-pointer hover:scale-110 transition"
  fill="none"
  viewBox="0 0 24 24"
>
  <path
    d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="currentColor"
    fill-opacity="0.15"
  />

  <path
    d="M3 9h18"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
  />
</svg>
  <!-- Archivo genérico -->
  <svg
    v-else
    @click="handleClick(node, 'view')"
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
</template>

<script setup>
// Define props
const props = defineProps({
  node: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && 'mime_type' in value
    }
  }
})

// Define emits
const emit = defineEmits(['click'])

// Handle click event
const handleClick = (node, action) => {
  emit('click', { node, action })
}
</script>