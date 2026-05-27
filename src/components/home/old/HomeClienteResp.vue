<template>
  <div class="min-h-full">

    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
          enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
          leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
            leave-to="-translate-x-full">
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
                <img class="h-8 w-auto" src="../../assets/logo_oxytek_b.png" alt="Oxytek" />
              </div>

              <SideBarMovilCliente v-if="pantalla !== 0" :navigation="navigation"
                :secondaryNavigation="secondaryNavigation" :adminNavigation="adminNavigation" :faenas="faenas"
                @chgFaenaCentros="loadCentros" @chgIdPantalla="chgPantalla" @chgCentros="chgCentro"
                @loadHistorial="loadHistorial"></SideBarMovilCliente>

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

    <SideBarDesktopCliente v-if="pantalla !== 0" :navigation="navigation" :secondaryNavigation="secondaryNavigation"
      :adminNavigation="adminNavigation" :faenas="faenas" @chgFaenaCentros="loadCentros" @chgIdPantalla="chgPantalla"
      @chgCentros="chgCentro" @loadHistorial="loadHistorial"  @handleDropFaena="handleDropFaena"></SideBarDesktopCliente>

    <SideBarDesktopSettings @chgIdPantalla="chgPantalla" v-if="pantalla === 0"></SideBarDesktopSettings>

    <div class="lg:pl-64 flex flex-col flex-1">
      <div class="relative z-10 flex-shrink-0 flex h-16 border-b border-gray-200 lg:border-none bg-cyan-700">
        <button type="button"
          class="px-4 border-r border-gray-200 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
          @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <MenuAlt1Icon class="h-6 w-6" aria-hidden="true" />
        </button>
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
            <!--  nombre empresa -->
            <span class="text-2xl text-white font-bold">{{ razonSocial}}</span>
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 lg:p-2 lg:rounded-md lg:hover:bg-gray-50">
                  <span class="items-left hidden ml-3 text-gray-700 text-xs lg:block"><span class="sr-only">abrir menu
                    </span>{{ datosUsuario.nombreUsuario }}<br />{{
      datosUsuario.rol
    }}</span>
                  <ChevronDownIcon class="hidden flex-shrink-0 ml-1 h-5 w-5 text-gray-400 lg:block"
                    aria-hidden="true" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                  <a href="/settings/profile" :class="[
      active ? 'bg-gray-100' : '',
      'block px-4 py-2 text-sm text-gray-700',
    ]">Ir a Perfil</a>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                  <a href="/logout/" :class="[
      active ? 'bg-gray-100' : '',
      'block px-4 py-2 text-sm text-gray-700',
    ]">Cerrar sesion</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
      <main class="flex-1 pb-8">
        <!-- Page header -->

        <div class="mt-1">
          <div class="mx-auto px-1 sm:px-1 lg:px-1">

           
            
            <HomeSettings v-if="pantalla === 0"></HomeSettings>

            <DivisionesCliente v-if="pantalla === 2" :idEmp="this.user.idEmpresa" :idFaena="selectDivisionesByIdFaena"
              :nombreFaena="nombreFaena" @chgDivision="loadFaenas"></DivisionesCliente>

            <FaenasCliente v-if="pantalla === 1" :idEmpresa="datosUsuario.idEmpresa"
              :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones" @chgFaenaCentros="loadCentros"
              @chgHistorialCentros="loadHistorial" @chgDivisionesMenuLat="sendDivisionesMenuLat"
              @chgIdPantalla="chgPantalla" @handleDropFaena="handleDropFaena"></FaenasCliente>

            <VistaCentros v-if="pantalla === 4" :idEmpresa="datosUsuario.idEmpresa"
              :propIdFaena="this.selectDivisionesByIdFaena" :nombreEmpresa="datosUsuario.nombre"
              :nombreFaena="this.nombreFaena" :numRam="numRam" @chgFaena="loadDivisiones"></VistaCentros>

            <VistaHistorialCentros v-if="pantalla === 5" :idEmpresa="datosUsuario.idEmpresa"
              :idFaena="this.selectDivisionesByIdFaena" :nombreEmpresa="datosUsuario.nombre"
              :nombreFaena="this.nombreFaena" @chgFaena="loadDivisiones"></VistaHistorialCentros>
          </div>
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
import axios from "axios";
import { ref } from "vue";
import router from "../../router";
import { mapActions } from "vuex";

import SideBarMovilCliente from "../resumen/SideBarMovilCliente";
import SideBarDesktopCliente from "../resumen/SideBarDesktopCliente";
import FaenasCliente from "../resumen/FaenasCliente";
import DivisionesCliente from "../resumen/DivisionesCliente";

import ToolBarVistaFaenas from "../ToolBarVistaFaenas";
import ToolBarVistaCentros from "../ToolBarVistaCentros";
import ToolBarVistaHistorial from "../ToolBarVistaHistorial";
import VistaCentros from "../live/VistaCentros";
import VistaHistorialCentros from "../historial/VistaHistorialCentros";

