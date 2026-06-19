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


<!-- BUSQUEDA--> 
<!-- Overlay --> 
<div v-if="showBusqueda"  @click="showBusqueda = false" class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/30  backdrop-blur-sm ">

  <!-- Caja búsqueda -->
  <div
    class="w-full max-w-3xl
           bg-white/90 backdrop-blur-xl
           border border-gray-200
           rounded-3xl
           shadow-2xl
           overflow-hidden"
  >

    <!-- Input -->
    <div class="flex items-center px-6 py-5">

      <!-- Lupa -->
      <svg
        class="w-7 h-7 text-gray-400 mr-4"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="6"></circle>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20 20l-4.2-4.2"
        />
      </svg>

      <input
        v-model="search"
        type="text"
        placeholder="Buscar documentos.."
        class="flex-1
               bg-transparent
               text-2xl
               text-gray-800
               placeholder-gray-400
               outline-none"
      />

    </div>

    <!-- Resultados -->
    <div
      class="max-h-[400px]
             overflow-y-auto
             border-t border-gray-100"
    >

      <div
        v-for="item in resultados_busqueda"
        :key="item.id"
        class="px-6 py-4
               hover:bg-indigo-50
               cursor-pointer
               transition"
      >
        <div class="font-medium text-gray-800">
          {{ item.nombre }}
        </div>

        <div class="text-sm text-gray-500">
          {{ item.descripcion }}
        </div>
      </div>

    </div>

  </div>

</div>

 
        <div  v-if="panelDerechoVisible"  >
        <!-- OVERLAY -->
 

   
        <div class="fixed inset-0 z-40  bg-black opacity-50"></div>
        <!-- PANEL LATERAL DERECHO -->
      <transition   enter-active-class="transition duration-300 ease-out" enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100" leave-to-class="translate-x-full opacity-0">

          <div class="fixed top-0 right-0 z-50
           h-full w-[680px]
           bg-white
           shadow-2xl
           border-l border-gray-200
           flex flex-col">
