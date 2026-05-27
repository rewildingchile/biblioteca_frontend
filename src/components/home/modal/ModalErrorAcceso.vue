<template>
<div v-if="this.showModal" id="panelayuda" class="fixed inset-0 flex items-center justify-center z-50" 
role="dialog" aria-modal="true">
  <!-- Background Overlay -->
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 z-40"></div>

  <!-- Modal Content -->
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
    <div class="bg-gray-500 py-6 px-4 sm:px-6">
      <div class="flex items-center justify-between">
        
        <!-- Icono -->
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon warning-icon">
  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
  <line x1="12" y1="9" x2="12" y2="13"></line>
  <line x1="12" y1="17" x2="12.01" y2="17"></line>
</svg>

        <!-- Título -->
        <div class="ml-2">
          <h2 class="text-1xl font-bold tracking-tight text-white sm:text-1x2">Acceso no disponible </h2>
        </div>

        <!-- Botón Cerrar -->
        <button @click="close()" type="button" class="ml-3 rounded-md  bg-gray-900 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
          <span class="sr-only">Close panel</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Body -->
    <div class="container  p-6">
      <div class="row  text-center">
     

      Lo sentimos, no tiene los privilegios necesarios para activar esta función. 
      <br>
      Para obtener más información o realizar solicitudes de acceso puede escribir a :
      
      </div>

      <div class="row mt-1 text-center">

      <b>  <a  target="_blank" href="mailto:admin@rewildingchile.org">admin</a> </b>
     
    
      </div>

      <div class="row mt-1 text-center">
        <button @click="close()" class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600">Cerrar</button>
  
      </div>  
     
    </div>  
  </div>
</div>

</template>
  
<script>

 
export default {
  components: {
  
  },
  props: {
    
    showModal: Boolean
  },
  methods: {
    close() {
     
      this.$emit("close");
      
    },
   
  
  },
  data() {
    return {
      idUsuario:0,
      userEdit:{
        
      },
      pantalla:1,
      showPanel: Boolean,
      
    }
  },
  created() {
     
    this.showPanel = this.showModal
  
  },
 

}
</script>