<template>
  <div v-if="this.showModalVisibilidad" id="panelayuda" class=" relative z-10" aria-labelledby="slide-over-title"
    role="dialog" aria-modal="true">

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
                             {{ $t('visibilidad') }}
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
              <div className="pt-12 pl-12 ">
       

                <div v-for="f in this.$store.getters.getDroppables" :key="f.idFaena" class="mt-1 py-3">
                  <div class="flex items-center" :draggable="true" @drop="handleDrop(f.id)"
                    @dragstart="handleDragFaena(f.id)">

                    <div class="w-1/2 text-left">
                      <span class="cursor-pointer group flex items-center px-2 py-1">
                        <h2 class="text-1xl font-bold tracking-tight text-black sm:text-4xl"> {{ f.nombre }}</h2>
                      </span>
                    </div>
                    <div class="w-1/2 text-left">
                      <div @click="chgEstado(f)"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                        <template v-if="'visible' in f">
                          <svg v-if="f.visible == 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-8 h-8 ">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.034.096-.07.192-.106.287C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7-.036-.095-.072-.191-.106-.287z" />
                          </svg>

                          <svg v-if="f.visible == 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                            <!-- Contorno del Ojo -->
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.034.096-.07.192-.106.287C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7-.036-.095-.072-.191-.106-.287z" />
                            <!-- Trazo Encima del Ojo -->
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15" />
                          </svg>
                        </template>
                        <template v-else>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8">
                            <!-- Contorno del Ojo -->
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.034.096-.07.192-.106.287C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7-.036-.095-.072-.191-.106-.287z" />
                            <!-- Trazo Encima del Ojo -->
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15" />
                          </svg>
                        </template>


                      </div>
                    </div>
                  </div>
                </div>




              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>




export default {
  emits:[
    "handleVisibilidad"
  ],
  props: {
    nomedificio: String,
    showModalVisibilidad: Boolean
  },
  methods: {
    close() {

      this.$emit("close")
    },
    chgEstado(f) {

      let obj = this.objVisibilidad.filter(item => item.id === f.id)
  
      if (!obj) {
        f.visible = false
      }
      f.visible = !f.visible

      console.log('buscando ', f)
      this.$store.dispatch("droppableUpdVisible", f);
      this.$emit("handleVisibilidad");
    }
  },
  data() {
    return {
      showPanel: Boolean,
      objVisibilidad: []

    }
  },
  created() {

    this.showPanel = this.showModalVisibilidad


  },
  mounted() {

    this.$store.getters.getDroppables.forEach(faena => {
      this.objVisibilidad.push({ id: faena.id, visible: faena.visible })
    });
  }

}
</script>