<template>
  <div v-if="this.showModalAyuda" id="panelayuda" class=" relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">

  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden ">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex  pl-0 max-w-[100%]">
          <div class="pointer-events-auto  w-screen   max-w-2xl">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="bg-indigo-700 py-6 px-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="">

                  </div>









                  <div className="grid grid-cols-1 grid-rows-1 gap-2 ml-2">

                    <div class="pl-12">
                      <h2 class="text-1xl font-bold tracking-tight text-white sm:text-4xl"> 
                    {{ $t('informacion') }}
                      </h2>
                    </div>
                  </div>



                  <div>









                  </div>


                  <div class="ml-3 flex h-7 items-center">
                    <button @click="close()" type="button"
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
              <div className="pt-12 pl-2 ">

                 
                
                
               <img  v-if="lang=='en'" src= "../../../assets/ayuda-resumen-ingles.png" />
             <img  v-else src= "../../../assets/ayuda-resumen.png" />
        



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

import i18n from "@/i18n";


export default {
  props: {
    nomedificio: String,
    showModalAyuda: Boolean
  },
  mounted(){
      this.lang = i18n.global.locale.value;
  },
  methods: {
    close() {

      this.$emit("close")
    },
    shownom(v) {
      console.log(v);
    },
   
  },
  data() {
    return {
      showPanel: Boolean,
      lang: ''

    }
  },
  created() {
     
    this.showPanel = this.showModalAyuda
  }

}
</script>