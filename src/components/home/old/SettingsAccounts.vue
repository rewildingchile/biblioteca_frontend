<template>
  <div>
    <Disclosure as="div" class="relative bg-sky-700 pb-32 overflow-hidden" v-slot="{ open }">
      <nav
        :class="[open ? 'bg-sky-900' : 'bg-transparent', 'relative z-10 border-b border-teal-500 border-opacity-25 lg:bg-transparent lg:border-none']">
        <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div class="relative h-16 flex items-center justify-between lg:border-b lg:border-sky-800">
            <div class="px-2 flex items-center lg:px-0">
              <div class="flex-shrink-0">
                
              </div>
              <div class="hidden lg:block lg:ml-6 lg:space-x-4">
                <div class="flex">
                   <img   src="../../assets/logo_oxytek_b.png"  alt="Oxytek" />
                </div>
              </div>
            </div>
            <div class="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end">
              <div class="max-w-lg w-full lg:max-w-xs">
             
              </div>
            </div>
            <div class="flex lg:hidden">
        
            </div>
            <div class="hidden lg:block lg:ml-4">
              <div class="flex items-center">
            

                <!-- Profile dropdown -->
                <Menu as="div" class="relative flex-shrink-0 ml-4">
                  <div>
                    <MenuButton
                      class="rounded-full flex text-sm text-white focus:outline-none focus:bg-sky-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-white">
                      <span class="sr-only">Open user menu</span>Opciones
                     
                    </MenuButton>
                  </div>
                  <transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <MenuItems
                      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                      <a :href="item.href"
                        :class="[active ? 'bg-gray-100' : '', 'block py-2 px-4 text-sm text-gray-700']">{{ item.name
                        }}</a>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel class="bg-sky-900 lg:hidden">
          <div class="pt-2 pb-3 px-2 space-y-1">
           
          </div>
          <div class="pt-4 pb-3 border-t border-sky-800">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <img class="rounded-full h-10 w-10" :src="user.imageUrl" alt="" />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-white">{{ user.name }}</div>
                <div class="text-sm font-medium text-sky-200">{{ user.email }}</div>
              </div>
              <button type="button"
                class="ml-auto flex-shrink-0 rounded-full p-1 text-sky-200 hover:bg-sky-800 hover:text-white focus:outline-none focus:bg-sky-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-white">
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="mt-3 px-2">
              <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href"
                class="block rounded-md py-2 px-3 text-base font-medium text-sky-200 hover:text-white hover:bg-sky-800">
                {{ item.name }}</DisclosureButton>
            </div>
          </div>
        </DisclosurePanel>
      </nav>
      <div aria-hidden="true"
        :class="[open ? 'bottom-0' : 'inset-y-0', 'absolute inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0']">
        <div class="absolute inset-0 flex">
          <div class="h-full w-1/2" style="background-color: #0a527b" />
          <div class="h-full w-1/2" style="background-color: #065d8c" />
        </div>
        <div class="relative flex justify-center">
          <svg class="flex-shrink-0" width="1750" height="308" viewBox="0 0 1750 308"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M284.161 308H1465.84L875.001 182.413 284.161 308z" fill="#0369a1" />
            <path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#065d8c" />
            <path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0a527b" />
            <path d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z" fill="#0a4f76" />
          </svg>
        </div>
      </div>
 
    </Disclosure>

    <main class="relative -mt-32">
      <div class="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            <aside class="py-6 lg:col-span-3">
              <nav class="space-y-1">
                <a v-for="item in subNavigation" :key="item.name" :href="item.href"
                  :class="[item.current ? 'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700' : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900', 'group border-l-4 px-3 py-2 flex items-center text-sm font-medium']"
                  :aria-current="item.current ? 'page' : undefined">
                  <component :is="item.icon"
                    :class="[item.current ? 'text-teal-500 group-hover:text-teal-500' : 'text-gray-400 group-hover:text-gray-500', 'flex-shrink-0 -ml-1 mr-3 h-6 w-6']"
                    aria-hidden="true" />
                  <span class="truncate">
                    {{ item.name }}
                  </span>
                </a>
              </nav>
            </aside>

            <form class="divide-y divide-gray-200 lg:col-span-9" action="#" method="POST">
              <CuentasUsuarios  v-if="pantalla === 'CuentasUsuarios'" :datosUsuario="datosUsuario"  @chgUsuario="loadDatosUsuario" @chgPassword="loadCambiarPassUser" @chgNuevoUsuario="formNuevoUsuario"></CuentasUsuarios>
              <FormDatosUsuario v-else-if="pantalla === 'FormDatosUsuario'"  :idUsuario="idUsuario"  :idEmpresa="datosUsuario.idEmpresa"  @salir="salir" @grabardatos="grabarDatosUsuario"></FormDatosUsuario>
              <FormCambiarPassUsers v-else-if="pantalla === 'FormCambiarPassUsers'"  :cuentaUsuario="currentUser"    @salirCambiaPassUser="salirCambiaPassUser" ></FormCambiarPassUsers>
     
        </form>
            
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import CuentasUsuarios from '@/components/user/CuentasUsuarios'
import FormDatosUsuario from '@/components/user/FormDatosUsuario'
import FormCambiarPassUsers from '@/components/user/FormCambiarPassUsers.vue'; 
import axios from 'axios'
import { mapGetters } from "vuex";
import router from "../../router";
import {

  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from '@headlessui/vue'
import { SearchIcon  } from '@heroicons/vue/solid'
import {
  BellIcon,
  HomeIcon,
  UserGroupIcon,
  MenuIcon,
  UserCircleIcon,
 
  XIcon,
} from '@heroicons/vue/outline'

 
export default {
  created(){
        if (!this.user) {
      router.push("/expire");
    }
     this.datosUsuario = {
      idUsuario:this.user.idUsuario,
      nombreUsuario: this.user.nombreUsuario,
      rol: this.user.rol,
      idEmpresa: this.user.idEmpresa,
      image: 'http://localhost:8080/assets/user.jpeg'
    }
    if(this.datosUsuario.rol!=="Administrador"){
        router.push("/expire");
    }
    
  },
  mounted() {

  },
  data() {
    return {
      pantalla: 'CuentasUsuarios',
      datosUsuario: {},
      idUsuario:'',
      navigation: [
        { name: 'Home', href: '/home', current: true },
 
      ],
      subNavigation: [
        { name: 'Mi Perfil', href: '/settings/profile', icon: UserCircleIcon, current: false },
        { name: 'Cuentas', href: '/settings/', icon: UserGroupIcon, current: true },
          { name: 'Ir al home', href: '/home', icon: HomeIcon, current: false },
      ],
      userNavigation: [
    
        { name: 'Ir al Home', href: '/home' },
        { name: 'Cerrar sesion', href: '/logout' },
      ],

    }
    
  },
  methods:{
    async loadDatosUsuario(id) {
       try {  
               
                const resp = await axios.get(
                    "http://localhost:8080/api/Usuarios/GetUsuarioById?IdUsuario=" +id
                );
                this.currentUser = resp.data
                this.pantalla= 'FormDatosUsuario'
                this.idUsuario=id;
            } catch (err) {

                console.log(err);
            }
    } , 
    async loadCambiarPassUser(id){
         try {  
               
                const resp = await axios.get(
                    "http://localhost:8080/api/Usuarios/GetUsuarioById?IdUsuario=" +id
                );
                  this.currentUser = resp.data
                  this.pantalla= 'FormCambiarPassUsers'
                  console.log( this.currentUser);
                  this.idUsuario=id;
            } catch (err) {

                console.log(err);
            }
      
    },
    salir(){
        console.log('saliendo')
          this.pantalla= 'CuentasUsuarios'
            
        
    },
    formNuevoUsuario(){
      this.idUsuario=''
      this.pantalla= 'FormDatosUsuario'
    },
    grabarDatosUsuario(){
       console.log('GRABAR DATOS!');


       //api/Usuarios/CambiaPass?userId=11&nuevoPass=11
       
    }
  },
  components:{
    CuentasUsuarios,
    FormDatosUsuario,
    Disclosure,
    BellIcon,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Switch,
    SwitchDescription,
    SwitchGroup,
    SwitchLabel,
    SearchIcon,
    MenuIcon,
    XIcon,
    FormCambiarPassUsers
},
   computed: {
    ...mapGetters(["user"]),
  },
 


}
</script>