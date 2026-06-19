<template>
 
 
  <div class="ml-12   finance-panel relative overflow-hidden">

    <!-- GLOWS -->
    <div class="finance-glow finance-glow-cyan"></div>
    <div class="finance-glow finance-glow-pink"></div>

    <!-- HEADER -->
    <div class="relative z-10
             flex items-center justify-between
             border-b border-white/10
             px-3 py-3">

      <!-- LEFT -->
      <div class="flex items-center gap-4">

        <!-- ICON -->
        <div class="w-14 h-14 rounded-2xl
                 bg-cyan-500/10
                 border border-cyan-400/20
                 flex items-center justify-center
                 shadow-[0_0_25px_rgba(34,211,238,.18)]">

          <!-- FINANCE ICON -->
          <svg class="w-7 h-7 text-cyan-300" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" d="M3 17l6-6 4 4 7-7" />

            <path stroke-linecap="round" stroke-linejoin="round" d="M14 8h6v6" />

          </svg>

        </div>

        <!-- TITLE -->
        <div>

          <h1 class="text-2xl
                   font-semibold
                   tracking-wide
                   text-white">
            Área Finanzas
          </h1>

          <p class="text-sm
                   text-slate-400
                   mt-1">
            Google Drive · Unidad compartida
          </p>

        </div>

      </div>

      <!-- STATUS -->
      <div class="hidden lg:flex items-center gap-3
               px-4 py-2 rounded-xl
               border border-emerald-400/20
               bg-emerald-500/10">
        
         <div class="flex items-center gap-2">
 
 
      
        </div>

        <div class="w-2 h-2 rounded-full
                 bg-emerald-400
                 animate-pulse"></div>



        <span class="text-xs uppercase tracking-[0.2em]
                 text-emerald-300 font-mono">
          Online
        </span>

      </div>

    </div>

    <!-- BODY -->
  <div class="relative z-10 p-1">
  <div class="rounded-1xl  border border-white/10    bg-white/[0.03]   backdrop-blur-xl  p-0 shadow-[0_0_40px_rgba(0,0,0,.25)]">

<div class="overflow-auto   rounded-1xl  border border-white/5   bg-slate-950/40   p-4">

      <div class="text-white">Sync Full</div>
      <div class="flex items-center gap-12 mt-10">
        <button @click="full(1)" class="tech-button">Finanzas</button>
        <button @click="full(2)" class="tech-button">Estrategia</button>
        <button @click="full(3)" class="tech-button">Fundraising</button>
      </div>
      <div class="text-white mt-20">Sync Changes</div>
      <div class="flex items-center gap-12 mt-10">
        <button @click="changes(1)" class="tech-button">Finanzas</button>
        <button @click="changes(2)" class="tech-button">Estrategia</button>
        <button @click="changes(3)" class="tech-button">Fundraising</button>
      </div>
</div>
  </div>
  </div>
  </div>



 
</template>
<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
<script>
import api from "@/api/axios";
export default {
    
  data(){

  },
  methods: {
    inicializar(){
        return true;
    },
    async full(area) {
        const response = await api.get(`api/v1/drive/syncfull/${area}/`);
        console.log(response);
    },
    async changes(area) {
        const response = await api.get(`api/v1/drive/syncchanges/${area}/` );
        console.log(response);
    }
  },    
  mounted() {
    this.inicializar() 
  },
}   
</script>