import SideBarDesktopSettings from "../settings/SideBarDesktopSettings";
import SideBarMovilSettings from "../settings/SideBarMovilSettings";
import ToolBarVistaSettings from "../settings/ToolBarVistaSettings";
import HomeSettings from "../settings/HomeSettings";

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
import {
  //BellIcon,

  XIcon,
  MenuAlt1Icon,
  //SearchIcon,
  ChevronDownIcon,
  LogoutIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline";

export default {
  components: {
    SideBarMovilCliente,
    SideBarDesktopCliente,
    DivisionesCliente,
    FaenasCliente,
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
    MenuAlt1Icon,
    // SearchIcon,
    ChevronDownIcon,
    VistaCentros,

    VistaHistorialCentros,
    ToolBarVistaFaenas,
    ToolBarVistaCentros,
    ToolBarVistaHistorial,
    ToolBarVistaSettings,
    SideBarDesktopSettings,
    SideBarMovilSettings,
    HomeSettings,
  },
  created() {
    this.user = this.$store.state.login.userLogin;

    if (Object.entries(this.user).length === 0) {
      router.push("/");
      console.log("sin definir status login");
      return false;
    }
    this.datosUsuario = {
      nombreUsuario: this.user.info.nombres + " " + this.user.info.apellido1,
      // rol: this.user.rol,
      rol: "Administrador",
      idEmpresa: this.user.info.idEmpresa,
    };
  },
  mounted() {
    if (this.$store.state.login.statusLogin == "0") {
      window.localStorage.removeItem("user");
      router.push("/");
      console.log("sin definir status login");
      return false;
    }
    
    this.user = this.$store.state.login.userLogin;
    this.razonSocial =  this.user.info.razonSocial;
    this.pantalla = 1;

    if (this.datosUsuario.rol !== "Administrador") {
      this.adminNavigation = [];
    }
    this.faenas = this.user.info.faenas;
    this.tokenseguridad = this.token;
  },
  methods: {
    ...mapActions("divisiones", ["getDivisionesApi"]),

    loadDivisiones(f) {
      this.selectDivisionesByIdFaena = f.id;
      this.nombreFaena = f.faena;
      this.pantalla = 2;
    },
    loadFaenas() {
      this.pantalla = 1;
    },
    loadFormCliente() {
      this.pantalla = 1;
    },
    chgPantalla(f) {
      this.pantalla = f.id;

      this.sidebarOpen = false;
    },
    chgCentro(f) {
      console.log("chgCentro ", f.id, f.nombre);
      this.selectDivisionesByIdFaena = f.id;
      this.nombreFaena = f.nombre;
      let pantalla = 4;
      this.getDivisionesApi(f.id, pantalla);
      this.sidebarOpen = false;
    },
    loadCentros(f) {
     
      
      this.selectDivisionesByIdFaena = f.id;
      this.nombreFaena = f.nombre;
      
      console.log("chgCentro load centros ", f.id, this.nombreFaena);
      let pantalla = 4;
      this.getDivisionesApi(f.id, pantalla);
    },
    loadHistorial(f) {
      this.selectDivisionesByIdFaena = f.id;
      this.nombreFaena = f.nombre;
      let pantalla = 5;
      this.getDivisionesApi(f.id, pantalla);
    //  console.log("LOAD HISTORIAL CENTROS ", this.nombreFaena);
      this.sidebarOpen = false;
    },
    sendDivisionesMenuLat(f) {
      this.faenas = f;
    },
    async getDivisionesApi(faena, pantalla) {
     
      /* const apiKey = this.$store.state.login.tokenLogin;
      const idEmpresa = this.datosUsuario.idEmpresa;
      console.log('getDivisionesApi')
      await this.$store.dispatch("getDivisionesApi", {
        idEmpresa,
        faena,
        apiKey,
      }); */
      
      this.pantalla = pantalla;
    },
    handleDropFaena() {
      this.jsonObject.preference.items = []
      let droppables = this.$store.getters.getDroppables
      let order=0;
      droppables.forEach(faena => {
        order++;
        let visible = faena.visible ? 1 : 0;
        this.jsonObject.preference.items.push({ "id": faena.id,   "visible": visible, "order":order })
        
      })

      const jsonString = JSON.stringify(this.jsonObject, null, 2);
      this.sendPreference(jsonString).then(msg => {
        console.log(msg)

      }).catch(error => {
        console.error('Error al insertar preferencia:', error);
      });
    },
    async sendPreference(jsonString) 
    {
      console.log('sendPreferences');
      let url ='/api/ctl/setPreference';

      const apiKey = this.$store.state.login.tokenLogin;
      try {
       const resp = await axios.post(url, jsonString, {
         headers: {
           'Content-Type': 'application/json',
          'Authorization': `${apiKey}`
         },
       });
      
      let msg;
       const status=resp.data.status;
       switch (status) {
         case 200: msg='solicitud fetch ok'; break;   
       }
       return msg;
     } catch (error) {
       console.log(error.responseJSON.message);
       throw error;
     }
       
    },
  },

  data() {
    return {
      buildDate: process.env.BUILD_DATE,
      user: Object,
      jaulas: [],
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
        { name: "Cerrar Sesión", href: "/logout", icon: LogoutIcon },
      ],
      adminNavigation: [
        { name: "Cuentas Usuarios", href: "/settings", icon: UserGroupIcon },
        { name: "Vista Planta", href: "/homevistaplanta", icon: UserGroupIcon },
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
          items: []
        }
      }
    };
  },

  computed: {},
};
</script>
