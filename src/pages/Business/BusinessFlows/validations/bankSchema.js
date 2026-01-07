import * as yup from "yup";

const NUMBER_2 = 2;
// const NUMBER_3 = 3;
// const NUMBER_4 = 4;
const NUMBER_9 = 9;
const NUMBER_18 = 18;
const NUMBER_11 = 11;
const NUMBER_100 = 100;
// const NUMBER_1024 = 1024;

export const bankSchema = yup.object({
  accountHolderName: yup
    .string()
    .required("Account holder name is mandatory")
    .min(NUMBER_2, "Account holder name must be at least 2 characters")
    .max(NUMBER_100, "Account holder name must not exceed 100 characters")
    .matches(
      /^[a-zA-Z\s.'-]+$/,
      "Account holder name can only contain letters, spaces, and basic punctuation",
    ),

  accountNumber: yup
    .string()
    .required("Account number is mandatory")
    .matches(/^\d+$/, "Account number must contain only digits")
    .min(NUMBER_9, "Account number must be at least 9 digits")
    .max(NUMBER_18, "Account number must not exceed 18 digits"),

  ifscCode: yup
    .string()
    .required("IFSC code is mandatory")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .length(NUMBER_11, "IFSC code must be exactly 11 characters"),
});

// Validation helpers
export const validateIFSC = (ifscCode) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
};

export const validateAccountNumber = (accountNumber) => {
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(accountNumber);
};
