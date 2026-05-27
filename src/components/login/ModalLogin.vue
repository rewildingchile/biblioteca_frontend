<template>

    <div style="z-index: 1000;" v-if="show" class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div @click.self="close_modal()" class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

           
            <div class="modal-content py-4 text-left px-6">

                

                <form class="mt-6"  @submit.prevent="handleSubmit">
                <!-- <p>Canfirm the deletion of this item</p> -->
                   
                    
 
                    
                    <!--gender-->
                    <div class="mt-4 text-center">
                       
                        <div class="flex items-center justify-center text-center  text-red-500">
                         {{ error }}
                        </div>

                         
                    </div>
                    <!--end gender-->

                    <div class="mt-6">
                        <button type="submit"  @click="close_modal()" class="flex items-center justify-center w-full px-6 py-2 text-sm font-medium text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                        {{ $t('cerrar')}} </button>
                    </div>


                </form>
            
            </div>
        </div>
    </div>
    
</template>

<script>
    export default {
        name: "ModalLogin",

        props: {
            show: Boolean,
            error: String
        },
        data() {
            return{
                 firstname: "",
                 lastname: "",
                 gender: "",
                 residence: "",
               

            }
        },

        methods:{
            close_modal() {
                console.log('hola');
                this.$emit("close")
            }

        }
    }
</script>