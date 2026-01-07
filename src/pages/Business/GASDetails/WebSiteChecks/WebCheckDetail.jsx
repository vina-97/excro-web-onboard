import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import useMerchantGenericApproval from "../../../../store/useMerchantGenericApproval";
import BreadCrumbs from "../../../../components/Layout/BreadCrumbs";
import ImageLoader from "../../../../components/UI/ImageLoader";
import RiskScoreChart from "../RadialChart/RadialChart";
import UniversalModal from "../../../../components/UI/Modal/UniversalModal";
import closeImg from "../../../../assets/images/common-icons/onboard_business_close_icon.svg";
import {
  checkValue,
  formatToReadableDate,
  setStatusColorText,
  showFailure,
  showSuccess,
} from "../../../../utils";

const two = 2;
const MAGIC_600 = 600;

const MAGIC_2000 = 2000;
const WebCheckDetail = () => {
  const { businessID } = useParams();
  const [tooltipCopy, setTooltipCopy] = useState("");
  const [cashIdCopy, setCashIdCopy] = useState("");
  const [modalPopup, setModalPopup] = useState(false);
  const [tooltipDownload, setTooltipDownload] = useState("");

  const { fetchOnboardHistory, onboardHistory, setSelectedAMLRecords } =
    useMerchantGenericApproval();

  useEffect(() => {
    fetchOnboardHistory(businessID);
    setSelectedAMLRecords({});
  }, [businessID]);

  const webCrawl = onboardHistory?.webCrawl?.data;
  console.log(webCrawl, "webCrawl");
  const sections = [];

  if (onboardHistory?.business?.entityType === "individual") {
    sections.push({ id: "individual-info", title: "Business Information" });
  } else {
    sections.push({ id: "business-info", title: "Business Information" });
  }

  sections.push(
    { id: "address-info", title: "Address Information" },
    { id: "business-commitment", title: "Business Commitment" },
    { id: "authorized-details", title: "Authorized Signatory Details" },
  );

  const CheckStatus = ["Result Type", "Crawling Status", "Risk Status"];

  const details = [
    {
      label: "Result Type",
      value: !webCrawl?.parentCaseId ? "Initial" : "ODD",
    },
    {
      label: "Crawl Type",
      value: checkValue(webCrawl?.crawling_type),
    },
    {
      label: "Crawling Status",
      value: webCrawl?.status,
    },
    {
      label: "Percantage",
      value: webCrawl?.percentage ? webCrawl?.percentage + "%" : "-",
    },
    {
      label: "Risk Status",
      value: webCrawl?.risk_status,
    },
    {
      label: "Start date",
      value: checkValue(
        webCrawl?.start_time ? formatToReadableDate(webCrawl?.start_time) : "",
      ),
    },
    {
      label: "End date",
      value: checkValue(
        webCrawl?.completed_time
          ? formatToReadableDate(webCrawl?.completed_time)
          : "",
      ),
    },
  ];

  const handleMenuClick = () => {
    setModalPopup(true);
  };

  // Download JSON file
  const handleDownload = (item) => {
    const blob = new Blob([JSON.stringify(item, null, two)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "webcrawling.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (item) => {
    setTooltipCopy("Copied!");
    setTimeout(() => setTooltipCopy(""), MAGIC_2000);

    const text = JSON.stringify(item, null, two);

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback (execCommand)
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      showSuccess("JSON copied successfully");
      return true;
    } catch (err) {
      console.error("Copy failed", err);
      showFailure("Copy failed");
      return false;
    }
  };

  const handleCashIdCopy = async (id) => {
    const textToCopy = id;

    setCashIdCopy("Copied!");
    setTimeout(() => setCashIdCopy(""), MAGIC_2000);

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        // ✅ Works on localhost + HTTPS
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // ✅ Fallback for HTTP
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      showSuccess("Case ID copied successfully");
      return true;
    } catch (error) {
      console.error("Copy failed", error);
      showFailure("Copy failed");
      return false;
    }
  };

  const handleClose = () => {
    setModalPopup(false);
  };

  const getTitle = (key) => {
    const titleMap = {
      highly_trans_mcc: "Highly Transacting MCCs",
      business_classification: "Business Classification",
      trade_name: "Trade Name",
      social_media_presence: "Social Media Presence",
      social_media_followers: "Social Media Followers",
      terms_condition: "Terms and Condition",
      privacy: "Privacy Policy",
      shipping: "Shipping Policy",
      refund: "Refund Policy",
      return: "Return Policy",
      email: "Email Found",
      phone: "Phone Found",
      medicine: "Pharmaceutical Risk",
      games: "Gaming / Gambling Association",
      prohibited: "Prohibited Business Research",
      pornography: "Pornographical Research",
      website_redirection: "Website Redirection",
      website_traffic: "Website Traffic",
      broken_link: "Broken/Deadlink Research",
      ssl: "SSL Certificate",
      domain_age: "Website Age",
      domain_expiry: "Domain Expiry Period Nearing",
      untrusted: "Untrusted Downloads",
      spam: "Spam Checks",
      malware: "Malware Checks",
      mcc_risk: "MCC Risk Classification",
      sensitive: "Sensitive Data Prompt",
      website_readiness: "Website Readiness",
      content_quality: "Content Quality Research",
      nd_website: "Website",
      nd_trade_name: "Business Info",
      nd_email: "Business Email Info",
      nd_phone: "Business Phone Info",
      nd_gst: "GST Number Info",
      nd_registration: "Registration Number Info",
    };
    return (
      titleMap[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Function to categorize items
  const categorizeItems = () => {
    const categories = {
      "Business Risk ": [
        "highly_trans_mcc",
        "trade_name",
        "social_media_presence",
        "social_media_followers",
        "business_classification",
        "mcc_risk",
      ],
      "Security Risk": [
        "domain_age",
        "website_age",
        "ssl",
        "untrusted",
        "spam",
        "malware",
        "website_traffic",
        "domain_expiry",
        "sensitive",
      ],
      "Content Risk": [
        "prohibited",
        "website_redirection",
        "medicine",
        "pornography",
        "broken_link",
        "games",
        "website_readiness",
        "content_quality",
      ],
      "Website Compliance": [
        "terms_condition",
        "phone",
        "privacy",
        "email",
        "shipping",
        "refund",
        "return",
      ],
      "Negative Profile Indicator": [
        "nd_website",
        "nd_trade_name",
        "nd_phone",
        "nd_gst",
        "nd_registration",
        "nd_email",
      ],
    };

    const result = {};
    Object.keys(categories).forEach((category) => {
      result[category] = categories[category].filter(
        (key) => webCrawl?.risk_indicator?.[key],
      );
    });

    return result;
  };

  const categories = categorizeItems();
  console.log(categories);

  return (
    <>
      <div className="bg-[#F7F7F7]">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 px-4">
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <BreadCrumbs />
          </div>
        </div>

        <div className="mb-5 flex justify-center w-full">
          <div className="w-full max-w-full pl-5 rounded-2xl bg-linear-to-l from-[#F0F6FF] via-[#F1F3FF] to-[#F4ECFF]">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="w-full lg:w-[80%] flex flex-col sm:flex-row items-start gap-4 mt-5">
                {/* Business Info */}
                <div className="w-full">
                  <div className="flex items-center mb-3.5">
                    <div className="text-[#010101] text-xl font-semibold capitalize">
                      {webCrawl?.merchant?.trade_name ?? ""}
                    </div>
                    <div
                      className="border bg-[#FFFFFF] ml-2.5 border-[#E7E7E7] rounded-sm py-2 pl-3 pr-2 text-[#36A008] text-sm font-medium cursor-pointer"
                      onClick={() => handleMenuClick("json")}
                    >{`{/} JSON`}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#5635B3] underline text-sm sm:text-base font-medium">
                      <a
                        href={webCrawl?.website_actual_url || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {webCrawl?.website_actual_url || ""}
                      </a>
                    </div>
                    <div className="ml-5 text-[#010101] text-sm sm:text-base font-medium flex items-center">
                      <div> Case ID: {webCrawl?.caseId}</div>
                      <div
                        className="relative ml-5 cursor-pointer"
                        onMouseEnter={() => setCashIdCopy("Copy")}
                        onMouseLeave={() => {
                          if (cashIdCopy !== "Copied!") {
                            setCashIdCopy("");
                          }
                        }}
                      >
                        <ImageLoader
                          imageKey="onboardBusinessCopy"
                          className="w-5 h-5 cursor-pointer invert brightness-200"
                          onClick={() => handleCashIdCopy(webCrawl?.caseId)}
                        />
                        {cashIdCopy && (
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            {cashIdCopy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
                    {details?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 w-full"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-grey text-xs font-medium mb-1">
                            {item.label}
                          </span>
                          <span
                            className={`${CheckStatus.includes(item.label) ? setStatusColorText(item.value) : "text-[#010101]"} capitalize text-sm font-semibold truncate max-w-full whitespace-nowrap`}
                          >
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk Score Section: 20% width */}
              <div className="flex items-center justify-center">
                <RiskScoreChart
                  score={webCrawl?.risk_indicator?.risk_score || 0}
                  webCrawl={webCrawl}
                  from="child"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit">
          {Object.entries(categories).map(([categoryName, items]) => (
            <div
              key={categoryName}
              className="w-full border border-[#E5E7EB] rounded-[11px]"
            >
              <div className="text-[#010101] text-lg sm:text-base font-semibold p-3.75 border-b border-[#E5E7EB] rounded-t-[10px] bg-[#f7f7f7]">
                {categoryName}
              </div>

              <div className="grid grid-cols-1 gap-6 bg-[#fff] rounded-b-[10px] p-5 max-h-[40vh] overflow-auto">
                {items.map((key) => {
                  const item = webCrawl?.risk_indicator[key];
                  const isHighRisk = 2;
                  const isNoRisk = 0;

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border ${
                        item.status === isHighRisk
                          ? "border border-[#EDD9D9] bg-[#FFF5F5]"
                          : item.status === isNoRisk
                            ? "border border-[#DEEFE3] bg-[#F2FEF2]"
                            : "bg-[#fff7ee] border border-[#ffe7ca]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mr-2 shrink-0">
                            <ImageLoader
                              imageKey={
                                item.status === isNoRisk
                                  ? "onboardBusinessSuccessToast"
                                  : "onboardBusinessDeniedIcon"
                              }
                              className={
                                item.status === isNoRisk ? "w-6 h-6" : "w-4 h-4"
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#010101] text-base sm:text-sm font-semibold truncate mb-5">
                              {getTitle(key)}
                            </p>
                            <p className="text-[#606060] min-w-0! text-base sm:text-sm truncate overflow-hidden whitespace-nowrap">
                              {item.data}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`py-2.5 px-4.5 font-medium rounded-3xl min-w-0 text-xs ${
                            item.status === isHighRisk
                              ? "border border-[#EDD9D9] text-[#E11C20]"
                              : item.status === isNoRisk
                                ? "border border-[#DEEFE3] text-[#34A853]"
                                : "border border-[#ffe7ca] text-orange-400"
                          }`}
                        >
                          {item.status === isHighRisk
                            ? "High Risk"
                            : item.status === isNoRisk
                              ? "No Risk"
                              : "Medium Risk"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <UniversalModal
        isOpen={modalPopup}
        onClose={handleClose}
        onSubmit={null}
        fetchLoader={null}
        closeIcon={false}
        from="nobtn"
        width={MAGIC_600}
      >
        <div className="w-full">
          <div className="w-full flex justify-end">
            <div className="flex items-center gap-4">
              <div
                className="relative"
                onMouseEnter={() => setTooltipDownload("Download")}
                onMouseLeave={() => setTooltipDownload("")}
              >
                <ImageLoader
                  imageKey="onboardBusinessDownload"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleDownload(onboardHistory?.webCrawl)}
                />
                {(tooltipDownload || tooltipCopy === "") && tooltipDownload && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {tooltipDownload}
                  </span>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setTooltipCopy("Copy")}
                onMouseLeave={() => {
                  if (tooltipCopy !== "Copied!") {
                    setTooltipCopy("");
                  }
                }}
              >
                <ImageLoader
                  imageKey="onboardBusinessCopy"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleCopy(onboardHistory?.webCrawl)}
                />
                {tooltipCopy && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {tooltipCopy}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="flex items-center border border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-3 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer"
              >
                <img src={closeImg} alt="close" />
              </button>
            </div>
          </div>
          <div className="p-4 h-[40vh] overflow-auto">
            <pre className="rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(onboardHistory?.webCrawl ?? "", null, two)}
            </pre>
          </div>
        </div>
      </UniversalModal>
    </>
  );
};

export default WebCheckDetail;
