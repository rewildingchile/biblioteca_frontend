<template>
    <div class="flex h-screen">
      
      <!-- Sidebar para pantallas grandes -->
      <aside class="hidden lg:flex lg:flex-col bg-gray-800 text-white fixed h-screen max-w-[180px] w-[180px]" >
    <div class="flex items-center justify-center mt-3">
        <a href="https://www.oxytek.cl/" target="_blank"
          ><img class="w-140 mx-auto" src="../../assets/logo_blanco.png"
        /></a>
      </div>
      <ul class="p-4 space-y-4">
        <li><a href="#" class="block p-2">Opción 1</a></li>
        <li><a href="#" class="block p-2">Opción 2</a></li>
        <li><a href="#" class="block p-2">Opción 3</a></li>
      </ul>
    </aside>
  
      <!-- Sidebar colapsable para móviles -->
      <aside
        class="lg:hidden w-64 bg-gray-800 text-white absolute h-screen transform transition-transform duration-300"
        :class="{'translate-x-0': isOpen, '-translate-x-full': !isOpen}"
       
      >
        <button
          class="text-white p-2 focus:outline-none"
          @click="toggleMenu"
        >
          Menú
        </button>
        <ul v-if="isOpen" class="p-4 space-y-4">
          <li><a href="#" class="block p-2">Opción 1</a></li>
          <li><a href="#" class="block p-2">Opción 2</a></li>
          <li><a href="#" class="block p-2">Opción 3</a></li>
        </ul>
      </aside>
  
      <!-- Sección principal -->
      <main class="flex-1 overflow-y-auto bg-gray-100 p-4">
        <!-- Aquí puedes agregar contenido desplazable -->
        <h1 class="text-2xl font-bold">Contenido Principal</h1>
        <div class="space-y-4">
          <p>
            Aquí puedes colocar cualquier contenido desplazable en el main.
          </p>
          
          <FaenasCliente v-if="pantalla === 1" :idEmpresa="datosUsuario.idEmpresa"
              :nombreEmpresa="datosUsuario.nombre" @chgFaena="loadDivisiones" @chgFaenaCentros="loadCentros"
              @chgHistorialCentros="loadHistorial" @chgDivisionesMenuLat="sendDivisionesMenuLat"
              @chgIdPantalla="chgPantalla" @handleDropFaena="handleDropFaena"></FaenasCliente>

        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from "axios";
import { ref } from "vue";
import router from "../../router";
import { mapActions } from "vuex";
  import FaenasCliente from "../resumen/FaenasCliente";
  import {
  //BellIcon,

  
  LogoutIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline";
  export default {
    components: {
      FaenasCliente,
    
 
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
  };
  </script>
  
  <style scoped>
  /* Ajustes adicionales opcionales */
  </style>
  