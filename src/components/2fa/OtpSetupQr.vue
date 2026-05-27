```html
<template>
  <div class="relative overflow-hidden bg-tech min-h-screen">

    <!-- =========================
         FONDO TECNOLÓGICO
    ========================== -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">

      <!-- Glow -->
      <div class="glow glow-blue"></div>
      <div class="glow glow-pink"></div>
      <div class="glow glow-purple"></div>

      <!-- Grid -->
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

    <!-- TOP BAR -->
    <div class="w-full h-10 bg-black/40 backdrop-blur-md lg:fixed lg:inset-y-0 z-20"></div>

    <!-- CONTENIDO -->
    <div class="relative z-10 w-full min-h-screen flex items-center justify-center px-4">

      <div class="min-h-full flex flex-col">

        <div class="m-1 lg:mt-12 xl:mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="flex items-center justify-center text-center"></div>

          <span
            v-if="!visible"
            class="text-cyan-200 font-mono"
          >
            Switching to English
          </span>
        </div>

        <!-- CARD -->
        <div
          v-if="visible"
          class="pt-1 sm:mx-auto sm:w-full sm:max-w-md"
        >

          <div class="login-card py-8 px-4 sm:rounded-2xl sm:px-6 lg:px-6">

            <form class="space-y-6" @submit.prevent="handleSubmit">

              <!-- TEXTO -->
              <div class="flex items-center justify-center text-center p-3">

                <span
                  v-if="qrDataUrl"
                  class="font-mono text-sm text-cyan-100 leading-6"
                >
                  Usa la aplicación Google Authenticator
                  o Microsoft Authenticator para escanear
                  el código QR.

                 <br>

                  Después haz click en 
                  <span class="text-pink-300 font-bold">
                    Siguiente
                  </span>
                </span>

              </div>

              <!-- QR -->
              <div class="flex justify-center">

                <div class="qr-wrapper">

                  <img
                    v-if="qrDataUrl"
                    :src="qrDataUrl"
                    alt="QR OTP"
                    class="rounded-xl"
                  />

                </div>

              </div>

              <!-- BUTTON -->
              <button
                type="submit"
                class="tech-button"
              >
                Siguiente
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

    <!-- OFFLINE -->
    <div
      v-if="isOnline == false"
      class="sticky bottom-0 bg-red-500 text-white text-center py-4 z-50"
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
 
 
import i18n from '@/i18n';
import QRCode from 'qrcode'
export default {
  name: "OtpSetupQr",
  components: {
 
  },
  created() {
    this.checkInternet();
    window.addEventListener("online", this.checkInternet);
    window.addEventListener("offline", () => (this.isOnline = false));
  },
  mounted() {
    console.warn('tokens', this.$store.state.auth.tokens)
     if ( typeof( this.$store.state.auth.tokens)  === "undefined"  || this.$store.state.auth.tokens=='' ) 
     {
      router.push("/");
      console.log("sin definir status login");
      return false;
    } 
    this.loadQr()
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
      qrDataUrl:''
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    handleSubmit(){
        router.push('/OtpSetupCode')
    },  
    async loadQr(){
         this.qrDataUrl=   await QRCode.toDataURL( this.$store.state.auth.QR);
    },
     
    async checkInternet() {
      try {

        await fetch("https://www.google.cl", { mode: "no-cors" });
        this.isOnline = true;
      } catch (error) {
        this.isOnline = false;
      }
    },
  


  
  

  
  },
  watch: {
    async hl(value) {
      this.reloadRecaptchaScript(value)

    },
  },

}
</script>
