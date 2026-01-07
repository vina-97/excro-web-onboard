import * as yup from "yup";
const NUMBER_2 = 2;

export const riskSchema = yup.object().shape({
  negativeData: yup.object({
    isEnabled: yup.boolean(),
  }),
  aml: yup.object({
    isEnabled: yup.boolean(),
  }),
  webCrawling: yup.object({
    isEnabled: yup.boolean(),
    website: yup.string().when("isEnabled", {
      is: true,
      then: (schema) =>
        schema
          .required("Website URL is required")
          .matches(/^https?:\/\/.+\..+$/, "Enter a valid website URL"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  fieldVerification: yup.object({
    isEnabled: yup.boolean(),
    reason: yup.string().when("isEnabled", {
      is: true,
      then: (schema) =>
        schema
          .required("Reason is mandatory")
          .trim()
          .min(NUMBER_2, "Enter valid reason"),
      otherwise: (schema) => schema.notRequired(),
    }),
    file: yup.string().when("isEnabled", {
      is: true,
      then: (schema) => schema.required("File upload is mandatory"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
});
