<template>


<div class="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-white p-8">
 <div class="ml-12 relative overflow-hidden">

  <!-- Caja búsqueda -->
  <div
    class="w-full max-w-5xl
    bg-gradient-to-br from-blue-50 via-white to-sky-50
    border border-blue-100
    
    rounded-3xl
    overflow-hidden"
  >

    <!-- Barra de búsqueda -->
    <div class="flex items-center gap-4 px-6 py-5">

      <!-- Icono -->
      <div
        class="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200"
      >
        <svg
          class="w-6 h-6 text-sky-600"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7"></circle>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20 20l-4.35-4.35"
          />
        </svg>
      </div>

      <!-- Input -->
      <input
        v-model="search"
        type="text"
        placeholder="Buscar documentos, carpetas o contenido..."
        class="flex-1
        bg-transparent
        text-lg
        text-slate-700
        placeholder-slate-400
        outline-none"
      />

      <!-- Botón -->
      <button
        @click="buscar"
        class="font-semibold
        px-6 py-3
        bg-sky-600
        hover:bg-sky-700
        text-white
        rounded-xl
        shadow-md
        hover:shadow-lg
        transition-all
        duration-200
        flex items-center gap-2"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7"></circle>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20 20l-4.35-4.35"
          />
        </svg>

        Buscar
      </button>
    </div>

    <!-- Línea divisoria -->
    <div
      v-if="results.length > 0"
      class="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"
    ></div>

    <!-- Información resultados -->
    <div
      v-if="results.length > 0"
      class="px-6 py-3 bg-sky-50 border-b border-blue-100"
    >
      <span class="text-sm font-medium text-sky-700">
        {{ results.length }}
        resultado{{ results.length !== 1 ? 's' : '' }} encontrado{{ results.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Resultados -->
    <div
      v-if="results.length > 0"
      class="p-6 bg-white/40"
    >
      <div class="space-y-5">
        <SearchResultCard
          v-for="result in results"
          :key="result.id"
          :document="result"
        />
      </div>
    </div>

    <!-- Sin resultados -->
    <div
      v-else-if="search && !loading"
      class="py-12 text-center"
    >
      <svg
        class="mx-auto h-12 w-12 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="7"></circle>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 20l-4.35-4.35"
        />
      </svg>

      <p class="mt-3 text-slate-500">
        No se encontraron documentos
      </p>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="py-12 flex flex-col items-center justify-center"
    >
      <div
        class="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"
      ></div>

      <p class="mt-4 text-sky-700 font-medium">
        Buscando documentos...
      </p>
    </div>

  </div>

</div>
</div>



</template>
<style scoped>
@import "@/assets/css/tech-theme.css";
</style>
<script>
import SearchResultCard from "./SearchResultCard.vue"
import api from "@/api/axios";
export default {
    components:{
            SearchResultCard
    },
    data(){
    return{
            search:'',
            results:[]
    }
},
    methods: {
        inicializar() {
            return true;
        },
       
        
        async buscar(){
                try {
                const data = { tokens:this.search };
                console.log('data',data)
                const resp = await api.post(
                `api/v1/search/`,
                data,
                { headers: { "Content-Type": "application/json"  } }
                );
                const status = resp.data.status;
                if (status==='success'){
                    this.results=resp?.data?.results || []
                }
                return true;
            } catch (err) {
                console.log(err);
            }
        }
    },
    mounted() {
        this.inicializar()
    },
}   
</script>