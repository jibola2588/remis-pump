<template>
  <div class="my-4">
    <section class="max-w-[400px] mx-auto px-4 border border-grey rounded">
      <form class="p-4" @submit="authorize">
        <div class="w-full flex flex-col">
          <label class="mb-1 text-sm">Card number</label>
          <InputGroup
            class="border border-slate-400 outline-2 outline-slate-400 rounded px-3 py-2"
          >
            <InputText
              placeholder="input card number"
              class="text-sm"
              v-model="cardNum"
              @input="checkInput"
              @blur="handleBlur"
            />
          </InputGroup>
        </div>

        <div class="w-full flex flex-col mt-3">
          <label class="mb-1 text-sm">Card pin</label>
          <div class="flex items-center gap-3">
            <input
              v-for="(digit, index) in digits"
              :key="index"
              type="text"
              class="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 border border-slate-400 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              pattern="\d*"
              maxlength="1"
              v-model="digits[index]"
              @focus="handleFocus"
              @input="handleInput(index)"
              @keydown="handleKeyDown($event, index)"
              :ref="'digit' + index"
            />
          </div>
        </div>
        <div class="w-full flex flex-col mt-3">
          <label class="mb-1 text-sm">Serial number</label>

          <clip-loader color="black" size="15px" v-if="loadNum"></clip-loader>
          <InputGroup
            v-else
            class="border border-slate-400 outline-2 outline-slate-400 rounded px-3 py-2"
          >
            <InputText
              disabled
              placeholder=""
              class="text-sm cursor-not-allowed"
              v-model="serialNum"
            />
          </InputGroup>
        </div>
        <div class="w-full flex flex-col mt-3">
          <label class="mb-1 text-sm">Amount</label>
          <InputGroup
            class="border border-slate-400 outline-2 outline-slate-400 rounded"
          >
            <InputGroupAddon class="border-r border-slate-400 text-sm">
              {{ currency }}
            </InputGroupAddon>
            <InputNumber
              placeholder="input amount"
              class="text-sm pl-2"
              v-model="amnt"
              @input="checkInput"
            />
          </InputGroup>
        </div>
        <div class="w-full flex flex-col mt-4">
          <label class="mb-1 text-sm">Select pump</label>
          <a-select
            v-model:value="selectedPumpCode"
            show-search
            placeholder="Select pump"
            class="w-full custom-placeholder"
            :options="formattedOptions"
            :filter-option="filterOption"
            @change="checkInput"
          ></a-select>
        </div>

        <div class="flex justify-center mt-6 mb-4 text-sm" v-if="showTable == false">
          <button
            :disabled="disabledLogin"
            :class="disabledLogin ? 'disabled' : null"
            type="submit"
            id="login-btn"
            class="w-full py-3 text-center text-white bg-[#001755] rounded-full"
          >
            <clip-loader
              color="white"
              size="15px"
              v-if="showLoader"
            ></clip-loader>
            <span v-else>Authorize</span>
          </button>
        </div>
        <div class="w-full mt-4" @click="resetTransaction" v-else>
       <span class="h-10 px-4 flex items-center justify-center text-white bg-[#001755] rounded-full font-medium cursor-pointer">Re-try transaction</span>
        </div>
      </form>
    </section>
    <section class="py-8" v-if="showTable">
      <clip-loader color="black" size="15px" v-if="loadProbes"></clip-loader>
      <div v-else>
        <p class="mb-4">{{ probeMsg }}</p>
        <div
          class="overflow-x-auto rounded-lg border border-gray-200"
          v-if="probeData"
        >
          <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead class="ltr:text-left rtl:text-right">
              <tr>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
                >
                  Date Added
                </th>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
                >
                  Transaction Id
                </th>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
                >
                  Tag
                </th>
                <th
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left"
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, i) in probeData" :key="i">
                <td
                  class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {{ formattedDate(item.dateAdded) }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                  {{ item.ti }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                  {{ item.tag }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                  {{ item.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
   
  </div>
</template>

<script>
import ClipLoader from "vue-spinner/src/ClipLoader.vue";
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  components: {
    ClipLoader,
  },
  data() {
    return {
      toast: useToast(),
      currency: "NGN",
      amnt: 0,
      selectedPumpCode: "select pump",
      showLoader: false,
      loadNum: false,
      disabledLogin: true,
      options: [
        {
          PumpCode: "0440002146",
          PumpName: "P40 (PMS)",
          companyId: "9e5f6ff4-81de-43cc-aa44-93798080875e",
          deviceId: "866506056429961",
          branchId: "06f30bac-d8e7-4420-b374-b679c70fcf78",
          product: "PMS",
        },
        {
          PumpCode: "0440002137",
          PumpName: "P7 (PMS)",
          companyId: "9e5f6ff4-81de-43cc-aa44-93798080875e",
          deviceId: "866506056628364",
          branchId: "06f30bac-d8e7-4420-b374-b679c70fcf78",
          product: "PMS",
        },
        {
          PumpCode: "0440002115",
          PumpName: "P8 (PMS)",
          companyId: "9e5f6ff4-81de-43cc-aa44-93798080875e",
          deviceId: "866506056628364",
          branchId: "06f30bac-d8e7-4420-b374-b679c70fcf78",
          product: "PMS",
        },
      ],
      email: "",
      value: "",
      cardNum: "",
      code: "",
      digits: ["", "", "", ""],
      pumpObj: {},
      transId: "",
      serialNum: "",
      loadProbes: false,
      probeData: null,
      probeMsg: "",
      showTable:false,
      alphabet:''
    };
  },
  mounted() {
    const data = JSON.parse(localStorage.getItem("userEmail"));
    this.email = data;
  },
  computed: {
    formattedOptions() {
      return this.options.map((pump) => ({
        value: pump.PumpCode,
        label: pump.PumpName,
      }));
    },
  },
  watch: {
    selectedPumpCode: "searchPump",
  },
  methods: {
    formattedDate(date) {
      return new Date(date).toLocaleString();
    },
    searchPump() {
      this.pumpObj = this.options.find(
        (item) => item.PumpCode === this.selectedPumpCode
      );
    },
    checkInput() {
      if (this.selectedPumpCode && this.amnt && this.cardNum && this.digits) {
        this.disabledLogin = false;
      } else {
        this.disabledLogin = true;
      }
    },
    filterOption(input, option) {
      return (
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.value.indexOf(input) >= 0
      );
    },
    handleBlur() {
      
      if (this.cardNum == "") return;

      const headers = {
        pKey: "5E47BF24-C670-4FC9-861E-2CE287E5F48F",
        "x-auth-hash":
          "21E1E1E1790452A298419FA4ADB58A7474770E880FE4C1394581FD17935E000CBB98DBDF8264247B6BB3AEBB2AE7F76A8710CB3B2447FE430D54A98CDDFD2090",
      };
      this.loadNum = true;
      axios
        .get(
          `https://remisfuelingservice.azurewebsites.net/Card/Find/${this.cardNum}`,
          { headers }
        )
        .then((res) => {
          // console.log("res is here", res);
          this.loadNum = false;
          this.toast.success(res?.data?.message, {
            timeout: 1500,
          });
          this.serialNum = res.data.card.serialNumber;
        })
        .catch((err) => {
          this.loadNum = false;
          if ((err.message = "Network Error")) {
            this.toast.error(err.message, {
              timeout: 2000,
            });
          }
          // console.log("err is here", err);
        });
    },
    handleFocus(e) {
      e.target.select();
    },
    handleInput(index) {
      if (this.digits[index]) {
        if (index < this.digits.length - 1) {
          this.$refs["digit" + (index + 1)][0].focus();
        }
      }
      this.checkInput();
    },
    handleKeyDown(e, index) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (this.digits[index]) {
          this.digits[index] = "";
        } else if (index > 0) {
          this.$refs["digit" + (index - 1)][0].focus();
        }
      }
    },
    authorize(e) {
      e.preventDefault();

      const otp = Object.values(this.digits).join("");
      this.transId = String(Math.floor(Math.random() * 4000000 + 9000000));
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}000`;

      if (otp.length != 4) {
        this.toast.warning("The OTP code must be exactly 4 characters long.", {
          timeout: 2000,
        });
        return;
      }

      if (!this.serialNum) {
        this.toast.warning("card serial number is missing", {
          timeout: 2000,
        });
        return;
      }

      const data = {
        amount: this.amnt,
        transactionId: this.transId,
        AuthorizationBy: this.email,
        companyId: this.pumpObj.companyId,
        deviceId: this.pumpObj.deviceId,
        branchId: this.pumpObj.branchId,
        pumpName: this.pumpObj.PumpName,
        tag: `${this.serialNum}|${otp}|${this.transId}`,
        date: formattedDate,
        product: this.pumpObj.product,
        pumpStatus: "offline",
      };

      this.showLoader = true;

      const headers = {
        pKey: "5E47BF24-C670-4FC9-861E-2CE287E5F48F",
        "x-auth-hash":
          "21E1E1E1790452A298419FA4ADB58A7474770E880FE4C1394581FD17935E000CBB98DBDF8264247B6BB3AEBB2AE7F76A8710CB3B2447FE430D54A98CDDFD2090",
      };

      axios
        .post(
          "https://remisfuelingservice.azurewebsites.net/Card/Pos/AuthorizeCard",
          data,
          { headers }
        )
        .then(() => {
          this.disabledLogin = true;
          this.showLoader = false;
          this.toast.success("Successfully authorized", {
            timeout: 1000,
          });
           this.showTable = true;
           
           const characters = "abcdefghijklmnopqrstuvwxyz";
          const randomIndex = Math.floor(Math.random() * characters.length);
          this.alphabet = characters[randomIndex];

          let callCount = 0;
          const maxCalls = 3;
          const intervalTime = 10000;

          this.getPumpProbes();
          callCount++;

          const getProbe = setInterval(() => {
            if (callCount < maxCalls) {
              this.getPumpProbes();
              callCount++;
            } else {
              clearInterval(getProbe);
            }
          }, intervalTime);
        })

        .catch(() => {
          this.showLoader = false;
        });
    },
    getPumpProbes() {
      const headers = {
        pKey: "5E47BF24-C670-4FC9-861E-2CE287E5F48F",
        "x-auth-hash":
          "21E1E1E1790452A298419FA4ADB58A7474770E880FE4C1394581FD17935E000CBB98DBDF8264247B6BB3AEBB2AE7F76A8710CB3B2447FE430D54A98CDDFD2090",
      };
      this.loadProbes = true;
      axios
        .get(
          `https://remisfuelingservice.azurewebsites.net/Probe/POS/PumpStatus/${this.transId}?deviceId=${this.alphabet}`,
          { headers }
        )
        .then((res) => {
          this.loadProbes = false;
          this.probeMsg = res?.data?.message;
          this.probeData = res?.data?.allStatuses;
        })
        .catch(() => {
          this.loadProbes = false;
        });
    },
    resetTransaction(){ 
      this.amnt = "";
      this.serialNum = "";
      this.cardNum = "";
      this.digits = ["", "", "", ""];
      this.tag = "";
      this.selectedPumpCode = "";
      this.showTable = false;
      this.disabledLogin = false;
    }
  },
};
</script>

<style scoped>
.disabled {
  cursor: not-allowed;
  background-color: rgba(0, 23, 85, 0.6);
}
</style>
