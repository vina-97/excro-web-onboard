import * as yup from "yup";

const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;
const CIN_REGEX = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
const PAN_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;

export const businessSchema = yup.object({
  idValue: yup
    .string()
    .required("This field is mandatory. Please enter GSTIN, CIN, or PAN")
    .transform((v) => (v ? v.toUpperCase().trim() : v))
    .test("valid-id-format", function (value) {
      if (!value) {
        return this.createError({
          message: "Please enter GSTIN, CIN, or PAN number",
        });
      }

      const isValidGSTIN = GSTIN_REGEX.test(value);
      const isValidCIN = CIN_REGEX.test(value);
      const isValidPAN = PAN_REGEX.test(value);

      if (isValidGSTIN || isValidCIN || isValidPAN) {
        return true;
      }

      return this.createError({
        message:
          "Invalid business identifier format. Please enter a valid GSTIN (15 chars), CIN (21 chars), or PAN (10 chars)",
      });
    }),
});
