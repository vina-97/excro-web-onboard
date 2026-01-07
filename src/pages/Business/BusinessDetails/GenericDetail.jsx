import React, { useEffect, useState } from "react";
import { TimeInfo } from "../../../assets/assets";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import UniversalDrawer from "../../../components/UI/Drawer/UniversalDrawer";
import OnboardingHistory from "../GASDetails/OnboardingHistory";
import {
  checkValue,
  customStatusStyle,
  setKeyNumber,
  showFailure,
} from "../../../utils";
import ImageLoader from "../../../components/UI/ImageLoader";
import useMerchantGenericApproval from "../../../store/useMerchantGenericApproval";
import BreadCrumbs from "../../../components/Layout/BreadCrumbs";
import dayjs from "dayjs";
import BusinessOverView from "../GASDetails/BusinessOverView";
import TertiaryButton from "../../../components/UI/Buttons/TertiaryButton";
import PrimaryButton from "../../../components/UI/Buttons/PrimaryButton";
import KycApprovalDetailsGas from "../GASDetails/KycApprovalDetailsGas";
import RiskManager from "../GASDetails/RiskManager";
import QuickFinProfileCard from "../GASDetails/QuickFinProfileCard";
import UniversalModal from "../../../components/UI/Modal/UniversalModal";
import TestAreaField from "../../../components/UI/TextAreaField";
import LottieLoader from "../../../components/UI/LottieUnique/LottieLoader";
import ApiCall from "../../../utils/ApiCall";

import { AsyncPaginate } from "react-select-async-paginate";
import AntdSelect from "../../../components/UI/AntdSelect";
import AntdInput from "../../../components/UI/AntdInput";

