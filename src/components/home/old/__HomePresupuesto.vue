<template>
  <span class="text-sm text-gray-500 font-mono">&lt;_HomePresupuesto&gt;</span>
  <div class="min-h-full"> 

    <ApiNotification v-if="message" :message="message" :type="type" />
    <ModalErrorAcceso :showModal="showModalErrorAcceso" @close="loadModalErrorAcceso(false)"></ModalErrorAcceso>
    <ModalServiceUnavailable :showModal="showModalServiceUnavailable" @close="loadModalServiceUnavailable(false)"></ModalServiceUnavailable>
    <ModalUsuarios :showModal="showModalUsuarios" @close="loadModalUsuarios(false)"></ModalUsuarios>
    <ModalFormCambiaPass :showModal="showFormCambiaPass" @close="loadFormCambiaPass(false)" ></ModalFormCambiaPass>
    
   
 
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
         
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
  
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-10" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-10">
            <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-cyan-700">
            
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button type="button"
                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-inset focus:ring-white"
                    @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                   
                    <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex-shrink-0 flex items-center px-4">
              
              </div>
               
              <SideBarMovilCliente 
              v-if="pantalla !== 0" 
              :navigation="navigation"
              :secondaryNavigation="secondaryNavigation"  
              @chgIdPantalla="chgPantalla"   
              @loadModalUsuarios="loadModalUsuarios"
              @loadModalErrorAcceso="loadModalErrorAcceso"
              @loadModalServiceUnavailable="loadModalServiceUnavailable"></SideBarMovilCliente>

              <SideBarMovilSettings @chgIdPantalla="chgPantalla" v-if="pantalla === 0"></SideBarMovilSettings>
            </DialogPanel>
          </TransitionChild>
          <div class="flex-shrink-0 w-14" aria-hidden="true">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
 
    <SideBarDesktopCliente v-if="pantalla !== 0"
     :navigation="navigation" 
     :secondaryNavigation="secondaryNavigation"
     :faenas="faenas"
 
     @chgIdPantalla="chgPantalla"
     @loadModalUsuarios="loadModalUsuarios"
     @loadModalErrorAcceso="loadModalErrorAcceso"
     @loadModalServiceUnavailable="loadModalServiceUnavailable"
 
   
     ></SideBarDesktopCliente>

    <SideBarDesktopSettings @chgIdPantalla="chgPantalla" v-if="pantalla === 0"></SideBarDesktopSettings>

    <div class="lg:ml-[150px] flex flex-col flex-1">
      <div class="relative z-10 flex-shrink-0 flex h-16 border-b border-gray-200 lg:border-none bg-cyan-700">
       
        <!-- Search bar -->
        <div class="flex-1 px-4 flex">
          <div class="flex-1 flex">
            <ToolBarVistaHistorial v-if="pantalla === 5" :idEmpresa="datosUsuario.idEmpresa"
              :nombreFaena="this.nombreFaena" :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones">
            </ToolBarVistaHistorial>

            <ToolBarVistaCentros v-if="pantalla === 4" :idEmpresa="datosUsuario.idEmpresa"
              :nombreFaena="this.nombreFaena" :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones">
            </ToolBarVistaCentros>

            <ToolBarVistaFaenas v-if="pantalla === 1" :idEmpresa="datosUsuario.idEmpresa"
              :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones"></ToolBarVistaFaenas>

            <ToolBarVistaSettings v-if="pantalla === 0" :idEmpresa="datosUsuario.idEmpresa"
              :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones"></ToolBarVistaSettings>
          </div>
          <div class="ml-4 flex items-center md:ml-6 text-white text-2xl">
            <span class=" text-white text-sm">{{ this.$store.state.notifications }}</span>  
            <span class="text-2xl text-white font-bold">
               <img   class="w-36 " id="logoempresa"  > 
               <span v-if="!this.imgbase64">{{ this.razonSocial }}</span>
            </span>
            <Menu as="div" class="ml-3 relative">
              <div>

                
                <MenuButton
                  class="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                  <span class="items-left hidden ml-3 text-gray-700 text-xs lg:block"><span class="sr-only">abrir menu
                    </span>{{ this.$store.state.auth.userLogin.nombres }} {{ this.$store.state.auth.userLogin.apellido1 }}<br />{{datosUsuario.rol}}</span>
                 
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                  <a  @click="loadFormCambiaPass(true)" :class="[active ? 'bg-gray-100' : '','block px-4 py-2 text-sm text-gray-700',]">{{ $t('cambiar mi clave')}}</a>
                  </MenuItem>

                  <MenuItem v-slot="{ active }"><a href="/logout/" :class="[active ? 'bg-gray-100' : '','block px-4 py-2 text-sm text-gray-700',]">{{ $t('cerrarsesion')}}</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <button type="button"
          class="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
          @click="sidebarOpen = true">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <span class="sr-only">Open sidebar</span>
       
        </button>
      </div>
      <main class="flex-1 pb-8">
        <!-- Page header -->

        <div class="mt-1">
          <div class="mx-auto px-1 sm:px-1 lg:px-1">

     
       
      
            <HomeSettings v-if="pantalla === 0"></HomeSettings>
            <MaestroCentros v-if="pantalla ==  2"  @chgCentro="chgCentro" @chgCentroCuentasMayorCero="chgCentroCuentasMayorCero"  @chgModifPresup="chgCentro"></MaestroCentros>
            <MaestroPlanCuentas v-if="pantalla == 3" ></MaestroPlanCuentas>
            <IngresoPresupuestos v-if="pantalla == 4" :centro="centro" ></IngresoPresupuestos>
       
 
          </div>
        </div>
       
        <div  v-if="isOnline == false" class="sticky bottom-0 bg-red-500 text-white text-center py-4" style='z-index:10000000'>
         <p>Sin conexión a la red</p>
        </div>
      </main>
      <footer>
        <span class="text-xs">
          Last built: <br />
          [{{ buildDate }}]
          
          
        </span>
      </footer>
    </div>
  </div>
