import React, { useState } from "react";
import ImageLoader from "./ImageLoader";
import useMerchantGenericApproval from "../../store/useMerchantGenericApproval";
// import useMerchantOnboardingStore from '../../store/useMerchantOnboardingStore';
import { Tooltip } from "antd";
import { extractLastPart } from "../../utils";
import useOnboardingStore from "../../store/useOnboardingStore";
import useMasterStore from "../../store/useMasterStore";

export default function FileUploader({
  setData,
  data,
  id,
  from,
  handleDelete,
}) {
  const {
    // fetchOnboardHistory,
    // onboardHistory,
    // btnLoading,
    uploadDocuments,
  } = useMerchantGenericApproval();
  const { uploadFile, uploadedFile } = useOnboardingStore();
  const { fetchSignedUrl } = useMasterStore();

  const [uploadKey, setUploadKey] = useState("");
  const [signedUrls, setSignedUrls] = useState({});

  console.log(uploadDocuments, id, data);
  const { file, error, progress, uploading } = data;
  const MAX_SIZE_MB = 2;
  //   const TWO = 2; // limit to 5 MB
  const MAX_SIZE_1024 = 1024;
  const MAGIC_10 = 10;
  const MAGIC_100 = 100;
  const MAGIC_200 = 200;
  console.log(uploadedFile?.kyckey, "kyckey");
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

  const handleFile = async (f) => {
    if (!f) {
      return;
    }

    if (!ALLOWED_TYPES.includes(f.type)) {
      setData((prev) => ({
        ...prev,
        error: "Only PNG, JPEG, and PDF files are allowed.",
        file: null,
      }));
      return;
    }

    if (f.size / (MAX_SIZE_1024 * MAX_SIZE_1024) > MAX_SIZE_MB) {
      setData((prev) => ({
        ...prev,
        error: `File size must be less than ${MAX_SIZE_MB} MB.`,
        file: null,
      }));
      return;
    }

    // 🚀 Upload file
    const result = await uploadFile(f, id, "kyc", "kyckey");

    const fileType = f.type.startsWith("image/") ? "image" : "pdf";
    const fileKey = result?.fileKey || "";

    // ✅ Push data to RHF or local
    if (typeof setData === "function") {
      setData({
        file: f,
        fileKey,
        fileType, // 👈 added fileType
        error: "",
        progress: 100, // 👈 mark upload complete
        uploading: false,
      });
    }

    // store locally too
    setUploadKey(fileKey);
    setData((prev) => ({
      ...prev,
      file: f,
      fileKey,
      fileType,
      error: "",
      progress: 100,
      uploading: false,
    }));
    simulateUpload(f);
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  const simulateUpload = () => {
    // setUploading(true);
    // setProgress(0);
    setData((prev) => {
      return {
        ...prev,
        uploading: true,
        progress: 0,
      };
    });
    let counter = 0;
    const interval = setInterval(() => {
      counter += MAGIC_10;
      //   setProgress(counter);
      setData((prev) => {
        return {
          ...prev,
          progress: counter,
        };
      });
      if (counter >= MAGIC_100) {
        clearInterval(interval);
        // setUploading(false);
      }
    }, MAGIC_200);
  };

  const handleGetUrl = async () => {
    // window.open(uploadedFile?.kyckey?.fileKey)
    // window.open(uploadedFile?.kyckey?.signedUrl, '_blank', 'noopener,noreferrer');
    const fileKey = uploadKey;
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

  // setUploadKey('')
  // /api/v2/onboarding/s3/signed-url
  const handleDeleteUploadKey = () => {
    console.log("jfhdjhf");
    setUploadKey("");
    setData({
      file: null,
      error: "",
      progress: 0,
      uploading: false,
    });
  };
  console.log(uploadKey, file);
  return (
    <div className="flex flex-col w-full">
      {Number(progress) !== MAGIC_100 && (
        <label
          htmlFor="fileUpload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`w-full flex flex-col border border-dashed rounded-md cursor-pointer transition-all
      ${error ? "border-red-500" : "border-gray-400 hover:border-blue-500"}
      ${file ? "bg-gray-50" : "bg-white"}
    `}
        >
          <input
            id="fileUpload"
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept=".png, .jpg, .jpeg, .pdf"
          />

          {file ? (
            <div className="w-full flex flex-col p-2">
              <div className="flex items-center">
                {Number(progress) !== MAGIC_100 && (
                  <div>
                    <ImageLoader
                      imageKey={
                        file?.type?.startsWith("image/")
                          ? "onboardBusinessImageIcon"
                          : "onboardBusinessPdfIcon"
                      }
                      className="w-12 h-10"
                    />
                  </div>
                )}

                <div className="flex flex-col w-full">
                  {/* {file.type.startsWith('image/') && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mb-2"
              />
            )} */}
                  {Number(progress) !== MAGIC_100 && (
                    <p className="text-gray-800 font-semibold text-sm truncate w-full">
                      {file?.name}
                    </p>
                  )}

                  {/* <p className="text-xs text-gray-500">
                  {(file.size / (MAX_SIZE_1024 * MAX_SIZE_1024)).toFixed(TWO)}{' '}
                  MB
                </p> */}

                  {/* Upload Progress Bar */}
                  {Number(progress) !== MAGIC_100 && uploading && (
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: "#483EA8",
                          }}
                        />
                      </div>

                      <p className="ml-3 text-xs font-semibold text-gray-700">
                        {progress}%
                      </p>
                    </div>
                  )}

                  {/* {uploading && progress === MAGIC_100 && (
              <p className="text-green-600 text-xs mt-2">Upload Complete ✅</p>
            )} */}
                </div>
                {/* <div>
                 <ImageLoader imageKey="onboardBusinessCloseIconDark" className="w-3 h-3" />
            </div> */}
              </div>
            </div>
          ) : (
            <div className="w-full p-2 flex items-center space-x-4 flex-wrap">
              <div className="flex-shrink-0">
                <ImageLoader imageKey="GetUploadIcon" className="w-10 h-10" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-grey text-xs font-semibold truncate mb-[3px]">
                  Drag & drop files or{" "}
                  <span className="text-[#483EA8] underline cursor-pointer">
                    Browse
                  </span>
                </p>
                <p className="text-[#676767] text-xs truncate">
                  Supported formats: JPEG, PNG, PDF
                </p>
              </div>
            </div>
          )}
        </label>
      )}

      {Number(progress) === MAGIC_100 && (
        <div className="border border-primary-black-13 rounded-lg p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center space-x-3">
              <Tooltip title="View document">
                <ImageLoader
                  imageKey="BusinessOnboardView"
                  className="cursor-pointer w-5 h-5"
                  onClick={handleGetUrl}
                />
              </Tooltip>
              <Tooltip title={extractLastPart(uploadKey)}>
                <p className="text-sm font-medium text-[#1B2536] max-w-[200px] truncate">
                  {extractLastPart(uploadKey)}
                </p>
              </Tooltip>
            </div>
            <Tooltip title="Delete document">
              <ImageLoader
                imageKey="CancelIcon"
                className="w-4 h-4 cursor-pointer"
                onClick={
                  from === "onboard"
                    ? () => handleDelete()
                    : handleDeleteUploadKey
                }
              />
            </Tooltip>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* {file && !uploading && (
        <button
          onClick={() => {
            setFile(null);
            setProgress(0);
          }}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
        >
          Remove File
        </button>
      )} */}
    </div>
  );
}
