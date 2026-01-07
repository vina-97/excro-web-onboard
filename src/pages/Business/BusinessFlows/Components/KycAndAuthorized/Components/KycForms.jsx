import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { Upload, Select, Tooltip, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import useOnboardingStore from "../../../../../../store/useOnboardingStore";
import { useParams } from "react-router-dom";
import ImageLoader from "../../../../../../components/UI/ImageLoader";
import { extractLastPart, showFailure } from "../../../../../../utils";
import useMasterStore from "../../../../../../store/useMasterStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { kycValidationSchema } from "../../../validations/kycValidationSchema";

const { Dragger } = Upload;
const NUMBER_MINUS1 = -1;
const NUMBER_2 = 2;
const NUMBER_1024 = 1024;
const NUMBER_100 = 100;

const KycForms = forwardRef(({ data, onSubmit }, ref) => {
  console.log(data);

  const { kycData, uploadFile } = useOnboardingStore();
  const { fetchSignedUrl } = useMasterStore();
  const [signedUrls, setSignedUrls] = useState({});
  const { businessID } = useParams();

  const transformDocumentProofs = (documentProofs = []) => {
    if (!Array.isArray(documentProofs)) {
      return [];
    }

    return documentProofs.map((category) => {
      const mandatoryDocs =
        category.documents?.filter((doc) => doc.isMandatory) || [];
      const optionalDocs =
        category.documents?.filter((doc) => !doc.isMandatory) || [];

      const fullArrayList = optionalDocs.map((opt) => ({
        id: opt.documentId,
        name: opt.name,
        verification: opt.verification || {},
      }));

      const finalDocuments = [...mandatoryDocs];
      if (fullArrayList.length > 0) {
        finalDocuments.push({
          documentId: "",
          name: "",
          isMandatory: false,
          documentStatus: "pending",
          uploadKey: "",
          verification: {},
          arrayList: fullArrayList,
          fullArrayList: fullArrayList,
        });
      }

      return {
        kycCategoryId: category.kycCategoryId,
        kycCategory: category.kycCategory,
        mandatory: category.mandatory,
        kycCategoryStatus: category.kycCategoryStatus,
        documents: finalDocuments,
      };
    });
  };

  const [mergedDocs, setMergedDocs] = useState(() =>
    transformDocumentProofs(kycData),
  );
  const schema = useMemo(() => kycValidationSchema, []);

  const { handleSubmit, setValue, trigger } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      kycData: mergedDocs,
    },
    mode: "onChange", // Enable validation mode
  });

  // Sync form values with mergedDocs state
  useEffect(() => {
    setValue("kycData", mergedDocs, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [mergedDocs, setValue]);

  const handleFileUpload = async (categoryId, documentId, file) => {
    console.log(file, "dd");

    try {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const fileExtension = file.name?.split(".").pop()?.toLowerCase();
      const isLt2M = file.size / NUMBER_1024 / NUMBER_1024 < NUMBER_2;

      const isValidType =
        allowedTypes.includes(file.type) ||
        ["jpg", "jpeg", "png", "pdf"].includes(fileExtension);

      if (!isValidType) {
        showFailure("You can only upload JPG, PNG, or PDF files!");
        return false;
      }

      if (!isLt2M) {
        showFailure("File must be smaller than 2MB!");
        return false;
      }

      const fileName = `${categoryId}_${documentId}_${file.name}`;

      const result = await uploadFile(file, businessID, "kyc", fileName);

      setMergedDocs((prev) =>
        prev.map((category) => {
          if (category.kycCategoryId !== categoryId) {
            return category;
          }

          const updatedDocuments = category.documents.map((doc) => {
            if (doc.documentId === documentId) {
              return {
                ...doc,
                uploadKey: result?.fileKey,
                documentStatus: "submitted",
              };
            }
            if (!doc.documentId && documentId.includes("opt-")) {
              const index = parseInt(documentId.split("opt-")[1]);
              if (category.documents.indexOf(doc) === index) {
                return {
                  ...doc,
                  uploadKey: result?.fileKey,
                  documentStatus: "submitted",
                };
              }
            }
            return doc;
          });

          return {
            ...category,
            documents: updatedDocuments,
          };
        }),
      );

      setTimeout(() => {
        trigger();
      }, NUMBER_100);

      console.log("File uploaded successfully:", result);
      return true;
    } catch (error) {
      console.error("File upload failed:", error);
      return false;
    }
  };

  const handleDeleteUploadKey = (categoryId, documentId) => {
    setMergedDocs((prev) =>
      prev.map((category) => {
        if (category.kycCategoryId !== categoryId) {
          return category;
        }

        const updatedDocuments = category.documents.map((doc) => {
          if (doc.documentId === documentId) {
            return {
              ...doc,
              uploadKey: "",
              documentStatus: "pending",
            };
          }
          if (!doc.documentId && documentId.includes("opt-")) {
            const index = parseInt(documentId.split("opt-")[1]);
            if (category.documents.indexOf(doc) === index) {
              return {
                ...doc,
                uploadKey: "",
                documentStatus: "pending",
              };
            }
          }
          return doc;
        });

        return {
          ...category,
          documents: updatedDocuments,
        };
      }),
    );

    setTimeout(() => {
      trigger();
    }, NUMBER_100);
  };

  const getDraggerProps = (categoryId, documentId) => ({
    name: "file",
    multiple: false,
    accept: ".jpg,.jpeg,.png,.pdf",
    beforeUpload: (file) => {
      console.log("File info:", {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: file.name?.split(".").pop()?.toLowerCase(),
      });

      handleFileUpload(categoryId, documentId, file);
      return false;
    },
    onRemove: () => {
      handleDeleteUploadKey(categoryId, documentId);
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
    showUploadList: false,
  });

  const handleGetUrl = async (getValue) => {
    const fileKey = getValue;
    const urlKey = extractLastPart(fileKey);
    if (fileKey && !signedUrls[urlKey]) {
      try {
        const url = await fetchSignedUrl(fileKey);
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          setSignedUrls((prev) => ({ ...prev, [urlKey]: url }));
        }
      } catch (error) {
        console.error("Error fetching URL:", error);
      }
    } else if (fileKey && signedUrls[urlKey]) {
      window.open(signedUrls[urlKey], "_blank", "noopener,noreferrer");
    }
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      console.log("Submitting KYC form...");

      try {
        await schema.validate({ kycData: mergedDocs }, { abortEarly: false });

        // If validation passes, transform and submit
        const transformKycPayloadWithFilter = (kycData) => {
          if (!kycData || !Array.isArray(kycData)) {
            return [];
          }

          return kycData
            .map((category) => {
              const documents = category.documents
                ? category.documents
                    .filter(
                      (doc) => doc.uploadKey && doc.uploadKey.trim() !== "",
                    )
                    .map((doc) => ({
                      documentId: doc.documentId,
                      uploadKey: doc.uploadKey,
                    }))
                : [];

              if (documents.length === 0) {
                return null;
              }

              return {
                kycCategoryId: category.kycCategoryId,
                documents,
              };
            })
            .filter(Boolean);
        };

        const transformedPayload = transformKycPayloadWithFilter(mergedDocs);
        console.log("✅ Transformed with Filter:", transformedPayload);

        onSubmit({ kyc: transformedPayload });
        return true;
      } catch (validationError) {
        console.log("Validation failed with errors:", validationError);

        // Parse yup validation errors
        if (validationError.inner) {
          const errorsByCategory = {};

          validationError.inner.forEach((error) => {
            // Extract category index from path like "kycData[0].documents"
            const match = error.path?.match(/kycData\[(\d+)\]/);
            if (match) {
              const categoryIndex = parseInt(match[1]);
              if (!errorsByCategory[categoryIndex]) {
                errorsByCategory[categoryIndex] = error.message;
              }
            }
          });

          // Show errors for each failing category
          mergedDocs.forEach((category, index) => {
            if (errorsByCategory[index]) {
              showFailure(`${errorsByCategory[index]}`);
            }
          });
        } else {
          showFailure(validationError.message || "Validation failed");
        }

        // Also trigger react-hook-form validation to update UI
        setValue("kycData", mergedDocs);
        await trigger();

        return false;
      }
    },
  }));

  const handleSelectChange = (categoryId, index, selectedName) => {
    setMergedDocs((prev) =>
      prev.map((category) => {
        if (category.kycCategoryId !== categoryId) {
          return category;
        }

        const newDocs = [...category.documents];
        const targetDoc = newDocs[index];

        if (!targetDoc || !targetDoc.arrayList) {
          return category;
        }

        const selectedItem = targetDoc.arrayList.find(
          (a) => a.name === selectedName,
        );
        if (!selectedItem) {
          return category;
        }

        const fullArrayList = targetDoc.fullArrayList || targetDoc.arrayList;

        const selectedDocument = {
          documentId: selectedItem.id,
          name: selectedItem.name,
          isMandatory: false,
          documentStatus: "pending",
          uploadKey: "",
          verification: selectedItem.verification,
        };

        newDocs[index] = selectedDocument;

        const selectedDocumentIds = newDocs
          .filter((doc) => doc.documentId && !doc.isMandatory)
          .map((doc) => doc.documentId);

        const remainingOptions = fullArrayList.filter(
          (item) => !selectedDocumentIds.includes(item.id),
        );

        const hasExistingDropdown = newDocs.some((doc) => doc.arrayList);
        if (!hasExistingDropdown && remainingOptions.length > 0) {
          newDocs.push({
            documentId: "",
            name: "",
            isMandatory: false,
            documentStatus: "pending",
            uploadKey: "",
            verification: {},
            arrayList: remainingOptions,
            fullArrayList: fullArrayList,
          });
        }

        return { ...category, documents: newDocs };
      }),
    );
  };

  const handleDeleteDocument = (categoryId, index) => {
    setMergedDocs((prev) =>
      prev.map((category) => {
        if (category.kycCategoryId !== categoryId) {
          return category;
        }

        const newDocs = [...category.documents];
        const deletedDoc = newDocs[index];

        newDocs.splice(index, 1);

        if (deletedDoc.documentId && !deletedDoc.isMandatory) {
          const existingDropdown = newDocs.find((doc) => doc.fullArrayList);

          const fullArrayList = existingDropdown
            ? existingDropdown.fullArrayList
            : category.documents
                ?.filter((doc) => !doc.isMandatory)
                .map((opt) => ({
                  id: opt.documentId,
                  name: opt.name,
                  verification: opt.verification || {},
                })) || [];

          const selectedDocumentIds = newDocs
            .filter((doc) => doc.documentId && !doc.isMandatory)
            .map((doc) => doc.documentId);

          const remainingOptions = fullArrayList.filter(
            (item) => !selectedDocumentIds.includes(item.id),
          );

          const dropdownIndex = newDocs.findIndex((doc) => doc.arrayList);
          if (dropdownIndex !== NUMBER_MINUS1) {
            newDocs[dropdownIndex] = {
              ...newDocs[dropdownIndex],
              arrayList: remainingOptions,
              fullArrayList: fullArrayList,
            };
          } else if (remainingOptions.length > 0) {
            newDocs.push({
              documentId: "",
              name: "",
              isMandatory: false,
              documentStatus: "pending",
              uploadKey: "",
              verification: {},
              arrayList: remainingOptions,
              fullArrayList: fullArrayList,
            });
          }
        }

        return { ...category, documents: newDocs };
      }),
    );
  };

  const proofs = mergedDocs;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6">
        <div className="mb-3">
          <h2 className="text-2xl font-semibold text-black">KYC Details</h2>
          <div className="h-px w-12 bg-purple mt-2"></div>
        </div>

        {proofs.map((category) => {
          return (
            <div key={category.kycCategoryId} className="pb-6 border-gray-200">
              <div className="mb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="text-lg text-black font-semibold">
                      {category.kycCategory.name}*
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <InfoCircleOutlined className="text-primary-black-12" />
                    <div className="text-sm text-primary-black-12">
                      No of Mandatory documents : {category.mandatory}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                {category.documents
                  .filter((doc) => doc.isMandatory)
                  .map((doc, docIndex) => (
                    <div key={doc.documentId} className="w-full sm:w-175">
                      <div className="flex flex-col sm:flex-row w-full sm:w-175 border border-gray-300 rounded-lg overflow-hidden">
                        <div className="w-full sm:w-64 border-r border-gray-300 flex items-center">
                          <input
                            value={`${doc.name}*`}
                            disabled
                            className="w-full sm:w-64 h-13.5 bg-gray-50 px-3 text-gray-700 border-none outline-none cursor-not-allowed capitalize"
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-between px-3 h-13.5 bg-white">
                          {!doc.uploadKey ? (
                            <Dragger
                              {...getDraggerProps(
                                category.kycCategoryId,
                                doc.documentId || `opt-${docIndex}`,
                                doc,
                              )}
                              className="h-12 border-none bg-white flex-1"
                              rootClassName="border-none"
                              style={{
                                border: "none",
                                background: "transparent",
                              }}
                            >
                              <div className="flex items-center justify-center h-full">
                                <ImageLoader
                                  imageKey="GetUploadIcon"
                                  className="w-5 h-5"
                                />
                                <p className="text-gray-600 font-normal ml-1">
                                  Drag & drop files or
                                  <span className="text-purple cursor-pointer underline underline-offset-4 decoration-1 ml-1">
                                    Browse
                                  </span>
                                </p>
                              </div>
                            </Dragger>
                          ) : (
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-2">
                                <Tooltip title="View document">
                                  <ImageLoader
                                    imageKey="BusinessOnboardView"
                                    className="cursor-pointer w-5 h-5"
                                    onClick={() => handleGetUrl(doc.uploadKey)}
                                  />
                                </Tooltip>
                                <Tooltip title={extractLastPart(doc.uploadKey)}>
                                  <p className="text-sm font-medium text-[#1B2536] max-w-75 truncate">
                                    {extractLastPart(doc.uploadKey)}
                                  </p>
                                </Tooltip>
                              </div>
                              <Tooltip title="Delete document">
                                <ImageLoader
                                  imageKey="CancelIcon"
                                  className="w-4 h-4 cursor-pointer"
                                  onClick={() =>
                                    handleDeleteUploadKey(
                                      category.kycCategoryId,
                                      doc.documentId || `opt-${docIndex}`,
                                    )
                                  }
                                />
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {category.documents
                  .filter((doc) => !doc.isMandatory)
                  .map((doc, docIndex) => {
                    return (
                      <div
                        key={`${category.kycCategoryId}-${doc.documentId || "dropdown"}-${docIndex}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex flex-col sm:flex-row w-full sm:w-175 border border-gray-300 rounded-lg overflow-hidden">
                          <div className="w-full sm:w-64 border-r border-gray-300 flex items-center">
                            {doc.arrayList ? (
                              <Select
                                value={doc.name || undefined}
                                placeholder="Select Document"
                                options={doc.arrayList.map((opt) => ({
                                  label: opt.name,
                                  value: opt.name,
                                }))}
                                onChange={(val) =>
                                  handleSelectChange(
                                    category.kycCategoryId,
                                    category.documents.findIndex(
                                      (d) => d === doc,
                                    ),
                                    val,
                                  )
                                }
                                className="w-full"
                                style={{ height: 54 }}
                                variant="borderless"
                              />
                            ) : (
                              <input
                                value={doc.name}
                                disabled
                                className="w-full sm:w-64 h-13.5 bg-white px-3 text-gray-700 border-none outline-none"
                              />
                            )}
                          </div>

                          <div className="flex-1 flex items-center justify-between px-3 h-13.5 bg-white">
                            {!doc.uploadKey ? (
                              <Dragger
                                {...getDraggerProps(
                                  category.kycCategoryId,
                                  doc.documentId || `opt-${docIndex}`,
                                  doc,
                                )}
                                className="h-12 border-none bg-white flex-1"
                                rootClassName="border-none"
                                style={{
                                  border: "none",
                                  background: "transparent",
                                }}
                              >
                                <div className="flex items-center justify-center h-full">
                                  <ImageLoader
                                    imageKey="GetUploadIcon"
                                    className="w-5 h-5"
                                  />
                                  <p className="text-gray-600 font-normal ml-1">
                                    Drag & drop files or
                                    <span className="text-purple cursor-pointer underline underline-offset-4 decoration-1 ml-1">
                                      Browse
                                    </span>
                                  </p>
                                </div>
                              </Dragger>
                            ) : (
                              <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                  <Tooltip title="View document">
                                    <ImageLoader
                                      imageKey="BusinessOnboardView"
                                      className="cursor-pointer w-5 h-5"
                                      onClick={() =>
                                        handleGetUrl(doc.uploadKey)
                                      }
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    title={extractLastPart(doc.uploadKey)}
                                  >
                                    <p className="text-sm font-medium text-[#1B2536] max-w-75 truncate">
                                      {extractLastPart(doc.uploadKey)}
                                    </p>
                                  </Tooltip>
                                </div>
                                <Tooltip title="Delete document">
                                  <ImageLoader
                                    imageKey="CancelIcon"
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() =>
                                      handleDeleteUploadKey(
                                        category.kycCategoryId,
                                        doc.documentId || `opt-${docIndex}`,
                                      )
                                    }
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          {!doc.arrayList && doc.documentId && (
                            <ImageLoader
                              imageKey="onboardMenuDelete"
                              className="cursor-pointer"
                              onClick={() =>
                                handleDeleteDocument(
                                  category.kycCategoryId,
                                  category.documents.findIndex(
                                    (d) => d === doc,
                                  ),
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
});

KycForms.displayName = "KycForms";
export default KycForms;
