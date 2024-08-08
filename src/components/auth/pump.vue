<template>
  <section class="max-w-[400px] mx-auto px-4 border border-grey rounded mt-8">
    <form class="p-4" @submit="authorize">
      <div class="w-full flex flex-col">
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

      <div class="flex justify-center mt-8 mb-4 text-sm">
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
    </form>
  </section>
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
      disabledLogin: true,
      options: [
        {
          PumpCode: "0440002146",
          PumpName: "P40 (PMS)",
        },
        {
          PumpCode: "0440002137",
          PumpName: "P7 (PMS)",
        },
        {
          PumpCode: "0440002115",
          PumpName: "P8 (PMS)",
        },
      ],
      email: "",
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
  methods: {
    checkInput() {
      if (this.selectedPumpCode && this.amnt) {
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
    authorize(e) {
      e.preventDefault();

      const data = {
        pumpCode: this.selectedPumpCode,
        amount: this.amnt,
        transactionId: String(Math.floor(Math.random() * 4000000 + 9000000)),
        AuthorizationBy: this.email,
      };

    
      this.showLoader = true;

      const headers = {
        "pKey": "5E47BF24-C670-4FC9-861E-2CE287E5F48F",
        "x-auth-hash": "21E1E1E1790452A298419FA4ADB58A7474770E880FE4C1394581FD17935E000CBB98DBDF8264247B6BB3AEBB2AE7F76A8710CB3B2447FE430D54A98CDDFD2090"
      };
      // console.log("data --->", data,headers);
      axios
        .post(
          "https://remisfuelingservice.azurewebsites.net/AuthorizeSale",
          data,
          { headers }
        )
        .then((res) => {
          console.log("res is here", res);
          this.showLoader = false;
          this.toast.success("Successfully authorized", {
            timeout: 1000,
          });
          this.amnt = '';
          this.selectedPumpCode = "";
        })
        .catch((err) => {
          console.log("err is here", err);
          this.showLoader = false;
        });
    },
  },
};
</script>

<style scoped>
.custom-placeholder .ant-select-selection-placeholder {
  color: black;
}

.disabled {
  cursor: not-allowed;
  background-color: rgba(0, 23, 85, 0.6);
}
</style>
