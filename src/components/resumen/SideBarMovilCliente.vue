<template> 
    <div class="flex flex-col h-full
             border-r border-white/5
             bg-slate-950/80
             backdrop-blur-2xl
             overflow-y-auto
             items-center"
    >

      <!-- TOP GLOW -->
      <div class="absolute top-0 left-0 w-full h-10  blur-3xl pointer-events-none" ></div>

      <!-- LOGO -->
      <div class="relative pt-2 pb-0">

        <div  class="w-16 h-16  rounded-2xl
                 border border-cyan-400/20 bg-white/[0.03]
                 flex items-center justify-center
                 shadow-[0_0_25px_rgba(34,211,238,.15)]"  >

          <img  src="@/assets/images/logo2.png"  class="w-11 opacity-90"   >

        </div>

      </div>

      <!-- NAV -->
      <nav
        class="relative mt-1
               flex flex-col items-center
               gap-7"
      >

        <!-- ITEM -->
        <div class="sidebar-item-group">

          <button
            @click="ExitCodAccion(2)"
            class="sidebar-button"
          >

            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"
              />
            </svg>

          </button>

          <span class="sidebar-label">
            HOME 
          </span>

        </div>

        <!-- ITEM -->
        <div class="sidebar-item-group">

          <button
            @click="ExitCodAccion(2)"
            class="sidebar-button"
          >

            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v12"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 8l4-4 4 4"
              />

            </svg>

          </button>

          <span class="sidebar-label">
            UPLOAD 
          </span>

        </div>

        <!-- ITEM -->
        <div class="sidebar-item-group">

          <button
            @click="ExitCodAccion(3)"
            class="sidebar-button"
          >

            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 17v-6m3 6V7m3 10v-3"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 21h14"
              />

            </svg>

          </button>

          <span class="sidebar-label">
            INDEXAR
          </span>

        </div>

        <!-- ITEM -->
        <div class="sidebar-item-group">

          <button
            @click="ExitCodAccion(8)"
            class="sidebar-button"
          >

            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13h4v8H3v-8z"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 7h4v14h-4V7z"
              />

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 11h4v10h-4V11z"
              />

            </svg>

          </button>

          <span class="sidebar-label">
            REPORT
          </span>

        </div>

      </nav>

      <!-- FOOTER -->
      <div
        class="mt-auto mb-6
               flex flex-col items-center gap-2"
      >

        <button
          @click="$router.push('/logout')"
          class="sidebar-button sidebar-button-danger"
        >

          <svg
            class="w-7 h-7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 2v10"
            />

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.364 5.636a9 9 0 11-12.728 0"
            />

          </svg>

        </button>

        <span class="sidebar-label">
          SALIR
        </span>

      </div>

    </div>

 

</template>
<style scoped>
@import "@/assets/css/tech-theme-sidemenu.css";
</style>
 
 
<script>
import axios from "axios";
import { HomeIcon } from "@heroicons/vue/outline";

import { mapActions } from "vuex";
import {
  //BellIcon,

  LibraryIcon,
  UserGroupIcon,

  MapIcon
} from "@heroicons/vue/outline";
export default {
  name: "SideBarDesktopCliente",
  emits: [
    "chgFaenaCentros",
    "chgIdPantalla",
    "chgIdPantalla2",
    "handleDropFaena",
    "loadModalUsuarios",
    "loadModalServiceUnavailable"],
  data() {
    return {
      seleccion: {
        historial: 0,
        live: 0,
        resumen: false
      },
      adminNavigation: [
        { name: "Usuarios", click: () => this.showModalUsuario(), icon: UserGroupIcon },

      ]
    }
  },
  props: {
    navigation: {
      type: Object,
    },
    secondaryNavigation: {
      type: Object,
    },

    faenas: {
      type: Array,
    },
  },
  watch: {

  },
  components() {
    HomeIcon,
      LibraryIcon,
      UserGroupIcon,

      MapIcon
  },
  methods: {
    ...mapActions("draggdropp", ["draggableCreate", " setIdCurrentDrag"]),
    async showModalUsuario() {
      let cod = await this.chkPermisos();
      //console.log( 'cod', cod );
      if (cod == 401) {
        this.$emit("loadModalErrorAcceso", true);
      } else {
        if (cod == 200) {
          this.$emit("loadModalUsuarios", true);
        } else {

          this.$emit("loadModalServiceUnavailable", true);
        }
      }
    },
    async chkPermisos() {
      try {
        const apiKey = this.$store.state.login.tokenLogin;

        const data = {};
        const url = "/api/admin/getUsers";
        const resp = await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${apiKey}`,
          },
        });
        if (resp.status === 200) {


          return resp.data.status;


        }
        return 0;

      } catch (err) {
        //console.log(err.response) ;         
      }
    },
    showModalConfiguracion() {
      //console.log('configuracion');
    },

    ExitCodAccion(id) {
      // //console.log("chgIdPantalla2 ", 1);
      this.seleccion.historial = 0;
      this.seleccion.live = 0;
      this.seleccion.resumen = true;
      this.$emit("chgIdPantalla", { id: id });
    },


  },
  mounted() {
    this.seleccion.resumen = true;
  }
};
</script>