const one = 1;
const three = 3;
const four = 4;
const LIMIT = 10;
const MerchantGenericDetail = () => {
  const { businessID } = useParams();
  const {
    fetchOnboardHistory,
    onboardHistory,
    isLoading,
    setSelectedAMLRecords,
    approvalReject,
  } = useMerchantGenericApproval();
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [selectedaccountType, setSelectedaccountType] = useState(null);
  const [selectedNodalaccount, setSelectedNodalaccount] = useState(null);
  const [bankLimit, setBankLimit] = useState("");

  const accountType = [
    { value: "isConnectedBanking", label: "Connected Banking" },
    { value: "escrow", label: "Escrow" },
  ];

  const mapResellersToOptions = (resellers = []) =>
    resellers.map((r) => ({
      value: r.reseller_id,
      label: r.reseller_name,
    }));

  const mapNodalAccountsToOptions = (resellers = []) =>
    resellers.map((r) => ({
      value: r.account_id,
      label: r.name,
    }));

  const loadResellers = async (search, loadedOptions, { page }) => {
    const currentPage = page || 1;

    return new Promise((resolve) => {
      ApiCall.get(
        `/admin/reseller/list?page=${currentPage}&limit=10${
          search ? `&search_term=${search}` : ""
        }`,
        (response) => {
          console.log(response, "ins");

          if (!response?.success) {
            resolve({
              options: [],
              hasMore: false,
              additional: { page: currentPage },
            });
            return;
          }

          console.log(response, "response");
          const newOptions = mapResellersToOptions(
            response.data?.resellers || [],
          );

          resolve({
            options: newOptions,
            hasMore: newOptions.length === LIMIT,
            additional: {
              page: currentPage + 1,
            },
          });
        },
      );
    });
  };

  const loadNodalAccount = async (search, loadedOptions, { page }) => {
    const currentPage = page || 1;

    let queryParams = "";
    if (selectedReseller.value || selectedReseller) {
      queryParams += `&reseller.id=${selectedReseller?.value || selectedReseller}`;
    } else {
      queryParams += `&is_reseller=false`;
    }

    return new Promise((resolve) => {
      ApiCall.get(
        `/admin/nodal/list?page=${currentPage}&isConnectedBankingEnabled=false&status=active&limit=10${queryParams}`,
        (response) => {
          if (!response?.success) {
            resolve({
              options: [],
              hasMore: false,
              additional: { page: currentPage },
            });
            return;
          }

          console.log(response, "response");
          const newOptions = mapNodalAccountsToOptions(
            response.data?.accounts || [],
          );

          resolve({
            options: newOptions,
            hasMore: newOptions.length === LIMIT,
            additional: {
              page: currentPage + 1,
            },
          });
        },
      );
    });
  };

  const tabList = [
    {
      verifiedIcon: "BusinessOnboardVerifiedIcon",
      pendingIcon: "BusinessOnboardPendingkyc",
      label: "Business Overview",
      status: "business",
      number: 1,
    },
    // {
    //   verifiedIcon: "BusinessOnboardVerifiedIcon",
    //   pendingIcon: "BusinessOnboardPendingkyc",
    //   label: "Bank Information",
    //   status: "bankInformation",
    //   number: 2,
    // },
    {
      verifiedIcon: "BusinessOnboardVerifiedIcon",
      pendingIcon: "BusinessOnboardPendingkyc",
      label: "KYC Details",
      status: "kyc",
      number: 3,
    },
    {
      verifiedIcon: "BusinessOnboardVerifiedIcon",
      pendingIcon: "BusinessOnboardPendingkyc",
      label: "Financial Risk Manager",
      status: "riskManager",
      number: 4,
    },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const getSearch = params.get("tab");
  const [tabKey, setTabKey] = useState(
    tabList && tabList.length > 0 ? setKeyNumber(getSearch) : null,
  );
  const [viewSignatory, setViewSignatory] = useState(false);
  const [approveReject, setApproveReject] = useState(false);
  const [approveApproveRejectName, setApproveApproveRejectName] = useState("");
  const [reason, setReason] = useState("");
  const [openOnboardHistory, setOpenOnboardHistory] = useState(false);

  useEffect(() => {
    console.log(params.get("tab"));
  }, []);
  useEffect(() => {
    fetchOnboardHistory(businessID);
    setSelectedAMLRecords({});
  }, [businessID]);

  console.log(onboardHistory, "hhhhhhh");

  const openHistoryDrawer = () => {
    setOpenOnboardHistory(true);
  };
  const closeHistoryDrawer = () => {
    setOpenOnboardHistory(false);
  };

  const renderComponent = (key) => {
    switch (key) {
      case one:
        return <BusinessOverView data={onboardHistory} />;

      case three:
        return <KycApprovalDetailsGas Kycdata={onboardHistory} />;
      case four:
        return <RiskManager data={onboardHistory} businessID={businessID} />;
      default:
        return null;
    }
  };
  const handleModalSignatory = () => {
    setViewSignatory(false);
  };
  const handleSignatory = () => {
    setViewSignatory(true);
  };

  const handleSubmit = (item) => {
    setApproveReject(true);
    setApproveApproveRejectName(item);
  };

  const handleCancel = () => {
    setApproveReject(false);
    setApproveApproveRejectName("");
    setReason("");
  };

  const handleChange = (e) => {
    setReason(e.target.value);
  };
  // const getprimaryAccount = onboardHistory?.banks?.find((x) => x.isPrimary);
  const approveRejectList = [
    {
      name: "Business Information",
      status:
        onboardHistory?.business ||
        onboardHistory?.onboarding?.status === "completed"
          ? true
          : false,
      date: onboardHistory?.onboarding?.startedAt ?? "-",
    },

    // {
    //   name: "Bank Information",
    //   status: getprimaryAccount?.isVerified,
    //   date: getprimaryAccount?.verficationDate ?? "-",
    // },
    {
      name: "KYC Details",
      status:
        onboardHistory?.onboarding?.status === "completed" ||
        onboardHistory?.onboarding?.status === "riskManager"
          ? true
          : false,
      date: onboardHistory?.kycInfo?.date ?? "-",
    },
    {
      name: "Data Checks",
      status:
        onboardHistory?.riskManager?.negativeData?.status === "completed"
          ? true
          : false,
      date: onboardHistory?.riskManager?.negativeData?.completedAt ?? "-",
    },
    {
      name: "Website Check",
      status:
        onboardHistory?.riskManager?.webCrawling?.status === "completed"
          ? true
          : false,
      date: onboardHistory?.riskManager?.webCrawling?.completedAt ?? "-",
    },
    {
      name: "AML Checks",
      status:
        onboardHistory?.riskManager?.aml?.status === "completed" ? true : false,
      date: onboardHistory?.riskManager?.aml?.completedAt ?? "-",
    },
    {
      name: "Field Verification",
      status:
        onboardHistory?.riskManager?.fieldVerification?.status === "completed"
          ? true
          : false,
      date: onboardHistory?.riskManager?.fieldVerification?.completedAt ?? "-",
    },
  ];

  const validateApproveForm = ({
    reason,
    selectedReseller,
    selectedaccountType,
    selectedNodalaccount,
    bankLimit,
  }) => {
    if (!reason?.trim()) {
      return "Please enter the reason";
    }

    if (approveApproveRejectName === "Approve") {
      if (!selectedReseller) {
        return "Please select reseller field";
      }

      if (!selectedaccountType?.accountType) {
        return "Please select account type";
      }

      if (
        selectedaccountType.accountType === "escrow" &&
        !selectedNodalaccount
      ) {
        return "Please select escrow Account";
      }

      if (selectedaccountType.accountType === "isConnectedBanking") {
        if (!bankLimit) {
          return "Please enter bank limit";
        }

        if (Number(bankLimit) <= 0) {
          return "Bank limit must be greater than 0";
        }
      }
    }

    return null;
  };

  const handleApproveSubmit = () => {
    const errorMessage = validateApproveForm({
      reason,
      selectedReseller,
      selectedaccountType,
      selectedNodalaccount,
      bankLimit,
    });

    if (errorMessage) {
      showFailure(errorMessage);
      return;
    }

    const payload = {
      status: approveApproveRejectName === "Approve" ? "approved" : "rejected",
      reason: reason.trim(),
    };

    if (approveApproveRejectName === "Approve") {
      payload.reseller_id = selectedReseller?.value ?? selectedReseller;
    }

    if (selectedaccountType?.accountType === "escrow") {
      payload.account_id = selectedNodalaccount?.value ?? selectedNodalaccount;
    }

    if (selectedaccountType?.accountType === "isConnectedBanking") {
      payload.isConnectedBanking = true;
      payload.connectedBankingLimit = Number(bankLimit);
    }

    approvalReject(businessID, payload, (res) => {
      if (res) {
        fetchOnboardHistory(businessID);
        handleCancel();
      }
    });
  };

  const handleChangeInput = (e) => {
    console.log(e, "ds");

    const { value } = e;
    setBankLimit(value);
  };

  const handleTabChange = (tab) => {
    console.log(tab);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tab.status); // ✅ update tab number in query

    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });

    setTabKey(Number(tab?.number)); // ✅ update state
  };

  const allChecked = approveRejectList.every((item) => item.status === true);
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <LottieLoader
        lottieKey="loaderIcon"
        className="w-37.5 flex justify-center items-center h-screen"
      />
    </div>
  ) : (
    <>
      <div className="">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 px-4">
          {/* Breadcrumbs */}
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <BreadCrumbs />
          </div>

          {/* Buttons and Status */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 flex items-center"
              onClick={openHistoryDrawer}
            >
              <img
                src={TimeInfo}
                alt="timeInfo"
                className="w-5 h-5 cursor-pointer"
              />
            </button>
            <div className={customStatusStyle(onboardHistory?.gasInfo?.status)}>
              {checkValue(onboardHistory?.gasInfo?.status)}
            </div>
          </div>
        </div>

        <QuickFinProfileCard data={onboardHistory} />

        {["approved", "rejected"].includes(onboardHistory?.gasInfo?.status) && (
          <div
            className={`${onboardHistory?.gasInfo?.status === "rejected" ? "bg-[#FAE6E6]" : "bg-[#DEEFE3]"} p-4 sm:p-5 md:p-6 rounded-xl mb-3`}
          >
            <p className="text-[#010101] text-base sm:text-lg font-semibold">
              {onboardHistory?.gasInfo?.status === "approved"
                ? "Note:"
                : "Reason:"}

              <span className="text-primary-black-12 text-sm sm:text-base font-normal leading-relaxed mx-1 capitalize">
                {onboardHistory?.gasInfo?.reason ?? "-"}
              </span>
            </p>
          </div>
        )}

        {/* Main Content */}

        <div className="mt-6 border-b border-[#D9D9D9] overflow-x-auto">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-12.5 w-full sm:w-auto">
            {tabList &&
              tabList.map((tab, t) => {
                const currentStatus = onboardHistory?.onboarding?.status;

                let iconKey;

                if (currentStatus === "completed") {
                  // ✅ All verified when completed
                  iconKey = tab.verifiedIcon;
                } else {
                  // Find the index of the current status tab
                  const currentIndex = tabList.findIndex(
                    (item) => item.status === currentStatus,
                  );
                  console.log(currentIndex);
                  const MAGIC_1 = -1;
                  if (currentIndex === MAGIC_1) {
                    // default all pending if status not found
                    iconKey = tab.pendingIcon;
                  } else if (t < currentIndex) {
                    // ✅ Tabs before current status
                    iconKey = tab.verifiedIcon;
                  } else if (t === currentIndex) {
                    // 🕓 Current tab (matching status)
                    iconKey = tab.pendingIcon;
                  } else {
                    // ⏳ Tabs after current status
                    iconKey = tab.pendingIcon;
                  }
                }
                const isCurrentTab =
                  Number(tab.number) === Number(tabKey) &&
                  getSearch === tab.status;

                return (
                  <div
                    key={t}
                    className={`flex items-center cursor-pointer pb-4 ${
                      isCurrentTab ? "border-b-2 border-[#5635B3]" : ""
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    <ImageLoader
                      imageKey={iconKey}
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0"
                    />
                    <p
                      className={`${
                        isCurrentTab
                          ? "text-[#5635B3] font-semibold text-sm sm:text-base"
                          : "text-grey font-medium text-sm sm:text-base"
                      } whitespace-nowrap`}
                    >
                      {tab.label}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="mt-7.5">{renderComponent(tabKey)}</div>
      </div>

      <UniversalDrawer
        title="Timeline"
        open={openOnboardHistory}
        onClose={closeHistoryDrawer}
        size="large"
      >
        <OnboardingHistory data={onboardHistory || []} />
      </UniversalDrawer>

      <UniversalDrawer
        title="Authorised Signatory"
        open={viewSignatory}
        onClose={handleModalSignatory}
        size="large"
      >
        <div className="mb-24">
          <div className="flex flex-wrap gap-6">
            {onboardHistory?.authorizedSignatory?.length > 0 ? (
              onboardHistory.authorizedSignatory?.map((field, index) => (
                <div key={index} className="w-full bg-[#F1F3FF] p-4 rounded-lg">
                  <div className="w-full flex flex-wrap ">
                    <div className="w-full flex justify-between items-center">
                      <div className="w-full flex">
                        <div>
                          <ImageLoader
                            imageKey={"onboardBusinessfileIcon"}
                            className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0 mt-1"
                          />
                        </div>
                        <div>
                          <p className=" text-[#010101] font-semibold text-base mb-2 truncate capitalize">
                            {field.name}
                          </p>

                          <p
                            className={`flex items-center font-medium text-sm text-[#341C6E] uppercase`}
                          >
                            <span className="truncate"> {field.pan}</span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex bg-[#fff] p-1.5 rounded-sm text-sm font-semibold ${
                          field.isVerified ? "text-[#34A853]" : "text-[#C50A0A]"
                        }`}
                      >
                        <ImageLoader
                          imageKey={
                            field.isVerified
                              ? "onboardBusinessVerifiedIcon"
                              : "onboardBusinessMismatchedIcon"
                          }
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2 shrink-0"
                        />
                        {field.isVerified ? "Verified" : "Mismatched"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-[40vh] w-full text-center text-gray-500">
                No authorised signatories added yet.
              </div>
            )}
          </div>
        </div>
      </UniversalDrawer>

      <div
        className={`${(Number(tabKey) === three || onboardHistory?.gasInfo?.status !== "approved") && "p-4"} fixed bottom-0 right-0 bg-white flex justify-end gap-2 w-full shadow-[0_-3px_6.6px_0_rgba(0,0,0,0.06)]!`}
      >
        {Number(tabKey) === three && (
          <div
            className="text-[#5635B3] text-[15px] font-semibold underline py-3.5 cursor-pointer"
            onClick={handleSignatory}
          >
            See Authorised Signatory
          </div>
        )}

        {onboardHistory?.gasInfo?.status !== "approved" && (
          <>
            <TertiaryButton
              type="default"
              size="large"
              label="Reject"
              onNotify={() => handleSubmit("Reject")}
            />

            <PrimaryButton
              type="primary"
              size="large"
              label={`Approve`}
              custom="color"
              onNotify={() => handleSubmit("Approve")}
            />
          </>
        )}
      </div>

      <UniversalModal
        isOpen={approveReject}
        onClose={handleCancel}
        onSubmit={null}
        fetchLoader={null}
        closeIcon={true}
        from="nobtn"
        width={700}
      >
        <div className="text-center p-4">
          <div className="flex justify-center mb-4">
            <div className=" w-16 h-16 flex items-center justify-center">
              <ImageLoader
                imageKey={`${allChecked ? "onboardBusinessSuccessToast" : "onboardBusinessConfirm"}`}
                className={`w-16 h-16`}
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {`Business ${
              approveApproveRejectName === "Approve" ? "Approval" : "Rejection"
            } Summary`}
          </h2>
          <p className="text-gray-600 mb-6">Business ID: {businessID}</p>
        </div>

        <div>
          {approveRejectList &&
            approveRejectList?.length > 0 &&
            approveRejectList.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`flex justify-between items-center ${item.status ? "border border-[#B9F8CF] bg-[#EFFDF4]" : "border border-[#FFE7CA] bg-[#FFF7EE]"} py-3.25 px-3.75 rounded-[10px] mb-4.5`}
                >
                  <div className="flex">
                    <div>
                      <ImageLoader
                        imageKey={
                          item.status
                            ? "BusinessOnboardVerifiedIcon"
                            : "BusinessOnboardPendingkyc"
                        }
                        className={`w-5 h-5`}
                      />
                    </div>
                    <div className="ml-1.25 text-primary-black-15 font-semibold text-sm">
                      {item.name}
                    </div>
                  </div>
                  {item.status ? (
                    <div className="text-primary-black-12 text-[13px]">
                      {` Updated on ${dayjs(item.date).format("DD MMM YYYY, hh:mm A")}`}
                    </div>
                  ) : (
                    <div className="text-[#F8A33A] text-[12px] border border-[#FFCD90] bg-[#FFECD6] rounded-2xl py-.5 px-2.5">
                      Pending
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div className="mb-7.5">
          {approveApproveRejectName === "Approve" && (
            <>
              <div className="mb-2">
                <p className="text-[#40444C] font-medium text-sm mb-2.5!">
                  Source From*
                </p>
                <AsyncPaginate
                  value={selectedReseller}
                  loadOptions={loadResellers}
                  onChange={(option) => {
                    setSelectedReseller(option);
                    setSelectedaccountType(null);
                    setSelectedNodalaccount(null);
                  }}
                  placeholder="Select reseller"
                  debounceTimeout={300}
                  additional={{
                    page: 1,
                  }}
                  isClearable
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  classNamePrefix="custom-select"
                  defaultOptions
                  cacheUniqs={[]}
                />
              </div>

              <div className="mb-2">
                <AntdSelect
                  label="Account Type*"
                  placeholder="Select account type"
                  value={accountType.find(
                    (item) => item.value === selectedaccountType?.accountType,
                  )}
                  options={accountType}
                  onValueChange={(option) => {
                    setSelectedaccountType({
                      ...selectedaccountType,
                      accountType: option.value,
                    });
                    setSelectedNodalaccount(
                      option.value === "isConnectedBanking"
                        ? null
                        : selectedNodalaccount,
                    );
                  }}
                />
              </div>
              {selectedaccountType?.accountType === "escrow" && (
                <div className="mb-2">
                  <p className="text-[#40444C] font-medium text-sm mb-2.5!">
                    Account*
                  </p>
                  <AsyncPaginate
                    value={selectedNodalaccount}
                    loadOptions={loadNodalAccount}
                    onChange={(option) => {
                      setSelectedNodalaccount(option);
                    }}
                    placeholder="Select account"
                    debounceTimeout={300}
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    styles={{
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    classNamePrefix="custom-select"
                    defaultOptions
                    cacheUniqs={[]}
                  />
                </div>
              )}
              {selectedaccountType?.accountType === "isConnectedBanking" && (
                <div className="mb-2">
                  <AntdInput
                    label="Bank Limit*"
                    placeholder="Enter bank limit"
                    customstyle="w-full"
                    name="bankLimit"
                    value={bankLimit}
                    onValueChange={(e) => handleChangeInput(e)}
                  />
                </div>
              )}
            </>
          )}
          <TestAreaField
            placeholder={`Reason `}
            icon={false}
            label={
              approveApproveRejectName === "Approve"
                ? "Note for Approval*"
                : "Note for Rejection*"
            }
            className=""
            value={reason}
            handleChange={(e) => handleChange(e)}
          />
        </div>

        <div className=" flex justify-end gap-2">
          <TertiaryButton
            type="default"
            size="large"
            label="Cancel"
            onNotify={handleCancel}
          />

          <PrimaryButton
            type="primary"
            size="large"
            label={approveApproveRejectName}
            custom="color"
            onNotify={handleApproveSubmit}
            disabled={isLoading}
          />
        </div>
      </UniversalModal>
    </>
  );
};

export default MerchantGenericDetail;
