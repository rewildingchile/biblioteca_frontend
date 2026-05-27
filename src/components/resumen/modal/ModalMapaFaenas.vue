<template>




  <div v-if="showModalMapa" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-0">

        <div
          class="relative transform overflow-hidden rounded-lg bg-white px-0 pt-0 pb-0 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-lg">


          <div class="bg-indigo-700 py-6 px-0 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="">



              </div>




              <div className="grid grid-cols-1 grid-rows-1 gap-2 ml-2">

                <div class="pl-12">
                  <h2 class="text-1xl font-bold tracking-tight text-white sm:text-4xl"> 
                   {{ $t('mapa') }}
                  </h2>
                </div>
              </div>



              <div>








              </div>


              <div class="ml-3 flex h-7 items-center">
                <button @click="close_modal" type="button"
                  class="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white ">
                  <span class="sr-only">Close panel</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

          </div>
          <div class="p-0">




            <MapaFaenas :propLatitud="latitud" :propLongitud="longitud"></MapaFaenas>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>


<script>

import MapaFaenas from "./MapaFaenas"
export default {
  components: {
    MapaFaenas

  },
  name: "ModalPeriodoConsumoOxigeno",
  create: {

  },
  props: ["propIdFaena", "showModalMapa", "mensaje", "seriesFaenas"],
  emits: ["close"],
  data: () => ({
    visible: false,
    latitud: 0,
    longitud: 0,
  }),

  mounted() {
    this.getCoordenadas(this.propIdFaena)
  },
  methods: {
    getCoordenadas( ) {
      
    },
    delete_usuario() {

      this.$emit("delete")

    },
    close_modal() {
      console.log('cerrar modal 1');
      this.$emit("close")
    }

  },
  watch: {
    
  }
}
</script>