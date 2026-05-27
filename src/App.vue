<template>
  <NotificationContainer/>
  <router-view />
</template>
 <script>
 import NotificationContainer from "@/components/NotificationContainer.vue";

 export default {
  
     created(){
  
      this.$store.dispatch('user',JSON.parse(localStorage.getItem('user')) );
     } ,
     mounted(){
      
     

     },
     components:{
      NotificationContainer
     }
 
 }
 </script>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  nav {
    padding: 30px;
  }

  nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  nav a.router-link-exact-active {
    color: #42b983;
  }
  .month-picker-input{
    width:148px!important;
  
  }
  .month-picker__container {
    width:300px!important;
  }

</style>
