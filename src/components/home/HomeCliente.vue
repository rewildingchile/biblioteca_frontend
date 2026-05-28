<template>
  <div class="min-h-full"> 

 
    <ModalErrorAcceso :showModal="showModalErrorAcceso" @close="loadModalErrorAcceso(false)"></ModalErrorAcceso>
    <ModalServiceUnavailable :showModal="showModalServiceUnavailable" @close="loadModalServiceUnavailable(false)"></ModalServiceUnavailable>
   
 
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
            <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full p-0 ">
            
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
              <div class="flex-shrink-0 flex items-center px-0">
              
              </div>
           
              <SideBarMovilCliente 
              v-if="pantalla !== 0" 
              :navigation="navigation"
              :secondaryNavigation="secondaryNavigation"  
              @chgIdPantalla="chgPantalla"   
            ></SideBarMovilCliente>

            
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
   
 
   
     ></SideBarDesktopCliente>

    <SideBarDesktopSettings @chgIdPantalla="chgPantalla" v-if="pantalla === 0"></SideBarDesktopSettings>

  <div class="lg:ml-[80px] flex flex-col flex-1    min-h-screen ">

  <!-- TOPBAR -->
  <div
    class="relative z-10 flex-shrink-0 flex h-16 border-b border-white/5
           bg-slate-950/70 backdrop-blur-xl"
  >

    <!-- LEFT -->
    <div class="flex-1 px-5 flex items-center justify-between   ml-6">

      <div class="flex items-center gap-3">

        <!-- HOME -->
        <span
          class="text-[11px] tracking-widest uppercase
                 text-cyan-300/80
                 border border-cyan-500/20
                 bg-cyan-500/5
                 px-3 py-1 rounded-full
                 font-mono"
        >
          &#60;HomeCliente&#62;
        </span>

        <!-- TITLE -->
        <div
          class="flex items-center gap-3
                 border-l border-white/10
                 pl-4"
        >

          <div
            class="w-2 h-2 rounded-full bg-cyan-400
                   shadow-[0_0_10px_rgba(34,211,238,.8)]"
          ></div>

          <h2
            class="text-sm lg:text-lg
                   font-semibold
                   tracking-[0.25em]
                   text-slate-100"
          >
            BIBLIOTECA FUNDACIÓN REWILDING CHILE
          </h2>

        </div>

       

      </div>

      <!-- RIGHT -->
      <div
        class="flex items-center gap-4
               font-mono text-sm"
      >

        <!-- USER -->
        <span
          class="hidden lg:flex items-center
                 text-xs text-slate-400
                 font-mono ml-3"
        >
          {{ this.$store.state.auth.userLogin.nombres }}
          {{ this.$store.state.auth.userLogin.apellido1 }}
        </span>

        <!-- MENU -->
        <Menu as="div" class="relative">

          <MenuButton
            class="flex items-center gap-2
                   px-4 py-2 rounded-xl
                   border border-white/10
                   bg-white/[0.03]
                   hover:bg-white/[0.06]
                   transition-all duration-200
                   text-slate-300"
          >

            <span class="text-xs tracking-wide">
              Salir
            </span>

          </MenuButton>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >

            <MenuItems
              class="origin-top-right absolute right-0 mt-3 w-48
                     rounded-2xl
                     overflow-hidden
                     border border-white/10
                     bg-slate-900/95
                     backdrop-blur-xl
                     shadow-2xl
                     focus:outline-none"
            >

              <MenuItem v-slot="{ active }">

                <a
                  href="/logout/"
                  :class="[
                    active ? 'bg-white/5 text-cyan-300' : 'text-slate-300',
                    'block px-4 py-3 text-sm transition-all'
                  ]"
                >
                  {{ $t('cerrarsesion') }}
                </a>

              </MenuItem>

            </MenuItems>

          </transition>

        </Menu>

      </div>

    </div>

    <!-- MOBILE -->
    <button
      type="button"
      class="px-4 text-slate-400
             hover:text-cyan-300
             focus:outline-none
             lg:hidden"
      @click="sidebarOpen = true"
    >

      <svg
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>

    </button>

  </div>

<!-- OVERLAY -->
<div
  v-if="panelDerechoVisible"
  @click="panelDerechoVisible = false"
  class="fixed inset-0 z-40  "
