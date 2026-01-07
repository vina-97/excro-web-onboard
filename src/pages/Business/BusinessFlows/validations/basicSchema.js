import * as yup from "yup";

// const PHONE_REGEX = /^[0-9]{10,15}$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,100}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const NUMBER_2 = 2;
const NUMBER_100 = 100;

export const basicSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Full name is mandatory")
    .min(NUMBER_2, "Name must be at least 2 characters")
    .max(NUMBER_100, "Name must not exceed 100 characters")
    .matches(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    )
    .typeError("Name must be a valid string"),

  email: yup
    .string()
    .trim()
    .required("Email address is mandatory")
    .matches(EMAIL_REGEX, "Please enter a valid email address")
    .email("Email format is invalid")
    .max(NUMBER_100, "Email must not exceed 100 characters")
    .typeError("Email must be a valid string"),

  phone: yup.object().shape({
    countryCode: yup
      .string()
      .required("Country code is mandatory")
      .matches(/^\+?[0-9]{1,3}$/, "Country code must be valid (e.g., +91)")
      .typeError("Country code must be valid"),

    number: yup
      .string()
      .required("Phone number is mandatory")
      .matches(PHONE_REGEX, "Phone number must be 10 digits")
      .typeError("Phone number must contain only digits"),
  }),
});
