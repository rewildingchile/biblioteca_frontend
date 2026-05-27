import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../components/home/HomeView.vue'

 
 
import LoginRootCaptchaEsp from '../components/login/LoginRootCaptchaEsp.vue'
 

import HomeCliente from '../components/home/HomeCliente.vue'  
 
import LogoutSession from '../components/LogoutSession.vue'
 

import OtpSetupQr  from '../components/2fa/OtpSetupQr.vue';
import OtpSetupCode from '../components/2fa/OtpSetupCode.vue'; 
 
 
 
const routes = [
   {
      path: "/otpsetupqr",
      name: "OtpSetupQr",
      component: OtpSetupQr,
   },
   {
    path:"/otpsetupcode",
    name: "OtpSetupCode",
    component : OtpSetupCode
   },
   
 
   {
    path:'/',
    name:'LoginRootCaptchaEsp',
    component:LoginRootCaptchaEsp
  },
  
  
  {
    path: '/home',
    name: 'home',
    component: HomeCliente
  },

   
     
 
  {
    path: '/logout',
    name: 'accounts',
    component: LogoutSession
  },
 
 
   

]

const router = createRouter({
  history: createWebHistory(),
  routes
})
/* ==============================
   HISTORIAL MANUAL (BACK / FORWARD)
   ============================== */
 
export default router
