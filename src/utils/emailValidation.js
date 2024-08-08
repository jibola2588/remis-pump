import { useToast as toast } from "vue-toastification";

const emailValidation = {
  emailFormatGood: true,

  validEmail: (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})+$/.test(email)) {
      return true;
    }
    return false;
  },

  checkEmail: (email) => {

    if (!emailValidation.validEmail(email)) {
      toast().error("Invalid email format", {
        timeout: 3000,
      });

      emailValidation.emailFormatGood = false;
      return;
    }
    emailValidation.emailFormatGood = true;
  },
};

export default emailValidation;
