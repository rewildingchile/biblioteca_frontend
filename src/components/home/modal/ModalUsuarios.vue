<template>
  <div v-if="this.showModal" id="panelayuda" class=" relative z-100" aria-labelledby="slide-over-title" role="dialog"
    aria-modal="true" style="z-index: 1000;">

    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden ">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex  pl-0 max-w-[100%]">
          <div class="pointer-events-auto  w-screen   max-w-5xl">
            <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div class="bg-indigo-700 py-6 px-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="">

                  </div>




                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="w-8 h-8"  style="  color: #fff;">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>




                  <div className="grid grid-cols-1 grid-rows-1 gap-2 ml-2">

                    <div class="pl-12">
                      <h2 class="text-1xl font-bold tracking-tight text-white sm:text-4xl">  Gestión cuentas usuarios
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
              <div className="pt-0 pl-2 ">

                <div>
                  <div class="sm:hidden">
                    <label for="tabs" class="sr-only">Select a tab</label>
                    <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                    <select id="tabs" name="tabs"
                      class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
                    </select>
                  </div>
                  <div class="hidden sm:block">
                    <div class="border-b border-gray-200">
                      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <a @click="handleTabClick(tab.id)" v-for="tab in tabs" :key="tab.name" :href="tab.href"
                          :class="[tab.current ? 'border-indigo-500 text-indigo-600' 
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                                , 'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium']"
                          :aria-current="tab.current ? 'page' : undefined">{{ tab.name }}</a>
                      </nav>
                    </div>
                  </div>
                </div>

          
            
              
                <FormDatosUsuario v-if="pantalla == 2" :userEdit="userEdit" ></FormDatosUsuario>
                <CuentasUsuarios v-if="pantalla == 1"  :listUsuarios="listUsuarios"
                                  @editUsuario="editUsuario"
                                  @deleteUsuario="deleteUsuario"
                                  @errorAcceso="errorAcceso"></CuentasUsuarios>

                <DeleteFormUsuario v-if="pantalla == 4" :userEdit="userEdit" ></DeleteFormUsuario>
               

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

  
import CuentasUsuarios from "../../user/CuentasUsuarios";
import FormDatosUsuario from "../../user/FormDatosUsuario";
import DeleteFormUsuario from "../../user/DeleteFormUsuario";
export default {
  components: {
    CuentasUsuarios,
    FormDatosUsuario,
    DeleteFormUsuario
  },
  props: {
    nomedificio: String,
    showModal: Boolean
  },
  methods: {
    close() {
     
      this.$emit("close");
      
    },
    editUsuario(usr){
      this.pantalla=2;
      this.userEdit = usr;
    },
    deleteUsuario(usr){
      this.pantalla=4;
      this.userEdit = usr;
    },
    
    handleTabClick(id) {
      this.pantalla=id;
      if (id==2)
      {
        this.userEdit = '';
      }
      if(id == 9){ 
        this.pantalla=1;
        this.close(); 
      }
      
       return false;  
    },
  
  },
  data() {
    return {
      idUsuario:0,
      userEdit:{
        
      },
      pantalla:1,
      showPanel: Boolean,
      tabs: [
        { id: 2, name: 'Nuevo Usuario', href: '#', current: true },
        { id: 1, name: 'Cuentas de usuario', href: '#', current: true },
       
      ],
      listUsuarios:[{  id: "1", email:"emora@oxytek.cl", nombre:"Eduardo Mora", rol:"Administrador"},
                    {  id: "2", email:"iddroppelman@oxytek.cl", nombre:"Iván Droppelman",rol:"Supervisor técnico"},
                    {  id: "3",email:"olivares.debora@gmail.com,",nombre:"Débora Olivares",rol:"Administrador"}]

    }
  },
  created() {
     
    this.showPanel = this.showModal
  
  },
 

}
</script>