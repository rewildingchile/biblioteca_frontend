<template>
<div class="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white p-8">
 <div class="ml-12 relative overflow-hidden">
 
  <div class="w-full max-w-5xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-100 rounded-3xl overflow-hidden">
  USER REQUEST
  </div>
</div>
</div>
</template>
<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
<script>
 
 
export default {
    components:{
             
    },
    data(){
    return{
            search:'',
            results:[],
            search_terms:[]
    }
},
    methods: {
        inicializar() {
            return true;
        },
       
        
        
    },
    mounted() {
        this.inicializar()
    },
}   
</script>