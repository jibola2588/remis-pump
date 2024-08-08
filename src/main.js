import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import VueSpinners from "vue-spinners";
// import VOtpInput from "vue3-otp-input";

//ANTD
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

//Primevue
import Primevue from "primevue/config";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import InputText from 'primevue/inputtext';
import InputOtp from 'primevue/inputotp';


//Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
  timeout: 2000,
};
import { useToast } from "vue-toastification";

const app = createApp(App);
app.config.globalProperties.$toast = useToast();

app
.use(Primevue)
.use(VueSpinners)
.use(router)
.use(Toast, options)
.use(Antd)
.component("InputGroup", InputGroup)
.component("InputGroupAddon", InputGroupAddon)
.component("InputNumber", InputNumber)
.component("Input", InputNumber)
.component("InputOtp", InputOtp)
.component("InputText", InputText)
.mount('#app')

export const { toast } = useToast();
