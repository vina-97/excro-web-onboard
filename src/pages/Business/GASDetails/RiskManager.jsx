import FilePreviewModal from "../../../components/UI/FilePreviewModal";
import { useState } from "react";
import ImageLoader from "../../../components/UI/ImageLoader";
import { useNavigate } from "react-router-dom";
import UniversalModal from "../../../components/UI/Modal/UniversalModal";
import TertiaryButton from "../../../components/UI/Buttons/TertiaryButton";
import PrimaryButton from "../../../components/UI/Buttons/PrimaryButton";
import { setStatusColorText, showFailure } from "../../../utils";
import FileUploader from "../../../components/UI/fileUploader";
import TestAreaField from "../../../components/UI/TextAreaField";
import useMerchantGenericApproval from "../../../store/useMerchantGenericApproval";
import AntdInput from "../../../components/UI/AntdInput";

const RiskManager = ({ businessID, data }) => {
  const [openDocs, setOpenDocs] = useState(false);
  const [OpenPopupModel, setOpenPopupModel] = useState(false);
  const [getData, setGetData] = useState({});
  const [errorMessage, seterror] = useState(false);
  const [filedata, setData] = useState({
    file: null,
    error: "",
    progress: 0,
    uploading: false,
  });
  const [reason, setReason] = useState("");
  const [web_url, setWeb_url] = useState("");
  const navigate = useNavigate();
  const { riskCheckEnable, fetchOnboardHistory } = useMerchantGenericApproval();

  const listOfRiskManager = [
    {
      icon: "onboardBusinessDataCheckIcon",
      label: "Data Checks",
      value: data?.riskManager?.negativeData?.status ?? "",
      path: `/merchant-generic-detail/data-checks/${businessID}`,
      isEnabled: data?.riskManager?.negativeData?.isEnabled ?? false,
      fileType: "DR_CHECK",
    },
    {
      icon: "onboardBusinessWebsiteCheckIcon",
      label: "Website Checks",
      value: data?.riskManager?.webCrawling?.status ?? "",
      path: `/merchant-generic-detail/website-check/${businessID}`,
      isEnabled: data?.riskManager?.webCrawling?.isEnabled ?? false,
      fileType: "WEB_CRAWLING",
    },
    {
      icon: "onboardBusinessAMLCheck",
      label: "AML Checks",
      value: data?.riskManager?.aml?.status ?? "",
      path: "aml",
      isEnabled: data?.riskManager?.aml?.isEnabled ?? false,
      fileType: "AML",
    },

    {
      icon: "onboardBusinessFieldVerification",
      label: "Field Verification",
      value: data?.riskManager?.fieldVerification?.status ?? "",
      isEnabled: data?.riskManager?.fieldVerification?.isEnabled ?? false,
      fileType: "FIELD_VERIFICATION",
    },
  ];

  const handleRoute = (path) => {
    if (path === "aml") {
      data?.riskManager?.aml?.status === "completed"
        ? navigate(
            `/merchant-generic-detail/aml-search-results/aml-sanction-detail/${businessID}`,
            {
              state: {
                searchHistoryId: data?.aml?.searchHistoryId,
                sanctionId:
                  data?.aml?.decisionDetails?.sanctionId ?? "SANCL_MLjM36f4tY",
              },
            },
          )
        : navigate(`/merchant-generic-detail/aml-search-results/${businessID}`);
    } else {
      navigate(path);
    }
  };

  const handleViewAll = () => {
    console.log("sakthi");

    setOpenDocs(true);
  };
  const handleCancel = () => {
    setData({
      file: null,
      error: "",
      progress: 0,
      uploading: false,
      fileKey: "",
    });
    setOpenPopupModel(false);
    setReason("");
    setWeb_url("");
    seterror("");
  };
  console.log(filedata);
  const handleSubmit = () => {
    console.log("submit", getData.fileType);
    if (getData.fileType === "FIELD_VERIFICATION" && !reason) {
      // showFailure('Please enter the reason');
      seterror("Please enter the reason");
    } else if (getData.fileType === "FIELD_VERIFICATION" && !filedata.fileKey) {
      showFailure("Please upload the document");
      // seterror('Please enter the reason');
    } else if (getData.fileType === "WEB_CRAWLING" && !web_url) {
      // showFailure('Please enter the web url');
      seterror("Please enter the website url");
    } else {
      const data = {
        type: getData.fileType,
        businessId: businessID,
        website: web_url ?? "",
        file: filedata.fileKey ?? "",
        reason: reason ?? "",
      };

      riskCheckEnable(businessID, data, (res) => {
        if (res) {
          fetchOnboardHistory(businessID);
          setOpenPopupModel(false);
          handleCancel();
        } else {
          setOpenPopupModel(true);
        }
      });
    }
  };

  const handleEnableChange = (item) => {
    setGetData(item);
    setOpenPopupModel(true);
  };

  const handleChange = (e) => {
    setReason(e.target.value);
    seterror("");
  };

  const handleWeburlChange = (e) => {
    console.log(e);
    setWeb_url(e.value);
    seterror("");
  };
  console.log(reason, "reason");

  const handleUploadFile = () => {
    console.log("dsfdsds");
  };

  console.log(errorMessage);
  return (
    <>
      <div className="mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listOfRiskManager?.map((field, index) => (
            <div
              key={index}
              className={`border border-[#E5E7EB] rounded-xl bg-white flex flex-col justify-between ${
                field.isEnabled &&
                field.label !== "Field Verification" &&
                "cursor-pointer"
              }`}
              onClick={() =>
                field.isEnabled &&
                field.label !== "Field Verification" &&
                handleRoute(field.path)
              }
            >
              <div className="flex justify-between items-center px-6 pt-6 pb-4.5">
                <div className="flex items-center min-w-0">
                  <div className="mr-3 shrink-0">
                    <ImageLoader
                      imageKey={field.icon}
                      className="w-15 h-10 sm:w-12 sm:h-11"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#010101] text-sm sm:text-base font-semibold truncate mb-1.25">
                      {field.label}
                    </p>
                    <p
                      className={`${setStatusColorText(field.value)} text-xs sm:text-sm font-medium truncate capitalize`}
                    >
                      {field.value}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center py-1 px-2 text-base sm:text-sm cursor-pointer"
                  onClick={() =>
                    field.isEnabled &&
                    field.label === "Field Verification" &&
                    handleViewAll(field)
                  }
                >
                  {!field.isEnabled ? (
                    <div
                      className="flex items-center text-[#0E8A30] px-2.5 py-1.5 bg-[#D5FFD5] rounded-md text-xs font-semibold cursor-pointer"
                      onClick={() => handleEnableChange(field)}
                    >
                      <span>Click to Enable</span>
                      <ImageLoader
                        imageKey={"onboardBusinessGreenArrow"}
                        className="w-3 h-3 sm:w-2.5 sm:h-2.5 ml-1"
                      />
                    </div>
                  ) : (
                    <ImageLoader
                      imageKey={
                        field.label === "Field Verification"
                          ? "onboardBusinessViewIconBlack"
                          : "onboardBusinessRightarrow"
                      }
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-[#0E8A30]"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {openDocs && (
          <FilePreviewModal
            open={openDocs}
            data={data?.riskManager?.fieldVerification?.file}
            setOpen={setOpenDocs}
          />
        )}

        <UniversalModal
          isOpen={OpenPopupModel}
          onClose={handleCancel}
          onSubmit={null}
          fetchLoader={null}
          closeIcon={true}
          from="nobtn"
          width={500}
        >
          <div className="text-center p-4">
            <div className="flex justify-center mb-4">
              <div className=" w-16 h-16 flex items-center justify-center">
                <ImageLoader
                  imageKey="onboardBusinessSuccessToast"
                  className={`w-16 h-16`}
                />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Enable {getData.label}
            </h2>
            <p className="text-gray-600 mb-6">
              {`Are you sure you want to enable ${getData.label}?`}
            </p>
          </div>

          {getData.label === "Website Checks" && (
            <div className="w-100 mb-7.5">
              <AntdInput
                label="Website URL*"
                placeholder="e.g., Website URL"
                labelCss={"text-[#40444C] text-[14px] font-medium "}
                name="Website URL"
                value={web_url || ""}
                onValueChange={(e) => handleWeburlChange(e)}
                error={errorMessage}
              />
            </div>
          )}
          {getData.label === "Field Verification" && (
            <div className="mb-7.5">
              <TestAreaField
                placeholder={`Reason `}
                icon={false}
                label="Reason*"
                className=""
                value={reason}
                handleChange={(e) => handleChange(e)}
                error={errorMessage}
              />
              <p className="text-start my-2.5 text-[#40444C] text-[14px] font-medium">
                Upload Document*
              </p>
              <div className="">
                <FileUploader
                  callBack={() => handleUploadFile}
                  setData={setData}
                  data={filedata}
                  id={businessID}
                />
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <TertiaryButton
              type="default"
              size="large"
              label="No"
              onNotify={handleCancel}
            />

            <PrimaryButton
              type="primary"
              size="large"
              label={`Yes`}
              onNotify={() => handleSubmit("")}
              custom="color"
              disabled={filedata?.fileLoading}
            />
          </div>
        </UniversalModal>
      </div>
    </>
  );
};

export default RiskManager;
