<template>
  <div class="relative overflow-hidden bg-tech min-h-screen">

    <!-- Fondo animado -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      
      <!-- Glow principal -->
      <div class="glow glow-blue"></div>
      <div class="glow glow-pink"></div>
      <div class="glow glow-purple"></div>

      <!-- Grid tecnológico -->
      <div class="tech-grid"></div>

      <!-- Líneas -->
      <div class="line line-1"></div>
      <div class="line line-2"></div>
      <div class="line line-3"></div>

      <!-- Partículas -->
      <div class="particles">
        <span v-for="n in 25" :key="n"></span>
      </div>

    </div>

    <ModalLogin
      :show="showModal"
      :error="error"
      @close="showModal = false"
    />

    <div class="w-full h-10 bg-black/40 backdrop-blur-md lg:fixed lg:inset-y-0 z-20"></div>

    <!-- CONTENIDO -->
    <div
      class="relative z-10 flex items-center justify-center min-h-screen px-4"
    >
      <div class="min-h-full flex flex-col">

        <div
          v-if="visible"
          class="pt-1 sm:mx-auto sm:w-full sm:max-w-md"
        >

          <!-- CARD -->
          <div
            class="login-card py-8 px-4 sm:rounded-2xl sm:px-6 lg:px-12"
          >

            <div class="flex items-center justify-center text-center p-1 text-2xl   w-[350px]  font-mono text-white tracking-wider uppercase">
             <img src="@/assets/images/logo.png" width="250"  >  
            </div>

            <div class="flex items-center justify-center text-center p-1 text-blue-200 font-mono">
              {{ this.mensaje }}
            </div>

            <form class="space-y-6 mt-6" @submit.prevent="handleSubmit">

              <!-- USER -->
              <div>
                <div class="mt-1">
                  <input
                    id="userName"
                    v-model="userName"
                    name="userName"
                    type="text"
                    autocomplete="userName"
                    placeholder="Usuario"
                    class="tech-input"
                  />
                </div>

                <p
                  v-if="err_username"
                  class="text-red-400 text-sm mt-2 font-mono"
                >
                  {{ $t('username requerido') }}
                </p>
              </div>

              <!-- PASSWORD -->
              <div>

                <div class="relative w-full mb-3 mt-1">

                  <input
                    id="password"
                    v-model="password"
                    name="password"
                    :type="type0"
                    autocomplete="current-password"
                    placeholder="Password"
                    class="tech-input"
                  />

                  <div
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    <a
                      @click="showPassword"
                      class="font-mono text-pink-300 hover:text-pink-200 cursor-pointer transition"
                    >
                      {{ btnText0 }}
                    </a>
                  </div>

                  <p
                    v-if="err_password"
                    class="text-red-400 text-sm mt-2 font-mono"
                  >
                    {{ $t('password requerida') }}
                  </p>

                </div>
              </div>

              <!-- BUTTON -->
              <div>

                <div v-if="loading">
                  <div
                    class="w-10 h-10 mx-auto border-4 border-gray-500 border-t-cyan-400 rounded-full animate-spin"
                  ></div>
                </div>

                <button
                  v-else
                  type="submit"
                  class="tech-button" 
                >
                  {{ $t('entrar') }}
                </button>

                <img
                  v-if="qrDataUrl"
                  :src="qrDataUrl"
                  alt="QR OTP"
                  class="mx-auto mt-4 rounded-lg"
                />

                <span
                  v-if="qrDataUrl"
                  class="text-cyan-200 text-sm block text-center mt-2"
                >
                  Escanee QR
                </span>

              </div>

            </form>
          </div>

        </div>
      </div>
    </div>

    <!-- OFFLINE -->
    <div
      v-if="isOnline == false"
      class="sticky bottom-0  text-white text-center py-4 z-50"
    >
      <p>{{ $t('sinconexion') }}</p>
    </div>

  </div>
</template>

<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
 
<script>
import { ref } from 'vue'
import { mapActions } from "vuex";
import router from "../../router";
import ModalLogin from "./ModalLogin.vue";
import DOMPurify from "dompurify";
//import vueRecaptchaEsp from "vue3-recaptcha2";
import i18n from '@/i18n';
 
