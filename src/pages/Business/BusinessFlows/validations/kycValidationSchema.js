import * as yup from "yup";

export const kycValidationSchema = yup.object().shape({
  kycData: yup
    .array()
    .of(
      yup.object().shape({
        kycCategoryId: yup.string().required(),
        mandatory: yup.number().required().min(1),
        kycCategory: yup.object().shape({
          name: yup.string().required(),
        }),
        documents: yup
          .array()
          .of(
            yup.object().shape({
              documentId: yup.string(),
              isMandatory: yup.boolean(),
              uploadKey: yup.string(),
              name: yup.string(),
            }),
          )
          .required()
          .test({
            name: "mandatoryDocumentsCheck", // ✅ simpler name (not shown to user)
            message: "Please upload mandatory documents", // ✅ only this shows
            test(documents) {
              const { mandatory } = this.parent;

              if (!mandatory || mandatory === 0) {
                return true;
              }

              // Count only documents that have BOTH documentId AND uploadKey
              const validUploadedDocuments = (documents || []).filter(
                (doc) => doc?.documentId?.trim() && doc?.uploadKey?.trim(),
              );

              // If fewer than required → invalid
              return validUploadedDocuments.length >= mandatory;
            },
          }),
      }),
    )
    .required(),
});
