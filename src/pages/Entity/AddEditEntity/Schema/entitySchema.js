import * as yup from "yup";

export const entityInfoSchema = yup.object().shape({
  country: yup.object().shape({
    id: yup.string().required("Country is required"),
  }),
  entity: yup.object().shape({
    name: yup.string().required("Entity name is required"),
  }),
  entityType: yup.string().required("Entity Type is required"),
});

export const kycInfoSchema = yup.object().shape({
  kycCategoryId: yup.string().required("KYC Category Type is required"),
  documents: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Document name is required"),
      isMandatory: yup.boolean(),

      inputs: yup.array().of(
        yup.object().shape({
          type: yup.string().required(),
          label: yup.string().required(),
        }),
      ),

      verification: yup.object().shape({
        method: yup.string().required("Verification method is required"),
        api: yup.string().nullable(),
      }),
    }),
  ),
});
