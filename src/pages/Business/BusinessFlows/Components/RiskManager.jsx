import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { Form, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import ImageLoader from "../../../../components/UI/ImageLoader";
import UniversalModal from "../../../../components/UI/Modal/UniversalModal";
import { showFailure } from "../../../../utils";
import { InfoCircleOutlined } from "@ant-design/icons";
import FileUploader from "../../../../components/UI/fileUploader";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { riskSchema } from "../validations/riskSchema";
import TextArea from "antd/es/input/TextArea";

// Reusable Checkbox Component
const RiskCheckbox = ({ id, label, control, name, onChangeExtra }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        <input
          type="checkbox"
          id={id}
          {...field}
          checked={!!field.value}
          onChange={(e) => {
            field.onChange(e.target.checked);
            onChangeExtra?.(e.target.checked);
          }}
          className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 shrink-0 appearance-none border border-purple rounded bg-white checked:border-purple cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-purple checked:after:text-xs sm:checked:after:text-sm checked:after:font-bold checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
        />
        <label
          htmlFor={id}
          className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none leading-tight sm:leading-normal"
        >
          {label}
        </label>
      </div>
    )}
  />
);

const RiskManager = forwardRef(({ data, onSubmit }, ref) => {
  const [isWebsiteModalOpen, setIsWebsiteModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const { businessID } = useParams();
  const {
    control,
    setValue,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(riskSchema),
    defaultValues: {
      negativeData: { isEnabled: data?.negativeData?.isEnabled || false },
      aml: { isEnabled: data?.aml?.isEnabled || false },
      webCrawling: {
        isEnabled: data?.webCrawling?.isEnabled || false,
        website: data?.webCrawling?.website || "",
      },
      fieldVerification: {
        isEnabled: data?.fieldVerification?.isEnabled || false,
        file: data?.fieldVerification?.file || "",
        reason: data?.fieldVerification?.reason || "",
      },
    },
  });

  // Update default values when data changes
  useEffect(() => {
    if (data) {
      setValue("negativeData.isEnabled", data.negativeData?.isEnabled || false);
      setValue("aml.isEnabled", data.aml?.isEnabled || false);
      setValue("webCrawling.isEnabled", data.webCrawling?.isEnabled || false);
      setValue("webCrawling.website", data.webCrawling?.website || "");
      setValue(
        "fieldVerification.isEnabled",
        data.fieldVerification?.isEnabled || false,
      );
      setValue("fieldVerification.file", data.fieldVerification?.file || "");
      setValue(
        "fieldVerification.reason",
        data.fieldVerification?.reason || "",
      );
    }
  }, [data, setValue]);

  const handleWebsiteSubmit = () => {
    const url = getValues("webCrawling.website")?.trim();
    if (!url) {
      showFailure("Please enter a website URL");
      return;
    } else if (!/^https?:\/\/.+\..+/.test(url)) {
      showFailure("Please enter a valid website URL");
      return;
    }
    setIsWebsiteModalOpen(false);
  };

  const handleFieldVerificationSubmit = async () => {
    const valid = await trigger("fieldVerification");
    if (valid) {
      setIsFieldModalOpen(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const isValid = await trigger();
      if (isValid) {
        const values = getValues();
        console.log(values);
        // return false;
        onSubmit?.(values);
        return true;
      }
      return false;
    },
  }));
  console.log(getValues(), "sds");

  const handleWebCrawlingChange = (checked) => {
    if (checked) {
      setIsWebsiteModalOpen(true);
    } else {
      setValue("webCrawling.website", "");
    }
  };

  const handleDeleteUploadKey = () => {
    const current = getValues("fieldVerification") || {};

    setValue("fieldVerification", {
      ...current,
      file: "", // reset file only
      // optionally: reason: '', // if you also want to clear reason
    });

    // Optionally trigger validation or re-render if required
    trigger("fieldVerification.file");
  };

  const handleFieldVerificationChange = (checked) => {
    if (checked) {
      setIsFieldModalOpen(true);
    } else {
      setValue("fieldVerification.isEnabled", false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 md:p-8 lg:p-30">
      <div className="flex flex-col items-center">
        {/* Image */}
        <div className="mb-4 sm:mb-6">
          <ImageLoader imageKey="frmIcon" />
        </div>

        {/* Title and Description */}
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-center max-w-[90%] sm:max-w-100 mb-6 sm:mb-8 px-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-black">
            Financial Risk Check
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Checking financial risk helps us protect your business against fraud
            and ensure secure transactions.
          </p>
        </div>
        {/* Form */}
        <div className="">
          <div className="w-full max-w-150 2xl:max-w-175">
            <Form layout="vertical" onSubmit={handleSubmit(onSubmit)}>
              <div className="pl-16 grid grid-cols-1 sm:grid-cols-1 2xl:grid-cols-2 3xl:grid-cols-2 4xl:grid-cols-3 xl:grid-cols-2 justify-between gap-x-6 sm:gap-x-8 md:gap-x-16 gap-y-4">
                {/* Negative Data Check */}
                <div className="flex items-start sm:items-center">
                  <RiskCheckbox
                    id="negativeData"
                    label="Negative Database Check"
                    control={control}
                    name="negativeData.isEnabled"
                  />
                </div>
                {/* Website Check */}
                <div className="flex items-start sm:items-center">
                  <RiskCheckbox
                    id="websiteCheck"
                    label="Website Check"
                    control={control}
                    name="webCrawling.isEnabled"
                    onChangeExtra={handleWebCrawlingChange}
                  />
                </div>
                {/* AML Check */}
                <div className="flex items-start sm:items-center">
                  <RiskCheckbox
                    id="amlCheck"
                    label="AML Check"
                    control={control}
                    name="aml.isEnabled"
                  />
                </div>
                {/* Field Verification */}
                <div className="flex items-start sm:items-center">
                  <RiskCheckbox
                    id="fieldVerification"
                    label="Field Verification"
                    control={control}
                    name="fieldVerification.isEnabled"
                    onChangeExtra={handleFieldVerificationChange}
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Website Modal */}
      {isWebsiteModalOpen && (
        <UniversalModal
          isOpen={isWebsiteModalOpen}
          onClose={() => {
            setIsWebsiteModalOpen(false);
            setValue("webCrawling.isEnabled", false);
          }}
          title="Enter Website URL"
          onSubmit={handleWebsiteSubmit}
        >
          <div className="mt-4">
            <Controller
              name="webCrawling.website"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    placeholder="e.g., https://example.com"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors?.webCrawling?.website && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.webCrawling.website.message}
                    </p>
                  )}
                </>
              )}
            />

            <div className="flex items-center space-x-2 mt-2">
              <InfoCircleOutlined className="text-primary-black-12" />
              <div className="text-xs text-primary-black-12">
                Enter the website to perform automated crawling checks.
              </div>
            </div>
          </div>
        </UniversalModal>
      )}
      {isFieldModalOpen && (
        <UniversalModal
          isOpen={isFieldModalOpen}
          onClose={() => {
            setIsFieldModalOpen(false);
            setValue("fieldVerification.isEnabled", false);
          }}
          title="Enter Field Verification Details"
          onSubmit={handleFieldVerificationSubmit}
        >
          <div className="mb-7.5">
            {/* Reason Field */}
            <Controller
              name="fieldVerification.reason"
              control={control}
              render={({ field }) => (
                <>
                  <TextArea
                    {...field}
                    placeholder="Enter Reason"
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger("fieldVerification.reason");
                    }}
                  />
                  {/* ✅ Error directly under textarea */}
                  {errors?.fieldVerification?.reason && (
                    <p className="text-rejected text-xs mt-1">
                      {errors.fieldVerification.reason.message}
                    </p>
                  )}
                </>
              )}
            />

            {/* Label */}
            <p className="text-start my-2.5 text-[#40444C] text-[14px] font-medium">
              Upload Document*
            </p>

            {/* File Uploader Field */}
            <Controller
              name="fieldVerification.file"
              control={control}
              render={({ field }) => (
                <>
                  <FileUploader
                    id={businessID}
                    handleDelete={handleDeleteUploadKey}
                    data={
                      field.value
                        ? {
                            file: { name: field.value, type: "" },
                            error: "",
                            progress: 100,
                            uploading: false,
                          }
                        : {}
                    }
                    from="onboard"
                    setData={(val) => {
                      if (val?.fileKey) {
                        field.onChange(val.fileKey); // ✅ store fileKey in form
                        // setValue('fieldVerification.fileType', val.fileType); // ✅ optional extra
                      }
                    }}
                  />
                  {errors?.fieldVerification?.file && (
                    <p className="text-rejected text-xs mt-1">
                      {errors.fieldVerification.file.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </UniversalModal>
      )}
    </div>
  );
});

RiskManager.displayName = "RiskManager";
export default RiskManager;
