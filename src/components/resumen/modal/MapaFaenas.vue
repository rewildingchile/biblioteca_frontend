<template>
  <div style="margin:0;padding: 0;">
 
    <!---<iframe style="width: 100%;" width="100%" height="532" frameborder="0" :src="mapUrl" scrolling="no">
    </iframe>
  -->
 
  <iframe style="width: 100%;border:0;margin:0;padding: 0;"   width="100%" height="532" 
  loading="lazy"
  allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"
  :src="mapUrl" scrolling="no" >
  </iframe>
  


  </div>
</template>
<script>
import i18n from '@/i18n';
export default {
  props: ["propLatitud", "propLongitud"],
  data() {
    return {
      latitud: this.propLatitud,
      longitud: this.propLongitud,
    };

  },

  computed: {
    mapUrl() {
    //return `https://www.bing.com/maps/embed?h=532&w=988&cp=${this.latitud}~${this.longitud}&lvl=11&typ=d&sty=r&src=SHELL&FORM=MBEDV8`;
     
      return `   https://www.google.com/maps?q=${this.latitud},${this.longitud}&t=k&z=15&output=embed&hl=`+ i18n.global.locale.value; 

    }
  }
}
</script>