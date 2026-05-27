<template>
<div>Sync Full</div>
 
<div class="flex items-center gap-12 mt-10">
<button @click="full"   class="tech-button">Finanzas</button>
<button @click="full"   class="tech-button">Estrategia</button>
<button @click="full"   class="tech-button">Fundraising</button>
</div>
<div class="mt-20">Sync Changes</div>
<div class="flex items-center gap-12 mt-10">
<button @click="changes"   class="tech-button">Finanzas</button>
<button @click="changes"   class="tech-button">Estrategia</button>
<button @click="changes"   class="tech-button">Fundraising</button>
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
    async full() {
        const response = await api.get("api/v1/drive/syncfull/" );
        console.log(response);
    },
    async changes() {
        const response = await api.get("api/v1/drive/syncchanges/" );
        console.log(response);
    }
  },    
  mounted() {
    this.inicializar() 
  },
}   
</script>