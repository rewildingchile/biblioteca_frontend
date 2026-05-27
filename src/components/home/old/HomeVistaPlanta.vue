 
<template>

    <div class="min-h-full">
      <TransitionRoot as="template" :show="sidebarOpen">
        <Dialog
          as="div"
          class="relative z-40 lg:hidden"
          @close="sidebarOpen = false"
        >
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </TransitionChild>
  
          <div class="fixed inset-0 flex z-40">
            <TransitionChild
              as="template"
              enter="transition ease-in-out duration-300 transform"
              enter-from="-translate-x-full"
              enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leave-from="translate-x-0"
              leave-to="-translate-x-full"
            >
              <DialogPanel
                class="
                  relative
                  flex-1 flex flex-col
                  max-w-xs
                  w-full
                  pt-5
                  pb-4
                  bg-cyan-700
                ">
                <TransitionChild
                  as="template"
                  enter="ease-in-out duration-300"
                  enter-from="opacity-0"
                  enter-to="opacity-100"
                  leave="ease-in-out duration-300"
                  leave-from="opacity-100"
                  leave-to="opacity-0"
                >
                  <div class="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      class="  ml-1 flex  items-center  justify-center   h-10  w-10   rounded-full  focus:outline-none   focus:ring-inset  focus:ring-white"
                      @click="sidebarOpen = false">
                      <span class="sr-only">Close sidebar</span>
                      <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <div class="flex-shrink-0 flex items-center px-4">
                  <img
                    class="h-8 w-auto"
                    src="../../assets/logo_oxytek_b.png"
                    alt="Oxytek"
                  />
                </div>
                <SideBarMovilCliente
                  :navigation="navigation"
                  :secondaryNavigation="secondaryNavigation"
                  :adminNavigation="adminNavigation"
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
      <SideBarDesktopCliente
        :navigation="navigation"
        :secondaryNavigation="secondaryNavigation"
        :adminNavigation="adminNavigation"
      ></SideBarDesktopCliente>
  
      <div class="lg:pl-64 flex flex-col flex-1">
        <div
          class="
            relative
            z-10
            flex-shrink-0 flex
            h-16
            bg-white
            border-b border-gray-200
            lg:border-none
          "
        >
          <button
            type="button"
            class="
              px-4
              border-r border-gray-200
              text-gray-400
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500
              lg:hidden
            "
            @click="sidebarOpen = true"
          >
            <span class="sr-only">Open sidebar</span>
            <MenuAlt1Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <!-- Search bar -->
          <div
            class="
              flex-1
              px-4
              flex
              justify-between
              sm:px-6
              lg:max-w-6xl lg:mx-auto lg:px-8
            "
          >
            <div class="flex-1 flex">
   
            </div>
            <div class="ml-4 flex items-center md:ml-6">
           <!--  <button
                type="button"
                class="
                  bg-white
                  p-1
                  rounded-full
                  text-gray-400
                  hover:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-cyan-500
                "
              >
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>--> 
  
              <!-- Profile dropdown -->
              <Menu as="div" class="ml-3 relative">
                <div>
                  <MenuButton
                    class="
                      max-w-xs
                      bg-white
                      rounded-full
                      flex
                      items-center
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-offset-2
                      focus:ring-cyan-500
                      lg:p-2 lg:rounded-md lg:hover:bg-gray-50
                    "
                  >
                    <img
                      class="h-8 w-8 rounded-full"
                      src="../../assets/logo_oxytek_b.png"
                      alt=""
                    />
                    <span
                      class="
                        hidden
                        ml-3
                        text-gray-700 text-sm
                        font-medium
                        lg:block
                      "
                      ><span class="sr-only">Open user menu for </span
                      >Opciones</span
                    >
                    <ChevronDownIcon
                      class="
                        hidden
                        flex-shrink-0
                        ml-1
                        h-5
                        w-5
                        text-gray-400
                        lg:block
                      "
                      aria-hidden="true"
                    />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="
                      origin-top-right
                      absolute
                      right-0
                      mt-2
                      w-48
                      rounded-md
                      shadow-lg
                      py-1
                      bg-white
                      ring-1 ring-black ring-opacity-5
                      focus:outline-none  "  >
                    <MenuItem v-slot="{ active }">
                      <a
                        href="/settings/profile"
                        :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700',
                        ]"
                        >Ir a Perfil</a
                      >
                    </MenuItem>
                     
                    <MenuItem v-slot="{ active }">
                      <a
                        href="/logout/"
                        :class="[
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700',
                        ]"
                        >Cerrar sesion</a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>
        <main class="flex-1 pb-8">
          <!-- Page header -->
  
          <HeaderCliente :datosUsuario="datosUsuario"></HeaderCliente>
          <div class="mt-8">
            <div class="mx-auto px-4 sm:px-6 lg:px-8">
              
              <VistaPlanta></VistaPlanta>

            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { mapGetters } from "vuex";
  import router from "../../router";
  import HeaderCliente from "../HeaderCliente";
  import SideBarMovilCliente from "../resumen/SideBarMovilCliente";
  import SideBarDesktopCliente from "../resumen/SideBarDesktopCliente";
 
  import VistaPlanta from "../VistaPlanta";
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
   
    HomeIcon,
    XIcon,
    MenuAlt1Icon,
    //SearchIcon,
    ChevronDownIcon,
    LogoutIcon,
    LockClosedIcon,
    UserGroupIcon,
    
  } from "@heroicons/vue/outline";
  
  export default {
    created() {
      if (!this.user) {
        router.push("/expire");
      }
      this.datosUsuario = {
        nombreUsuario: this.user.nombreUsuario,
        rol: this.user.rol,
        idEmpresa: this.user.idEmpresa,
      };
    },
    mounted() {
      this.pantalla = 1;
      if(this.datosUsuario.rol!=="Administrador"){
        this.adminNavigation=[]
      }
    },
    methods: {
      loadDivisiones(f) {
        this.selectDivisionesByIdFaena = f.idFaena;
        this.nombreFaena = f.faena;
        this.pantalla = 2;
      },
      loadFaenas() {
        console.log("pantalla 1");
        this.pantalla = 1;
      },
      loadFormCliente() {
        console.log("pantalla 3");
        this.pantalla = 1;
      },
    },
    data() {
      return {
        datosUsuario: {},
        pantalla: 0,
        rol: "",
        selectDivisionesByIdFaena: 0,
        nombreFaena: "",
        navigation: [{ name: "Home", href: "/home", icon: HomeIcon, current: true }],
        secondaryNavigation: [
        
          { name: "Cambiar Password", href: "/settings/profile/changepass", icon: LockClosedIcon },
          { name: "Cerrar Sesion", href: "/logout", icon: LogoutIcon },
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
      };
    },
    components: {
      HeaderCliente,
      SideBarMovilCliente,
      SideBarDesktopCliente,
 
      VistaPlanta,
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
      ChevronDownIcon 
    },
    computed: {
      ...mapGetters(["user"]),
    },
  };
  </script>
    