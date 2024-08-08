<template>
    <div class="backdrop">
      <div class="Wrapper">
         <section> 
            <div style="font-size: large; font-weight: medium">
                Please proceed to sign out.
            </div>
            <div class="flex justify-end mt-10 gap-4">
              <button @click="closeModal"  class="border border-slate-400 font-medium text-sm rounded px-3 py-2">
                Cancel
              </button>
              <button @click="signOut"  class="bg-red-900 text-white font-medium text-sm rounded px-3 py-2">
                  <clip-loader
                  color="white"
                  size="15px"
                  v-if="loading"
                  ></clip-loader>
                  <span v-else>Proceed</span>
              </button>
            </div>
         </section>
        
      </div>
    </div>
  </template>
  
  <script>
 import { useToast } from "vue-toastification";
 import ClipLoader from "vue-spinner/src/ClipLoader.vue";

  export default {
    components: {
    ClipLoader,
  },
  data(){ 
    return{ 
     loading:false,
     toast: useToast(),
    }
  },
   methods:{ 
    closeModal(){ 
        this.$emit('close')
    },
    signOut(){
        this.loading=true;
        localStorage.clear();
       setTimeout(() => { 
        this.loading=false;
        this.toast.success("Successfully logout", {
            timeout: 500,
          });
        this.$router.push('/')
       },1000)
    }
   }
  };
  </script>
  
  <style scoped>
  .backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    /* display: flex;
      align-items: center;
      justify-content: center; */
  }
  .Wrapper {
    background: white;
    z-index: 10;
    border-radius: 10px;
    max-width: 500px;
    margin: 0 auto;
    height: fit-context;
    margin-top: 2rem;
    padding: 2rem 2rem 2rem 2rem;
  }
  @media ((min-width:410px) and (max-width:550px)){
     .Wrapper{
      margin-top: 2rem;
      width: 400px;
     }
    } 
  @media ((min-width:350px) and (max-width:410px)){
     .Wrapper{
      margin-top: 2rem;
      width: 340px;
     }
    } 
  @media (max-width:350px){
     .Wrapper{
      margin-top: 2rem;
      width: 320px;
     }
    } 
  @media (max-width:330px){
     .Wrapper{
      margin-top: 2rem;
      width: 300px;
     }
    } 
  select::placeholder {
    color: grey;
  }
  .btnInactive{
      opacity:0.5;
      cursor: not-allowed;
    }
    .btnActive{ 
      opacity:1;
      cursor: cursor;
    }
    .cancelBtn{ 
      background: grey;
      border:none;
      outline:none;
      width:40%;
      color:black;
    }
  </style>
  