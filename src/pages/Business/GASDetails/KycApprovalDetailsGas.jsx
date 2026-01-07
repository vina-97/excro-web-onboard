import { useState } from "react";
import FilePreviewModal from "../../../components/UI/FilePreviewModal";
import UniversalModal from "../../../components/UI/Modal/UniversalModal";
import FileUploader from "../../../components/UI/fileUploader";
import ImageLoader from "../../../components/UI/ImageLoader";
import PrimaryButton from "../../../components/UI/Buttons/PrimaryButton";
import TertiaryButton from "../../../components/UI/Buttons/TertiaryButton";
import { showFailure, showSuccess } from "../../../utils";
import useOnboardingStore from "../../../store/useOnboardingStore";
import { useParams } from "react-router-dom";
import useMerchantGenericApproval from "../../../store/useMerchantGenericApproval";
import closeImg from "../../../assets/images/common-icons/onboard_business_close_icon.svg";

const MAGIC_600 = 700;
const KycApprovalDetailsGas = ({ Kycdata }) => {
  const [openDocs, setOpenDocs] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [viewAllDocs, setViewAllDocs] = useState(null);
  const [getCategory, setGetCategory] = useState(null);
  const { fetchOnboardHistory } = useMerchantGenericApproval();
  const [editDocs, setEditDocs] = useState(null);
  const [data, setData] = useState({
    file: null,
    error: "",
    progress: 0,
    uploading: false,
  });
  const { uploadFile, reuploadOnboardingKYCData } = useOnboardingStore();
  const { businessID } = useParams();
  const NUMBER_2 = 2;
  const NUMBER_100 = 100;
  const NUMBER_1024 = 1024;
  const [getUploadedKey, setGetUploadedKey] = useState(null);

  const KycApprovalData = Kycdata?.kycDocuments || [];

  const handlePreviewDoc = async (getValue) => {
    setGetUploadedKey(getValue);
    setOpenDocs(true);
  };
  const handleClose = () => setViewAll(false);
  const handleEdit = (parent, child, category) => {
    setGetCategory(category);
    setViewAllDocs(category?.documents[child]);
    setEditDocs([parent, child]);
    setData({ file: null, error: "", progress: 0, uploading: false });
  };

  const handleCancel = () => {
    setEditDocs(null);
    setData({ file: null, error: "", progress: 0, uploading: false });
  };

  const handleUploadDocs = async () => {
    console.log(data);
    const { file } = data;

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

      const fileName = file.name?.split(".").pop()?.toLowerCase();

      const result = await uploadFile(file, businessID, "kyc", fileName);
      showSuccess("File uploaded successfully:", result);

      const payload = {
        kycCategoryId: getCategory?.kycCategoryId,
        documentId: viewAllDocs?.documentId,
        uploadKey: result?.fileKey,
      };

      reuploadOnboardingKYCData(payload, businessID).then(() => {
        setEditDocs(null);
        fetchOnboardHistory(businessID);
        return true;
      });
    } catch (error) {
      showFailure("File upload failed:", error);
      return false;
    }
    return true;
  };

  const handleViewAll = (doc) => {
    setViewAllDocs(doc);
    setViewAll(true);
  };

  const formatKey = (key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const isEmptyValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  };

  const flattenObject = (obj, parentKey = "") => {
    let entries = [];

    Object.entries(obj || {}).forEach(([key, value]) => {
      const label = parentKey
        ? `${formatKey(parentKey)} (${formatKey(key)})`
        : formatKey(key);

      // ✅ Handle error objects
      if (
        key.toLowerCase() === "error" ||
        (typeof value === "object" && value?.message)
      ) {
        entries.push({
          label: "Error",
          value: value?.message || JSON.stringify(value) || "-",
        });
        return;
      }

      // ✅ Handle nested objects
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nested = flattenObject(value, label);
        if (nested.length > 0) {
          entries = [...entries, ...nested];
        } else {
          entries.push({ label, value: "-" });
        }
        return;
      }

      // ✅ Handle arrays
      if (Array.isArray(value)) {
        entries.push({
          label,
          value: value.length > 0 ? value.join(", ") : "-",
        });
        return;
      }

      // ✅ Handle booleans
      if (typeof value === "boolean") {
        entries.push({
          label,
          value: value ? "True" : "False",
        });
        return;
      }

      // ✅ Normal key-value fallback
      entries.push({
        label,
        value: isEmptyValue(value) ? "-" : value,
      });
    });

    return entries;
  };

  const getFullFields = (result) => {
    if (!result || typeof result !== "object") {
      return [
        {
          label: "Document",
          value: "View File",
          isDocument: true,
        },
      ];
    }

    const dynamicFields = flattenObject(result);

    dynamicFields.push({
      label: "Document",
      value: "View File",
      isDocument: true,
    });

    return dynamicFields;
  };

  const getSummaryFields = (result) => {
    if (!result || typeof result !== "object") {
      return [
        {
          label: "Document",
          value: "View File",
          isDocument: true,
        },
      ];
    }

    const flattened = flattenObject(result).slice(0, NUMBER_2);

    flattened.push({
      label: "Document",
      value: "View File",
      isDocument: true,
    });

    return flattened;
  };

  console.log(viewAllDocs, getCategory, editDocs, data);

  return (
    <div className="mb-24">
      <div className="grid grid-cols-1 gap-6">
        {KycApprovalData.map((category, index) => (
          <div key={index} className="w-full">
            {/* Section Header */}
            <div className="text-[#010101] text-lg sm:text-base mb-5 font-semibold">
              {category?.kycCategory?.name}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {category?.documents?.map((doc, i) => {
                const verificationResult =
                  doc?.verification?.result?.result ||
                  doc?.verification?.result?.error;
                const summaryFields = getSummaryFields(verificationResult);

                return (
                  <div
                    key={i}
                    className="border border-[#E5E7EB] rounded-xl bg-white flex flex-col justify-between w-full"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 pb-4">
                      <div className="flex items-center mb-3 sm:mb-0">
                        <div className="bg-[#5635B3] p-3 rounded-lg mr-3 shrink-0">
                          <ImageLoader
                            imageKey="onboardBusinessProofId"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                          />
                        </div>
                        <p className="text-[#010101] text-base sm:text-sm font-semibold truncate capitalize">
                          {doc.name}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 font-medium">
                        {JSON.stringify(editDocs) !==
                          JSON.stringify([index, i]) && (
                          <div
                            className="flex items-center py-1 px-2 text-base sm:text-sm cursor-pointer"
                            onClick={() => handleEdit(index, i, category)}
                          >
                            <ImageLoader
                              imageKey="onboardBusinessEditIconBlack"
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"
                            />
                            Edit
                          </div>
                        )}
                        <div
                          className="flex items-center py-1 px-2 text-base sm:text-sm cursor-pointer"
                          onClick={() => handleViewAll(doc)}
                        >
                          <ImageLoader
                            imageKey="onboardBusinessViewIconBlack"
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1"
                          />
                          View All
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="border-t border-[#F3F4F6] w-full flex justify-between flex-wrap pt-6 px-6">
                      {JSON.stringify(editDocs) ===
                      JSON.stringify([index, i]) ? (
                        <div className="flex flex-col md:flex-row w-full gap-4 items-start md:items-center mb-5">
                          <div className="flex-1 w-full">
                            <FileUploader setData={setData} data={data} />
                          </div>
                          <div className="sm:w-45 w-full flex flex-col sm:flex-row sm:flex-wrap items-start md:items-center">
                            <PrimaryButton
                              type="primary"
                              size="large"
                              label="Update"
                              onNotify={handleUploadDocs}
                              disabled={data?.progress !== NUMBER_100}
                            />
                            <TertiaryButton
                              type="default"
                              size="large"
                              label="Cancel"
                              onNotify={handleCancel}
                            />
                          </div>
                        </div>
                      ) : (
                        summaryFields?.map((acc, a) => (
                          <div key={a} className="pr-2 mb-4">
                            <p className="text-gray-500 text-xs sm:text-sm font-normal mb-2 truncate">
                              {acc.label}
                            </p>
                            <p
                              className={`flex items-center font-semibold text-sm sm:text-base ${
                                acc.isDocument
                                  ? "text-[#5635B3] underline cursor-pointer"
                                  : "text-[#010101]"
                              }`}
                              onClick={() =>
                                acc.isDocument
                                  ? handlePreviewDoc(doc.uploadKey)
                                  : null
                              }
                            >
                              {acc.isDocument && (
                                <ImageLoader
                                  imageKey="BusinessOnboardView"
                                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
                                />
                              )}
                              {acc.value}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {openDocs && (
        <FilePreviewModal
          open={openDocs}
          data={getUploadedKey}
          setOpen={setOpenDocs}
        />
      )}

      <UniversalModal
        isOpen={viewAll}
        onClose={handleClose}
        width={MAGIC_600}
        from="nobtn"
        closeIcon={false}
      >
        {viewAllDocs && (
          <div>
            <div className="flex justify-between items-center border-b-[1.5px] border-[#EFEFEF] pb-5">
              <p className="text-xl text-[#010101] font-semibold capitalize">
                {viewAllDocs?.name}
              </p>
              <button
                onClick={handleClose}
                className="flex items-center border border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer"
              >
                <img src={closeImg} alt="close" />
              </button>
            </div>

            <div className="text-[#010101] text-base font-semibold mt-2.5 mb-5">
              Document Details
            </div>

            <div className="w-full flex flex-wrap">
              {getFullFields(
                viewAllDocs?.verification?.result?.result ||
                  viewAllDocs?.verification?.result?.error,
              ).map((item, i) => (
                <div key={i} className="mb-5 w-1/3">
                  <p className="text-[#6B7280] text-[13px] sm:text-sm font-medium mb-2 truncate">
                    {item.label}
                  </p>
                  <p
                    className={`flex items-center font-semibold text-sm sm:text-base ${
                      item.isDocument
                        ? "text-[#5635B3] underline cursor-pointer"
                        : "text-[#010101]"
                    }`}
                    onClick={() =>
                      item.isDocument
                        ? handlePreviewDoc(viewAllDocs.uploadKey)
                        : null
                    }
                  >
                    {item.isDocument && (
                      <ImageLoader
                        imageKey="BusinessOnboardView"
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-1"
                      />
                    )}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </UniversalModal>
    </div>
  );
};

export default KycApprovalDetailsGas;