></div>

<!-- PANEL LATERAL DERECHO -->
<transition
  enter-active-class="transition duration-300 ease-out"
  enter-from-class="translate-x-full opacity-0"
  enter-to-class="translate-x-0 opacity-100"
  leave-active-class="transition duration-200 ease-in"
  leave-from-class="translate-x-0 opacity-100"
  leave-to-class="translate-x-full opacity-0"
>
  <div  v-if="panelDerechoVisible"
    class="fixed top-0 right-0 z-50
           h-full w-[680px]
           bg-gray-600
           shadow-2xl
           border-l border-gray-200
           flex flex-col"
  >

    <!-- HEADER -->
    <div class="flex items-center justify-between px-6 py-4 border-b ">
      <h2 class="text-lg font-semibold text-white">
        Información del archivo
      </h2>

      <button
        @click="panelDerechoVisible = false"
        class="w-8 h-8 flex items-center justify-center
               rounded-lg hover:bg-gray-200 transition"
      >
        ✕
      </button>
    </div>

    <!-- CONTENIDO -->
    <div class="flex-1 overflow-y-auto p-5 space-y-3">

    -{{ nodeSelec }}-
 
    </div>

    <!-- FOOTER -->
    <div class="border-t p-4  bg-slate-950/70 ">
      <button
        @click="panelDerechoVisible = false"
        class="w-full py-2 rounded-xl
               bg-gray-200 hover:bg-gray-300
               text-gray-700 transition"
      >
        Cerrar
      </button>
    </div>

  </div>
</transition>
  <!-- MAIN -->
  <main class="flex-1 pb-8">

    <div class="mt-4">

      <div class="mx-auto px-6 sm:px-4 lg:px-5  ">
     
        <!-- CONTENT -->
     
          <ListaCarpetasDrive v-if="pantalla == 2" />


            <div v-if="pantalla == 3" class="rounded-3xl  border border-white/5   bg-white/[0.02]
                 backdrop-blur-xl   ml-6 shadow-[0_0_40px_rgba(0,0,0,.25)] 
                  p-4 lg:p-6">
              <IndexaCarpetasDrive />

            </div>

   
      </div>

    </div>

        <!-- OFFLINE -->
        <div v-if="isOnline == false" class="sticky bottom-0
            
             text-white
             text-center
             py-4
             z-50">
          <p>Sin conexión a la red</p>
        </div>

  

  </main>

  <!-- FOOTER -->
  <footer
    class="px-5 py-3
           border-t border-white/5
           text-[11px]
           text-slate-500
           font-mono"
  >

    

  </footer>

</div>
  </div>
</template>
 <style scoped>
@import "@/assets/css/tech-theme.css";
</style>
<script>
import api from "@/api/axios";
import i18n from '@/i18n';



import { ref , provide, onMounted, onUnmounted} from "vue";
 

import router from "../../router";
import { mapActions } from "vuex";

import { 
   XIcon 
 } from "@heroicons/vue/outline";
 
 
