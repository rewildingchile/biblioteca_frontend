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

    <!-- TOP -->
    <div
      class="w-full h-10 bg-black/40 backdrop-blur-md lg:fixed lg:inset-y-0 z-20"
    ></div>

    <!-- CONTENIDO -->
    <div
      class="relative z-10 w-full min-h-screen flex items-center justify-center px-4"
    >

      <div class="min-h-full flex flex-col">

        <!-- CARD -->
        <div
          v-if="visible"
          class="pt-1 sm:mx-auto sm:w-full sm:max-w-md"
        >

          <div
            class="login-card py-8 px-4 sm:rounded-2xl sm:px-6 lg:px-6"
          >
             <!-- LOGO -->
  <div class="flex items-center justify-center text-center p-1 text-2xl   font-mono text-white tracking-wider uppercase">
             <img src="@/assets/images/logo.png"  width="250" >
            </div>
            <form class="space-y-6" @submit.prevent="handleSubmit">

              <div class="form-group text-center">

             
                <div
                  class="flex items-center justify-center text-center p-1"
                >
               
                </div>

                <!-- TITULO -->
                <h2
                  class="font-mono text-lg mt-0 text-cyan-100 leading-7"
                >
                  Ingrese el código generado por su aplicación
                  Google o Microsoft Authenticator
                </h2>

                <!-- INPUTS OTP -->
                <div
                  class="flex justify-center mb-4 mt-6"
                >

                  <input
                    v-for="(digit, index) in code"
                    :key="index"
                    ref="inputs"
                    v-model="code[index]"
                    type="text"
                    maxlength="1"
                    inputmode="numeric"
                    class="code-input mx-1"
                    @input="handleInput(index)"
                    @keydown="handleKeydown($event, index)"
                    @paste="handlePaste"
                  />

                </div>

              </div>

              <!-- LOADING -->
              <div v-if="loading">
                <div
                  class="w-10 h-10 mx-auto border-4 border-gray-500 border-t-cyan-400 rounded-full animate-spin"
                ></div>
              </div>

              <!-- BUTTON -->
              <button
                v-else
                type="submit"
                class="tech-button"
              >
                Verificar
              </button>

            </form>

          </div>

          <!-- LINKS -->
          <div
            class="flex items-center justify-center text-center mt-5"
          >

            <span
              v-if="mail_enviado"
              class="text-cyan-200 font-mono"
            >
              Código enviado. Revise su bandeja de entrada
            </span>

            <a
              v-else
              style="cursor:pointer"
              @click="modalcodigos"
              class="text-pink-300 hover:text-pink-200 transition font-mono"
            >
              ¿Problemas para ingresar?
            </a>

            <div v-if="loading_mail_enviado">

              <div
                class="w-10 h-10 mx-auto border-4 border-gray-500 border-t-cyan-400 rounded-full animate-spin"
              ></div>

            </div>

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

    <!-- ERROR -->
    <div
      v-if="error == true"
      class="sticky bottom-0 bg-red-500 text-white text-center py-4 z-50"
    >
      <p>Código ingresado no válido</p>
    </div>

  </div>
</template>

<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
 
<style scoped>
 

/* =========================
   OTP INPUTS
========================= */

.code-input {

  width: 52px;
  height: 58px;

  font-size: 22px;
  font-weight: bold;
  text-align: center;

  border-radius: 14px;

  background: rgba(255,255,255,0.05);

  border: 1px solid rgba(255,255,255,0.10);

  color: white;

  backdrop-filter: blur(10px);

  transition: all .25s ease;

  font-family: monospace;

  box-shadow:
    0 0 15px rgba(0,0,0,0.15);
}

.code-input:focus {

  outline: none;

  border-color: #38bdf8;

  box-shadow:
    0 0 0 2px rgba(56,189,248,0.15),
    0 0 20px rgba(56,189,248,0.35);

  transform: translateY(-2px) scale(1.05);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 640px) {

  .code-input {

    width: 44px;
    height: 50px;

    font-size: 18px;
  }

}

</style>
<script>
import DOMPurify from "dompurify";
import { mapActions } from "vuex";
 import router from "../../router";
 //import { useParseJwt } from "@/composables/useParseJwt"
 
 import { ref, nextTick } from "vue";
export default {
  name: "OtpSetupQr",


    setup() {
    const code = ref(["", "", "", "", "", ""]);
    const inputs = ref([]);

    const handleInput = (index) => {
      // permitir solo números
      code.value[index] = code.value[index].replace(/\D/g, "");

      // avanzar automáticamente
      if (code.value[index] && index < 5) {
        nextTick(() => {
          inputs.value[index + 1].focus();
        });
      }
    };

    const handleKeydown = (event, index) => {
      // si presiona backspace y está vacío, retrocede
      if (event.key === "Backspace" && !code.value[index] && index > 0) {
        nextTick(() => {
          inputs.value[index - 1].focus();
        });
      }
    };

    const handlePaste = (event) => {
      const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
      if (pasted.length === 6) {
        code.value = pasted.split("");
        nextTick(() => {
          inputs.value[5].focus();
        });
      }
      event.preventDefault();
    };

    return {
      code,
      inputs,
      handleInput,
      handleKeydown,
      handlePaste
    };
  },
  components: {
 
  },
  created() {
    this.checkInternet();
    window.addEventListener("online", this.checkInternet);
    window.addEventListener("offline", () => (this.isOnline = false));
  },
  mounted() {
    
    

     if ( typeof( this.$store.state.auth.tokens)  === "undefined"  || this.$store.state.auth.tokens=='' ) 
     {
      router.push("/");
      console.log("sin definir status login");
      return false;
    } 

    this.error=''
     
  },
  data() {
    return {
      visible:true,
    
      isOnline: false,
      
      loadingTimeout: 30000, // 30 seconds
      
      showModal: false,
      status: "0",
     
      verificado: false,
    
      n1:'',
      n2:'',
      n3:'',
      n4:'',
      n5:'',
      n6:'',
      error:'',
      loading:false,
      mail_enviado:false,
      loading_mail_enviado: false
    
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async handleSubmit(){
        
 

       try {
        
        
        let n1 = DOMPurify.sanitize(this.code[0]);
        let n2 = DOMPurify.sanitize(this.code[1]);
        let n3 = DOMPurify.sanitize(this.code[2]);
        let n4 = DOMPurify.sanitize(this.code[3]);        
        let n5 = DOMPurify.sanitize(this.code[4]);  
        let n6 = DOMPurify.sanitize(this.code[5]);                
        let codigo= `${n1}${n2}${n3}${n4}${n5}${n6}`
     
        this.error=false
        this.loading=true


        const result = await this.$store.dispatch("verify_otp", { codigo  });
        
        
        console.log('status final',result.status)

         
        if (result.status == 200) {
        
          router.push("/home");
        } else {
            this.loading=false;
              this.error = true
              //this.updModal();
              
            }
       
       
      } catch (err) {
        this.error =true
        //this.updModal();
        console.log(err);
        this.mensaje = err;
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
  

    async modalcodigos(){
      this.loading_mail_enviado=true
       const result = await this.$store.dispatch("generate_backup_codes" );
       console.log('resp 2',result )
       this.mail_enviado=true
       this.loading_mail_enviado=false
    }
  
  

  
  },
  watch: {
    
  },

}
</script>
