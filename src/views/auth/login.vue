<template>
    <section class="max-w-[600px] mx-auto pt-12 md:pt-28 px-4 h-screen">
        <div
          class="border shadow rounded-xl"
        >
          <div class="py-2">
            <div class="text-center mt-6">
                <h2 class="text-lg">Welcome back</h2>
                <p class="mt-2 text-sm">Log in to continue your journey</p>
            </div>
            <form class="w-[80%] mx-auto my-8">
              <div class="text-sm">
                <label class="block mb-2" for="">Email</label>
                <input
                  class="block w-full py-3 pl-3 border rounded bg-none border-slate-400 outline-2 outline-slate-400"
                  type="email"
                  placeholder="Enter your email address"
                  v-model="email"
                  @input="checkInput"
                />
              </div>
  
              <div class=" mt-6">
                <label class="block mb-2" for="">Password</label>
                <div class="flex items-center gap-1 justify-between border border-slate-400 rounded-md outline-2 outline-slate-400 py-3 px-3">
                <input
                  class="bg-transparent outline-none text-sm w-[90%] sm:w-full"
                  type="password"
                  ref="pass"
                  placeholder="Enter your password"
                  v-model="password"
                  @input="checkInput"
                />
                <img
                  class="cursor-pointer"
                  alt="eye logo"
                  :src="[
                    showEye
                      ? require('../../assets/svg/Eye-closed.svg')
                      : require('../../assets/svg/eye.svg'),
                  ]"
                  @click="toggleEyeIcon"
                />
            </div>
              </div>
  
              <div class="flex justify-center my-6 text-sm">
                <button
                  :disabled="disabledLogin"
                  :class="disabledLogin ? 'disabled' : null"
                  @click="Login"
                  id="login-btn"
                  class="w-full py-3 text-center text-white bg-[#001755] rounded-full"
                >
                  <clip-loader
                    color="white"
                    size="15px"
                    v-if="showLoader"
                  ></clip-loader>
                  <span v-else>Login</span>
                </button>
              </div>
            </form>
            <!-- <p class="my-3 text-sm text-center">
              Forgot password? Reset it
              <router-link
                :to="{
                  name: 'Forgot Password',
                }"
              >
                <span class="font-bold text-green-600 cursor-pointer">here</span>
              </router-link>
            </p> -->
          </div>
        </div>
    </section>
  </template>
  
  <script>
  import { useToast } from "vue-toastification";
  import ClipLoader from "vue-spinner/src/ClipLoader.vue";
  import emailValidation from "@/utils/emailValidation.js";
  
  export default {
    title: "Sign In",
    name: "login",
  
    components: {
      ClipLoader,
    },
  
    data() {
      return {
        toast: useToast(),
        email: "",
        password: "",
        showLoader: false,
        disabledLogin: false,
        emailFormatGood: true,
        showEye: false,
        emailValidation: emailValidation,
      };
    },
    mounted() {
      this.checkInput();
    },
    methods: {
      checkInput() {
        if (this.email == "" || this.password == "") {
          this.disabledLogin = true;
        } else {
          this.disabledLogin = false;
        }
      },
  
      toggleEyeIcon() {
        this.showEye = !this.showEye;
        this.$refs.pass.type === "text"
          ? (this.$refs.pass.type = "password")
          : (this.$refs.pass.type = "text");
      },
  
      async Login(e) {
        e.preventDefault();
  
        emailValidation.checkEmail(this.email);
        this.emailFormatGood = emailValidation.emailFormatGood;
        if (!this.emailFormatGood){ 
          this.toast.warning("Wrong email format", {
              timeout: 2000,
            });
            return;
        };
  
        this.emailFormatGood = true;

        localStorage.setItem('userEmail',JSON.stringify(this.email))
  
        this.showLoader = true;
        this.disabledLogin = true;
        this.toast.success("Successfully logged in", {
              timeout: 1000,
            });
        
        setTimeout(() => { 
          this.showLoader = false;
          this.disabledLogin = false;
          this.email = ''
          this.$router.push('/category')
        },500)
     
        // try {
        //   const result = await authService.onLogin(data);
        //   // console.log('result foe login is here',result)
  
        //   if (result) {
        //     this.$store.commit("setUserInfo", result);
          
        //     var decoded = jwt_decode(result.token);
            
        //     const exp = decoded.exp * 1000;
        //     localStorage.setItem("jwtExpiry", exp);
        //     this.showLoader = false;
          
        //     localStorage.setItem("user-token", JSON.stringify(result?.token));
        //     localStorage.setItem("user-details", JSON.stringify(result));
        //     this.toast.success("Successfully logged in", {
        //       timeout: 2000,
        //     });
        
        //     const itemToCheck = "Security Team";
        //     // const watcher = 'Watch tower'
           
  
        //     if (result.forcePasswordChange) {
        //       console.log('here1')
        //       this.$router.push({
        //         name: "ChangePassword",
        //       });
        //     } else {
        //       console.log('here2')
        //       if (result.roles.includes(itemToCheck)){
        //         this.$router.push({
        //         name: "security",
        //       });
        //       }else{ 
        //         console.log('here')
        //         this.$router.push({
        //         name: "Dashboard",
        //       });
        //       }
        //     }
        //   }
        // } catch (err) {
        //   this.showLoader = false;
        //   this.disabledLogin = false;
        //   const message = err?.response?.data?.message;
        // }
      },
    },
  };
  </script>
  
  <style scoped>
  .disabled {
    cursor: not-allowed;
    background-color: rgba(0,23,85,0.6);
  }
  </style>
  