-- {{ area_seleccionada_id }} --
        <FileInfo  v-if="seccionVisible==='info_file'"   :nodeSelec="nodeSelec"  :area_id="area_seleccionada_id"   @cerrarPanelDerecho="cerrarPanelDerecho"/>
        <UloadFile v-if="seccionVisible==='upload_file'" :nodeSelec="nodeSelec"   :area_id="area_seleccionada_id"   
        @cerrarPanelDerecho="cerrarPanelDerecho"  @refreshTree="refreshTree"/>
        </div>       
      </transition>  
      </div>
      <!-- MAIN -->
      <main class="flex-1 pb-8">

        <div class="mt-4">

          <div class="mx-auto px-6 sm:px-4 lg:px-5  ">
 
           <div v-if="pantalla == 2" class="flex items-center gap-4">
               
           <ListaCarpetasDrive
            @showPanelBusqueda="showPanelBusqueda" 
            
            :prop_json_carpetas="data"/>

          <ListaCarpetasDriveEstrategia
            @showPanelBusqueda="showPanelBusqueda"   :prop_json_carpetas="data2"/>
          </div>

           <IndexaCarpetasDrive v-if="pantalla == 3" />
        

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
import ListaCarpetasDriveEstrategia from "./ListaCarpetasDriveEstrategia.vue";
import FileInfo from "./FileInfo.vue"
import UloadFile from "./UloadFile.vue"
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
    computed: {
      vistaActual() 
      {
        switch (this.pantalla) {
          case 2:
            return {
              component: ListaCarpetasDrive,
              props: {
                prop_area_id: this.area_id,
                prop_json_carpetas: this.data
              }
            }

          case 3:
            return {
              component: IndexaCarpetasDrive,
              props: {}
            }

          default:
            return null
        }
      }
    },
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
      ListaCarpetasDrive,
      ListaCarpetasDriveEstrategia,
      FileInfo,
      UloadFile,

    },

    created() {
      this.lang = i18n.global.locale.value;


      if (this.$store.state.tokens) {


        router.push("/");
        console.log("sin definir status login");
        return false;
      }


      this.checkInternet();
      window.addEventListener("online", this.checkInternet);
      window.addEventListener("offline", () => (this.isOnline = false));
    },
    beforeMount() {

      //console.log('user id',this.$store.state.auth.userLogin.id )
      if (typeof (this.$store.state.auth.userLogin.id) === "undefined" || this.$store.state.auth.userLogin.id == 0) {


        console.log("sin definir status login");
        location.href = "/";
        return false;
      }

    },
    mounted() {

      //console.log('user id',this.$store.state.auth.userLogin.id )
      if (typeof (this.$store.state.auth.userLogin.id) === "undefined" || this.$store.state.auth.userLogin.id == 0) {


        console.log("sin definir status login");
        location.href = "/";
        return false;
      }

      // this.user = this.$store.state.login.userLogin;
      //this.razonSocial =  this.user.info.razonSocial;
      this.pantalla = 2;

      if (this.datosUsuario.rol !== "Administrador") {
        this.adminNavigation = [];
      }

      this.listarcarpetas(1)
      this.listarcarpetas(2)
    },
    beforeUnmount() {
      window.removeEventListener("online", this.checkInternet);
      window.removeEventListener("offline", () => (this.isOnline = false));
    },
    methods: {
      ...mapActions("divisiones", ["getDivisionesApi"]),
      vertest() {
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



      loadModalErrorAcceso(valor) {
        console.log('loadModalUsuarios')
        this.showModalErrorAcceso = valor;
      },
      loadModalServiceUnavailable(valor) {

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
 

      showPanelBusqueda(valor) {
        this.showBusqueda = valor;
      },
      cerrarPanelDerecho() {
        this.panelDerechoVisible = false
        this.listarcarpetas(this.area_seleccionada_id)
      },
      refreshTree() {
        
        this.listarcarpetas(this.area_seleccionada_id)
      },
      async listarcarpetas(area_id) {
        try {

          const r = await api.get(`drive/tree/${area_id}/`);

          if (area_id==1){
          this.data = r.data
          this.ordenarChildrenAscendente(this.data)
          }

          if (area_id==2){
          this.data2 = r.data
          this.ordenarChildrenAscendente(this.data2)
          }

        } catch (error) {
          console.error("error obteniendo arbol", error)
          throw error;
        }

      },
      ordenarChildrenAscendente(nodes) {

        // validar array
        if (!Array.isArray(nodes)) return;

        // ordenar actual nivel
        nodes.sort((a, b) =>
          b.name.localeCompare(
            a.name,
            'es',
            { sensitivity: 'base' }
          )
        );

        // recorrer hijos recursivamente
        nodes.forEach(node => {

          if (node.children && node.children.length > 0) {
            console.log('tiene hijos')
            this.ordenarChildrenAscendente(node.children);
          }

        });


      },
    },

    data() {
      return {
        centro: {},

        imgbase64: '',
        isOnline: false,
        buildDate: import.meta.env.BUILD_DATE,

        razonSocial: '',
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

          { name: i18n.global.t('cerrarsesion'), href: "/logout" },
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
        lang: '',
        showFormCambiaPass: false,
        showModalUsuarios: false,
        showModalServiceUnavailable: false,
        showModalErrorAcceso: false,
        message: false,
        showBusqueda: false,
        resultados_busqueda: [],
        area_id: 1,
        data: {},
        data2:{}
      };
    },


    setup() {
      const isSmallScreen = ref(window.innerWidth <= 768);
      const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
      const panelDerechoVisible = ref(false)
      const nodeSelec = ref({})
      const seccionVisible = ref(false)
      const area_seleccionada_id = ref(0)
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
      const selectNode = (valor) => {
        console.log('-->', valor)
        nodeSelec.value = valor
      }
      const selectSeccion = (valor) => {
        console.log('-->', valor)
        seccionVisible.value = valor
      }
      const selectAreaId=(valor)=>{
         console.log('*****', valor)
         area_seleccionada_id.value =valor
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
        setNode: selectNode,
        seccionVisible: selectSeccion,
        setAreaSelec: selectAreaId
      })

      return { isSmallScreen, isPortrait, panelDerechoVisible, nodeSelec, seccionVisible,area_seleccionada_id };
    },
    
  };
</script>