export default {
  name: "LoginRootCaptcha",
  components: {
  //  vueRecaptchaEsp,
    ModalLogin,
  },
  created() {
    this.checkInternet();
    window.addEventListener("online", this.checkInternet);
    window.addEventListener("offline", () => (this.isOnline = false));
  },
  mounted() {
    window.localStorage.removeItem("user");

    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.handleClickOutside)


    }
    const l = i18n.global.locale.value;
    console.log('lang', l)
  },
  data() {
    return {
      visible:true,
      type0: 'password',
      isOnline: false,
      showRecaptcha: true,
      loadingTimeout: 30000, // 30 seconds
      userName: "",
      password: "",
      showModal: false,
      status: "0",
      token: "",
      mensaje: "",
      verificado: false,
      keycliente: "6LdgnAcpAAAAAJHBHchPcK5qJjGc1oEa55pFpJTr",
      showDropdown: false,
      dropdownRef: { value: ref(null) },
      btnText0: ref(i18n.global.t('mostrar')),
      hl: '',
      err_password:false,
      err_username:false,
      qrDataUrl:'',
      loading:false,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    showPassword() {

      if (this.type0 === 'password') {
        this.type0 = 'text'
        this.btnText0 = i18n.global.t('ocultar')
      } else {
        this.type0 = 'password'
        this.btnText0 = i18n.global.t('mostrar')
      }
    },
    async checkInternet() {
      try {

        await fetch("https://www.google.cl", { mode: "no-cors" });
        this.isOnline = true;
      } catch (error) {
        this.isOnline = false;
      }
    },
    updModal() {
      this.showModal = true;
    },
    async handleSubmit() {

        this.err_username = this.userName === '';
      this.err_password = this.password === '';
      if(this.err_username || this.err_password ){
          return false;
      }
       

      try {
        this.mensaje =   i18n.global.t('enviando datos...');
        this.$store.state.auth.statusLogin='';
        let e = DOMPurify.sanitize(this.userName);
        let p = DOMPurify.sanitize(this.password);
        this.loading=true;
         await this.$store.dispatch("login_QR", { e, p });
        //await this.$store.dispatch("login", { e, p });FV
        
        //const status=this.$store.state.auth.statusLogin.status
        const status=this.$store.state.auth.statusLogin.status
         
        if (status == "OTP_SETUP_REQUIRED"){
           router.push("/otpsetupqr");
           return true;
        }
        if (status == "OTP_REQUIRED"){
          router.push("/otpsetupcode")
          return true;
        }
        if (status == 200) {
         
          router.push("/home");
        } else {
          this.loading=false;
          if (status == 300) {
            this.error =   i18n.global.t('error_datos_novalidos');
            this.updModal();
           
          } else {
            if ([404].includes(status)) {
              this.error =  i18n.global.t('error_servicios_nodisponibles');
              this.updModal();
            } else {
              this.error =i18n.global.t('Datos incorrectos');
              this.updModal();
              this.mensaje =""
            }
          }
        }
      } catch (err) {
        this.error =i18n.global.t('error_interno_servidor');
        this.updModal();
        console.log(err);
        this.mensaje = err;
      }
    },
    async recaptchaVerified(response) {
      console.log("respuesta", response);

      const url = "https://www.google.com/recaptcha/api/siteverify";
      const token = response;
      const clave = this.keycliente;
      const data = {
        Secret: clave,
        respuesta: token,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          // Realizar acciones adicionales con la respuesta del servidor
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud POST:", error);
          // Manejar errores
        });

      this.verificado = true;
    },
    recaptchaExpired() {
      this.$refs.vueRecaptcha.reset();
    },
    recaptchaFailed() { },
    recaptchaError(reason) {
      console.log("reason", reason);
    },


    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },

    selectLanguage(lang) {
      console.log('Idioma seleccionado:', lang)

      const l = ref(i18n.global.locale.value);
      console.log('lang', l)

      i18n.global.locale.value = lang;
      localStorage.setItem('lang', lang);

      this.btnText0 = i18n.global.t('mostrar');
     

      this.showDropdown = false
     
      if (lang == 'en') {
        console.log('redirige')
        this.visible=false
        parent.window.location.href = '/en';
      }

    },

    handleClickOutside(event) {
      console.log('event', event._vts)
      if (
        !event._vts
      ) {
        this.showDropdown = false
      }
    },


    reloadRecaptchaScript(hl) {
      const oldScript = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]');
      if (oldScript) {
        document.head.removeChild(oldScript);
      }

      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${hl}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }


  },
  watch: {
    async hl(value) {
      this.reloadRecaptchaScript(value)

    },
  },

}
</script>
