<template>
  <div v-if="this.showModalInformes" id="panelayuda" class=" relative z-10" aria-labelledby="slide-over-title"
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
                      <h2 class="text-1xl font-bold tracking-tight text-white sm:text-4xl"> Informes Personalizados
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


                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Fila 1 -->
                  <div class="bg-gray-200 p-4">consumo</div>
                  <div class="bg-gray-300 p-4">
                    <select id="custom-select" v-model="selectedOption1"
                      class="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-lg">
                      <option value="" disabled selected>Selecciona una opción</option>
                      <option v-for="option in options1" :key="option.value" :value="option.value"
                        :class="option.colorClass">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>

                  <!-- Fila 2 -->
                  <div class="bg-gray-200 p-4">consumo eléctrico</div>
                  <div class="bg-gray-300 p-4">
                    <select id="custom-select" v-model="selectedOption2"
                      class="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-lg">
                      <option value="" disabled selected>Selecciona una opción</option>
                      <option v-for="option in options2" :key="option.value" :value="option.value"
                        :class="option.colorClass">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>

                  <!-- Fila 3 -->
                  <div class="bg-gray-200 p-4">generación</div>
                  <div class="bg-gray-300 p-4">
                    <select id="custom-select" v-model="selectedOption3"
                      class="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-lg">
                      <option value="" disabled selected>Selecciona una opción</option>
                      <option v-for="option in options3" :key="option.value" :value="option.value"
                        :class="option.colorClass">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>

                  <!-- Fila 4 -->
                  <div class="bg-gray-200 p-4">dosificacion</div>
                  <div class="bg-gray-300 p-4">
                    <select id="custom-select" v-model="selectedOption4"
                      class="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-lg">
                      <option value="" disabled selected>Selecciona una opción</option>
                      <option v-for="option in options4" :key="option.value" :value="option.value"
                        :class="option.colorClass">
                        {{ option.text }}
                      </option>
                    </select>

                  </div>

                  <!-- Fila 5 -->
                  <div class="bg-gray-200 p-4"></div>
                  <div class="bg-gray-300 p-4"> </div>
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
  emits: [
    "handleVisibilidadInformes"
  ],
  props: {
    nomedificio: String,
    showModalInformes: Boolean
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
      objVisibilidad: [],
      selectedOption1: '',
      options1: [
        { value: '', text: 'Total', colorClass: 'text-red-500' },
        { value: '', text: 'Por planta de petroleo', colorClass: 'text-blue-500' },

      ],
      selectedOption2: '',
      options2: [
        { value: '1', text: 'Total', colorClass: 'text-red-500' },
        { value: '2', text: 'Por planta ', colorClass: 'text-blue-500' },

      ],
      selectedOption3: '',
      options3: [
        { value: '1', text: 'Mensual', colorClass: 'text-red-500' },
        { value: '2', text: 'Semanal', colorClass: 'text-blue-500' },
        { value: '3', text: 'Diaria', colorClass: 'text-green-500' },
        { value: '4', text: 'Horaria de oxígeno por planta', colorClass: 'text-green-500' },
      ],
      selectedOption4: '',
      options4: [
        { value: '1', text: 'Mensual', colorClass: 'text-red-500' },
        { value: '2', text: 'Semanal', colorClass: 'text-blue-500' },
        { value: '3', text: 'Diaria', colorClass: 'text-green-500' },
        { value: '4', text: 'Horaria por centros', colorClass: 'text-green-500' },
        { value: '4', text: 'Horaria por jaulas de oxigeno', colorClass: 'text-green-500' },
      ],
    }
  },
  created() {

    this.showPanel = this.showModalInformes


  },
  mounted() {

    this.$store.getters.getDroppables.forEach(faena => {
      this.objVisibilidad.push({ id: faena.id, visible: faena.visible })
    });
  }

}
</script>