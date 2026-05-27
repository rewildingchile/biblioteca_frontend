<template>
    <div class="card">
    
      <div class="btns grid grid-cols-1 sm:grid-cols-1 gap-4">
        <img src="/images/nitroplus.png" class="img_top">
      </div>    
   
    <div class="btns grid grid-cols-2 sm:grid-cols-2 gap-4">  
                                            <div class=" text-white  p-2 w-full">Renders
                                            </div>
                                            <div class=" text-white   p-2 w-full">Vistas
                                            </div>
                                        </div>
                                     
</div>
</template>

<script>
 export default{

 }
</script>

<style scoped>
.card {
  width: 100%;
  height: px;
  background: #07182E;
  position: relative;
  display: flex;
  place-content: center;
  place-items: center;
  overflow: hidden;
  border-radius: 20px;
}
.card .img_top{
    z-index:100;
    padding:6px;
    width:400px;
    border-radius: 20px;
}
.card .btns{
    z-index:100;
    float:left;
    width:100%;
}

.card h2 {
  z-index: 1;
  color: white;
  font-size: 2em;
}

.card::before {
  content: '';
  position: absolute;
  width: 400px;
  background-image: linear-gradient(180deg, rgb(0, 183, 255), #c200c2);
  height: 180%;
  animation: rotBGimg 42s linear infinite;
  transition: all 0.2s linear;
}

@keyframes rotBGimg {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.card::after {
  content: '';
  position: absolute;
  background: #07182E;
  ;
  inset: 5px;
  border-radius: 15px;
}  
  .card:hover:before {
  background-image: linear-gradient(180deg, rgb(227, 247, 6), rgb(167, 255, 5));
  animation: rotBGimg 8.5s linear infinite;
} 


</style>