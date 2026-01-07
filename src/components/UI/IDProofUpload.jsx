import { useRef, useState, useCallback, useEffect } from "react";
import cloudIcon from "../../assets/images/common-icons/cloud-add.svg";
import trashIcon from "../../assets/images/common-icons/trash.svg";
import { Button, Tooltip } from "antd";
import useOnboardingStore from "../../store/useOnboardingStore";
import useMasterStore from "../../store/useMasterStore";
import { extractLastPart, showFailure } from "../../utils";
import ImageLoader from "./ImageLoader";

const maxSize = 2; // in MB
const MAXSIZE_1024 = 1024;

const IDProofUpload = ({
  label,
  name,
  getValue,
  onValueChange,
  accept = ".jpeg,.jpg,.png,.pdf",
  maxSizeMB = maxSize,
  from,
  userId,
  documentation,
  status,
  disabled,
}) => {
  const inputRef = useRef();
  const [value, setValue] = useState(getValue || "");
  const [dragActive, setDragActive] = useState(false);
  const [signedUrls, setSignedUrls] = useState({});
  const { fetchSignedUrl } = useMasterStore();
  const { uploadFile, uploadedFile } = useOnboardingStore();

  // const formatBytes = (bytes) => {
  //   if (bytes >= MAXSIZE_1024 * MAXSIZE_1024) {
  //     return (bytes / (MAXSIZE_1024 * MAXSIZE_1024)).toFixed(maxSize) + ' MB';
  //   } else if (bytes >= MAXSIZE_1024) {
  //     return (bytes / MAXSIZE_1024).toFixed(maxSize) + ' KB';
  //   } else {
  //     return bytes + ' Bytes';
  //   }
  // };

  useEffect(() => {
    setValue(getValue || "");
  }, [getValue]);

  const validateFile = (file) => {
    const isValidType = ["image/jpeg", "image/png", "application/pdf"].includes(
      file.type,
    );
    const isValidSize = file.size / MAXSIZE_1024 / MAXSIZE_1024 <= maxSizeMB;
    return { isValid: isValidType && isValidSize, isValidType, isValidSize };
  };

  const handleFile = async (file) => {
    const { isValid, isValidType } = validateFile(file);
    if (!isValid) {
      onValueChange &&
        onValueChange({
          name,
          file: null,
          error: !isValidType ? "Invalid type" : "File too big",
        });
      showFailure(!isValidType ? "Invalid type" : "File too big");
      return;
    }
    const result = await uploadFile(file, userId, documentation, name);
    onValueChange && onValueChange({ name, file: result?.fileKey });
    setValue(result?.fileKey);
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    await handleFile(file);
    e.target.value = "";
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) {
      setDragActive(true);
    }
    if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = () => {
    onValueChange({ name, file: "", error: "" });
    setValue("");
    useOnboardingStore.getState().setUploadedFile({});
  };

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

  const getImageKey = () => {
    const type = uploadedFile?.[name]?.type;
    if (!type) {
      return "JpgIcon";
    }
    if (type === "application/pdf") {
      return "PDFIcon";
    }
    return "JpgIcon";
  };

  return (
    <div>
      {label && (
        <div className="mb-2 text-black font-normal capitalize">{label}</div>
      )}

      <div
        className={`border-1 border-dashed border-gray-300 rounded-lg p-4 bg-white
    ${dragActive ? "border-blue-500 bg-blue-50" : ""}
    ${!disabled ? "cursor-pointer" : ""} hover:border-gray-500 transition`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* File Input */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          name={name}
          disabled={disabled}
        />

        <div className="flex items-center justify-between w-full gap-4">
          {/* Upload clickable area */}
          <div
            className="flex-1"
            onClick={() => !disabled && inputRef.current.click()}
          >
            {!value ? (
              <div className="flex gap-1 items-start">
                <img src={cloudIcon} className="w-7 h-7 mb-4" alt="cloud" />
                <div>
                  <p className="font-semibold text-sm text-black mb-[9px]">
                    {dragActive
                      ? "Drop the file here..."
                      : "Choose a file or drag & drop it here"}
                  </p>
                  <p className="text-xs text-gray-400">
                    JPEG, PNG, PDF up to {maxSizeMB}MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <ImageLoader imageKey={getImageKey()} />
                <Tooltip title={extractLastPart(value)}>
                  <p className="font-semibold text-sm text-black mb-1 w-[150px] truncate">
                    {extractLastPart(value)}
                  </p>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Browse button for empty state */}
          {from !== "modal" && !value && (
            <div
              className="flex-shrink-0 px-4 py-1 border-light border rounded"
              onClick={() => !disabled && inputRef.current.click()}
            >
              <span className="text-[#54575c]">Browse File</span>
            </div>
          )}

          {/* View & Delete icons */}
          {value && disabled && (
            <ImageLoader
              imageKey="EyeIcon"
              className="cursor-pointer"
              onClick={() => handleGetUrl(value)}
            />
          )}

          {value && !disabled && (
            <div className="flex items-center">
              <ImageLoader
                imageKey="EyeIcon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetUrl(value);
                }}
                className="cursor-pointer eye-black"
              />
              <Button
                type="default"
                size="large"
                className="text-black !border-none flex items-center text-sm font-normal cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <img src={trashIcon} alt="Delete" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[#b3251e] mt-1">{status}</div>
    </div>
  );
};

export default IDProofUpload;
