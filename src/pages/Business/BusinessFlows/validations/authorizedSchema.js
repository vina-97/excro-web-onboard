import * as yup from "yup";

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const NUMBER_2 = 2;
const NUMBER_10 = 10;
const NUMBER_100 = 100;
const authorizedRecordSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(NUMBER_2, "Name must be at least 2 characters")
    .max(NUMBER_100, "Name must not exceed 100 characters")
    .matches(
      /^[a-zA-Z\s.'-]+$/,
      "Name can only contain letters, spaces, and basic punctuation",
    ),

  pan: yup
    .string()
    .required("PAN is required")
    .length(NUMBER_10, "PAN must be exactly 10 characters")
    .matches(panRegex, "Invalid PAN format (e.g., AABPK1234L)"),
});

export const authorizedSchema = yup.object({
  authorizedRecords: yup
    .array()
    .of(authorizedRecordSchema)
    .min(1, "At least one authorized record is required")
    .max(NUMBER_10, "Maximum 10 authorized records allowed")
    .test("unique-pan", "PAN numbers must be unique", function (records) {
      if (!records) {
        return true;
      }

      const panSet = new Set();
      for (const record of records) {
        if (record.pan) {
          if (panSet.has(record.pan)) {
            return this.createError({
              path: `${this.path}.pan`,
              message: "PAN number must be unique across all records",
            });
          }
          panSet.add(record.pan);
        }
      }
      return true;
    }),
});

// PAN validation helper
export const validatePAN = (pan) => {
  return panRegex.test(pan);
};

// Mock API payload structure
export const createAuthorizedPayload = (authorizedRecords) => {
  return authorizedRecords.map((record) => ({
    name: record.name,
    pan: record.pan,
  }));
};