</template>

<script>
 
import i18n from '@/i18n';



import { ref  } from "vue";
 

import router from "../../router";
import { mapActions } from "vuex";

import { 
   XIcon 
 } from "@heroicons/vue/outline";
 
import ApiNotification from "./modal/ApiNotification";
import SideBarMovilCliente from "../resumen/SideBarMovilCliente";
import SideBarDesktopCliente from "../resumen/SideBarDesktopCliente";
 
 

import ToolBarVistaFaenas from "../ToolBarVistaFaenas";
import ToolBarVistaCentros from "../ToolBarVistaCentros";
import ToolBarVistaHistorial from "../ToolBarVistaHistorial";
 

import SideBarDesktopSettings from "../settings/SideBarDesktopSettings";
import SideBarMovilSettings from "../settings/SideBarMovilSettings";
import ToolBarVistaSettings from "../settings/ToolBarVistaSettings";
import HomeSettings from "../settings/HomeSettings";
import ModalUsuarios from "./modal/ModalUsuarios";
import ModalErrorAcceso from "./modal/ModalErrorAcceso";
import ModalFormCambiaPass  from "./modal/ModalFormCambiaPass";
import ModalServiceUnavailable from "./modal/ModalServiceUnavailable"
 
 

import MaestroCentros from "../maestros/MaestroCentros";
import MaestroPlanCuentas from "../maestros/MaestroPlanCuentas";
import IngresoPresupuestos from "../presupuestos/IngresoPresupuestos";
 

import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

export default 
{
  props: ["id"],        
  mounted(){
    console.log("ID recibido:", this.id);
     
    if (this.$store.state.auth.statusLogin == "0") {
      
      router.push("/");
      console.log("sin definir status login");
      return false;
    }
    
   // this.user = this.$store.state.login.userLogin;
    //this.razonSocial =  this.user.info.razonSocial;
    this.pantalla = 1;

    if (this.datosUsuario.rol !== "Administrador") {
      this.adminNavigation = [];
    }
  },
  components: 
  {
    ApiNotification,
  
 
    SideBarMovilCliente,
    SideBarDesktopCliente,
  
  
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    // BellIcon,
    XIcon,
    ModalUsuarios,
    ModalErrorAcceso,
    ModalFormCambiaPass,
    ModalServiceUnavailable,
 
    ToolBarVistaFaenas,
    ToolBarVistaCentros,
    ToolBarVistaHistorial,
    ToolBarVistaSettings,
    SideBarDesktopSettings,
    SideBarMovilSettings,
    HomeSettings,
    MaestroCentros,
    MaestroPlanCuentas,
    IngresoPresupuestos,
   
    
  },
 
  created() {
    this.lang = i18n.global.locale.value;
 
    
    if ( this.$store.state.tokens ) {

      
      router.push("/");
      console.log("sin definir status login");
      return false;
    } 
    

    this.checkInternet();
    window.addEventListener("online", this.checkInternet);
    window.addEventListener("offline", () => (this.isOnline = false));
  },
  
  beforeUnmount() {
    window.removeEventListener("online", this.checkInternet);
    window.removeEventListener("offline", () => (this.isOnline = false));
  },
  methods: {
    ...mapActions("divisiones", ["getDivisionesApi"]),
   
    async checkInternet() {
      try {
       
        await fetch("https://www.google.cl/", { mode: "no-cors" });
        this.isOnline = true;
      } catch (error) {
        this.isOnline = false;
      }
    },
  
 
 
 

  },

  data() {
    return {  
      centro :{},
        datosUsuario: {},
     
      secondaryNavigation: [ 
       
        {  name:  i18n.global.t('cerrarsesion'), href: "/logout"  },
      ],
      

      statusStyles: {
        success: "bg-green-100 text-green-800",
        processing: "bg-yellow-100 text-yellow-800",
        failed: "bg-gray-100 text-gray-800",
      },
      sidebarOpen: ref(false),
     
      showFormCambiaPass:false,
      showModalUsuarios:false,
      showModalServiceUnavailable:false,
      showModalErrorAcceso:false,
      message:false
    };
  },

  computed: {},
  setup() {
     
    

   
  },
   watch: {
      
  },
};
</script>
