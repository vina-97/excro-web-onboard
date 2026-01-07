import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import closeImg from "../../../../assets/images/common-icons/onboard_business_close_icon.svg";
import useMerchantGenericApproval from "../../../../store/useMerchantGenericApproval";
import BreadCrumbs from "../../../../components/Layout/BreadCrumbs";
import ImageLoader from "../../../../components/UI/ImageLoader";
import RiskScoreChart from "../RadialChart/RadialChart";
import UniversalModal from "../../../../components/UI/Modal/UniversalModal";
import PrimaryButton from "../../../../components/UI/Buttons/PrimaryButton";
import TestAreaField from "../../../../components/UI/TextAreaField";
import TertiaryButton from "../../../../components/UI/Buttons/TertiaryButton";
import FileUploader from "../../../../components/UI/fileUploader";
import { showFailure } from "../../../../utils";

const MAGIC_500 = 500;

const AMLCheckDetails = () => {
  const { businessID } = useParams();

  const [modalPopup, setModalPopup] = useState(false);

  const {
    fetchAMLSansactionDetails,
    almSansactionData,
    onboardHistory,
    decisionMaking,
    btnLoading,
  } = useMerchantGenericApproval();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location, "location");
  const [filedata, setData] = useState({
    file: null,
    error: "",
    progress: 0,
    uploading: false,
  });
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (location.state) {
      fetchAMLSansactionDetails(
        businessID,
        location?.state?.searchHistoryId,
        location?.state?.sanctionId,
      );
    }
  }, [location.state]);

  console.log(almSansactionData, "almSansactionData");
  const sactiondetails = almSansactionData?.sanction ?? {};
  console.log(sactiondetails);
  const handleClose = () => {
    setModalPopup(false);
    setReason("");
    setData({
      file: null,
      error: "",
      progress: 0,
      uploading: false,
    });
  };

  const handleSubmit = () => {
    setModalPopup(true);
  };

  const getSectionTitle = (type) => {
    switch (type) {
      case "sanctionedSecurities":
        return "Global Sanction";
      case "pep":
        return "PEP & Associates";
      case "warrantsAndCriminalEntities":
        return "Warrants & Criminal entities";
      case "sanctionCountryDataSet":
        return (
          almSansactionData?.sanction?.scoreResults?.dataSetCollection
            ?.sanctionCountryDataSet.country || "Country Dataset"
        );
      default:
        return type;
    }
  };

  const handleDecisionMaking = () => {
    if (!reason) {
      showFailure("Please enter the reason");
    } else {
      console.log("");
      const data = {
        decisionStatus: "true_match",
        sanctionId: location?.state?.sanctionId,
        remarks: reason,
        file: filedata.fileKey,
      };
      decisionMaking(businessID, data, (res) => {
        if (res) {
          fetchAMLSansactionDetails(
            businessID,
            location?.state?.searchHistoryId,
            location?.state?.sanctionId,
          );

          handleClose();
          navigate(`/merchant-generic-detail/${businessID}?tab=riskManager`);
        }
      });
    }
  };

  const onChangeSearchText = (e) => {
    setReason(e.target.value);
  };
  return (
    <>
      <div className="bg-[#F7F7F7] mb-25">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 px-4">
          {/* Breadcrumbs */}
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <BreadCrumbs />
          </div>
        </div>

        {/* Header Section with Gradient Background */}
        <div className="mb-5 rounded-2xl bg-linear-to-l from-[#F0F6FF] via-[#F1F3FF] to-[#F4ECFF] p-6">
          <div className="flex items-center justify-between gap-8">
            {/* Left Section - Business Info and Match Score */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="text-[#010101] text-xl font-semibold mb-2 capitalize">
                  {almSansactionData?.sanction?.caption}
                </div>
                <div className="text-primary-black-12 text-base font-medium">
                  Search Date: {almSansactionData.searchDate}
                </div>
              </div>

              <div className="max-w-md">
                <div className="flex justify-between items-center text-[#7E7E7E] text-sm mb-2">
                  <p>Match Score</p>
                  <p className="font-semibold">
                    {sactiondetails?.scoreResults?.matchScore ?? 0}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${sactiondetails?.scoreResults?.matchScore ?? 0}%`,
                      backgroundColor: "#483EA8",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Risk Score Chart */}
            <div className="flex items-center justify-center">
              <RiskScoreChart
                score={sactiondetails?.scoreResults?.riskScore ?? 0}
                from=""
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sactiondetails?.scoreResults?.dataSetCollection &&
            Object.entries(sactiondetails?.scoreResults?.dataSetCollection).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="w-full border border-[#E5E7EB] rounded-[11px]"
                >
                  <div className="flex justify-between items-center bg-[#F9FAFB] p-3.75 rounded-t-[10px]">
                    <p className="text-[#010101] font-semibold text-sm">
                      {getSectionTitle(key)}
                    </p>
                    <div
                      className={`${
                        value.matched ? "bg-[#F44336]" : "bg-[#4CAF50]"
                      } text-[#FFFFFF] text-sm px-5 rounded-[10px] py-2.5`}
                    >
                      {value.matched ? "MATCH FOUND" : "NO MATCH"}
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="flex flex-wrap gap-6 bg-[#fff] rounded-b-[10px] p-5 max-h-[40vh] overflow-auto">
                    {value?.dataTagCollection?.map((item, i) => (
                      <div
                        key={i}
                        className={`${
                          item.status
                            ? "border border-[#FFE4E3]"
                            : "border border-[#B9F0D7]"
                        } rounded-4xl flex flex-col justify-between items-start`}
                      >
                        <div className="flex items-center space-x-2 p-2.5]">
                          <span
                            className={`${
                              item.status
                                ? "border border-[#EDD9D9] bg-[#F44336]"
                                : "border border-[#DEEFE3] bg-[#4CAF50]"
                            } w-2 h-2 rounded-full`}
                          ></span>
                          <span className="font-medium text-[#010101] text-sm">
                            {item.customTag}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
        </div>
      </div>

      {onboardHistory?.riskManager?.aml?.status !== "completed" && (
        <div className="fixed bottom-0 right-0 bg-white p-4 flex justify-end gap-2 w-full !shadow-[0_-3px_6.6px_0_rgba(0,0,0,0.06)]!">
          <PrimaryButton
            type="primary"
            size="large"
            label={`Extract`}
            custom="color"
            onNotify={handleSubmit}
          />
        </div>
      )}
      <UniversalModal
        isOpen={modalPopup}
        onClose={handleClose}
        onSubmit={null}
        fetchLoader={null}
        closeIcon={false}
        from="nobtn"
        width={MAGIC_500}
      >
        <div className="w-full">
          <div className="w-full">
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleClose}
                className="flex items-center border] border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer"
              >
                <img src={closeImg} alt="close" />
              </button>
            </div>
          </div>
          <div className="text-center w-full">
            <div className="flex justify-center mb-4">
              <div className=" w-16 h-16 flex items-center justify-center">
                <ImageLoader
                  imageKey={"onboardBusinessSuccessToast"}
                  className={"w-10 h-10"}
                />
              </div>
            </div>
            <p className="text-[#101828]  font-medium text-2xl mb-4">
              AML Checks
            </p>
          </div>
          <div className="py-4 px-3">
            <div className="w-full">
              <TestAreaField
                placeholder={` `}
                icon={false}
                label="Approve Reason*"
                className=""
                value={reason}
                handleChange={onChangeSearchText}
              />
            </div>

            <div className="mt-4.5 mb-4">
              <p className="text-gray-500 text-xs sm:text-sm font-normal mb-2 truncate">
                Upload Document
              </p>
              <div className="">
                <FileUploader
                  setData={setData}
                  data={filedata}
                  id={businessID}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <TertiaryButton
                type="default"
                size="large"
                label="Back"
                onNotify={handleClose}
              />

              <PrimaryButton
                type="primary"
                size="large"
                label={`Submit`}
                onNotify={handleDecisionMaking}
                custom="color"
                disabled={btnLoading}
              />
            </div>
          </div>
        </div>
      </UniversalModal>
    </>
  );
};

export default AMLCheckDetails;
