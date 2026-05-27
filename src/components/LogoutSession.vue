
<script>
 
import router from "../router";
 
 import i18n from '@/i18n';
export default {
  name: "LogoutSession",
  mounted(){
 
    this.$store.dispatch("notifications/clearMessages");
    this.$store.dispatch("clearUserLogin");
    this.$store.state.notifications.messages=[];
  
    window.localStorage.removeItem('user');
    const l = i18n.global.locale.value;
    const url= l ==='es' ?  "/" : "/en";
      router.push(url);
  }, 
};
</script>