import SideBarMovilCliente from "../resumen/SideBarMovilCliente.vue";
import SideBarDesktopCliente from "../resumen/SideBarDesktopCliente.vue";
import LogoRwc from "../resumen/LogoRwc.vue";
import ModalErrorAcceso from "./modal/ModalErrorAcceso.vue";
import ModalServiceUnavailable from "./modal/ModalServiceUnavailable.vue"
import IndexaCarpetasDrive from "./IndexaCarpetasDrive.vue"
import ListaCarpetasDrive from "./ListaCarpetasDrive.vue" 
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
  components: 
  {
    
    Dialog,
    DialogPanel,
 
    SideBarMovilCliente,
    SideBarDesktopCliente,
  
  
    
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    // BellIcon,
    XIcon,
    ModalErrorAcceso,
    ModalServiceUnavailable,
    LogoRwc,
    IndexaCarpetasDrive, 
    ListaCarpetasDrive
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
  beforeMount(){

    //console.log('user id',this.$store.state.auth.userLogin.id )
    if ( typeof(this.$store.state.auth.userLogin.id) === "undefined" || this.$store.state.auth.userLogin.id == 0 ) {
      
       
      console.log("sin definir status login");
      location.href="/";
      return false;
    }

  },
  mounted() {
  
    //console.log('user id',this.$store.state.auth.userLogin.id )
    if ( typeof(this.$store.state.auth.userLogin.id) === "undefined" || this.$store.state.auth.userLogin.id == 0 ) {
      
       
      console.log("sin definir status login");
      location.href="/";
      return false;
    }
    
   // this.user = this.$store.state.login.userLogin;
    //this.razonSocial =  this.user.info.razonSocial;
    this.pantalla = 2;

    if (this.datosUsuario.rol !== "Administrador") {
      this.adminNavigation = [];
    }
    
  
  },
  beforeUnmount() {
    window.removeEventListener("online", this.checkInternet);
    window.removeEventListener("offline", () => (this.isOnline = false));
  },
  methods: {
    ...mapActions("divisiones", ["getDivisionesApi"]),
    vertest(){
        router.push("/testmedicion")
      },
    async checkInternet() {
      try {
       
        await fetch("https://www.google.cl/", { mode: "no-cors" });
        this.isOnline = true;
      } catch (error) {
        this.isOnline = false;
      }
    },
    

    
    loadModalErrorAcceso(valor){
      console.log('loadModalUsuarios')
      this.showModalErrorAcceso = valor;
    },
    loadModalServiceUnavailable(valor){
   
      console.log('showModalServiceUnavailable')
      this.showModalServiceUnavailable = valor;
    },
 
    loadFormCliente() {
      this.pantalla = 1;
    },
    chgPantalla(f) {
       
      this.pantalla = f.id;
 
      this.sidebarOpen = false;
    },
 
    async getFileDocument(){
     try{      
        let data = { "file_id": this.nodeSelec.drive_file_id };
        const response = await api.post("api/v1/filedocument/", data,{
             headers: {
            "Content-Type": "application/json",
           
          },
        });

        if(response?.status ===200)
        {

        }
      } catch (e) {
        console.error("Credenciales inválidas ❌",e);
      }
    }
 
 

  },

  data() {
    return {  
      centro :{},
      
      imgbase64: '',
      isOnline: false,
      buildDate: import.meta.env.BUILD_DATE,
   
      razonSocial:'',
      tokenseguridad: "",
      faenas: [{}],
      datosUsuario: {},
      pantalla: "",
      rol: "",
      selectDivisionesByIdFaena: 0,
      nombreFaena: "",
      navigation: [],
      numRam: 0,
      secondaryNavigation: [ 
       
        {  name:  i18n.global.t('cerrarsesion'), href: "/logout"  },
      ],
      

      statusStyles: {
        success: "bg-green-100 text-green-800",
        processing: "bg-yellow-100 text-yellow-800",
        failed: "bg-gray-100 text-gray-800",
      },
      sidebarOpen: ref(false),
      jsonObject: {
        preference: {
          "global": {
            "mode": "",
            "color": ""
          },
          items: [],
          jaulas: []
        }
      },
      vistaLive: false,
      lang:'',
      showFormCambiaPass:false,
      showModalUsuarios:false,
      showModalServiceUnavailable:false,
      showModalErrorAcceso:false,
      message:false,
   
    };
  },

  computed: {},
  setup() {
    const isSmallScreen = ref(window.innerWidth <= 768);
    const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
    const panelDerechoVisible = ref(false)
    const nodeSelec = ref({})

    const updateScreenSize = () => {
      isSmallScreen.value = window.innerWidth <= 768;
    };

    const updateOrientation = () => {
      isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
    };

    const updateAll = () => {
      updateScreenSize();
      updateOrientation();
    };
    const togglePanelDerecho = (valor) => {
      panelDerechoVisible.value = valor
    }
    const selectNode=(valor)=>{
      nodeSelec.value=valor
    }

    onMounted(() => {
      window.addEventListener("resize", updateAll);
      window.addEventListener("orientationchange", updateAll);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", updateAll);
      window.removeEventListener("orientationchange", updateAll);
    });
    
    provide('panel', {
      visible: panelDerechoVisible,
      setVisible: togglePanelDerecho,
      setNode:selectNode
    })

    return { isSmallScreen, isPortrait,panelDerechoVisible, nodeSelec };
  },
   watch: {
      nodeSelec(value){
        console.log('cambioo nodeSelec',value)
        if(value){
          this.getFileDocument()
        }
      },
      
  },
};
</script>
