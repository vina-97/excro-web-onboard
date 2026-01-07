import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import QuickFinProfileCard from "../QuickFinProfileCard";
import useMerchantGenericApproval from "../../../../store/useMerchantGenericApproval";
import BreadCrumbs from "../../../../components/Layout/BreadCrumbs";
import { checkValue } from "../../../../utils";
import NoDataMessage from "../../../../components/UI/Table/NoDataMessage";
import { Tooltip } from "antd";

const Datachecks = () => {
  const { businessID } = useParams();
  const { fetchOnboardHistory, onboardHistory, setSelectedAMLRecords } =
    useMerchantGenericApproval();

  useEffect(() => {
    fetchOnboardHistory(businessID);
    setSelectedAMLRecords({});
  }, [businessID]);

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

  const ChecksData = onboardHistory?.negativeData;
  return (
    <>
      <div className="">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-5 px-4">
          <div className="w-full md:w-auto mb-2 md:mb-0">
            <BreadCrumbs />
          </div>
        </div>

        <QuickFinProfileCard data={onboardHistory} />

        <div className="w-full overflow-x-auto">
          <table className="min-w-full border border-[#7575751A] divide-y divide-gray-200">
            <thead className="bg-[#FBFBFB]">
              <tr>
                <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                  Profile Details
                </th>
                <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider w-87.5!">
                  Data Value
                </th>
                <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                  Tagged
                </th>
                <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                  Age Of The Data
                </th>
                <th className="px-4 py-4 text-left text-sm  text-primary-black-12 font-semibold tracking-wider">
                  Data Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ChecksData && ChecksData.length > 0 ? (
                ChecksData.map((item, i) => (
                  <tr
                    key={i}
                    className={`${
                      item?.data?.result?.data_category === "grey"
                        ? "bg-[#E2E8F0]"
                        : item?.data?.result?.data_category === "black"
                          ? "bg-[#FFF5F5]"
                          : "bg-[#FFFFFF]"
                    } hover:bg-gray-50`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div
                          className={`w-2 h-2 md:w-2.5 md:h-2.5 ${item?.data?.result?.data_category === "black" ? "bg-[#E11C20] border-[#C81414]" : item?.data?.result?.data_category === "grey" ? "bg-[#B9B9B9] border-[#A8A8A]" : "bg-white border border-[#DFDFDF]"} rounded-full`}
                        ></div>
                        <span className="md:text-sm">
                          {{
                            id_customer_name: "Registered Name",
                            id_email_address: "Merchant Email Address",
                            id_mobile_number: "Merchant Mobile Number",
                            cd_address: "Address",
                            cd_business_pan: "Business Pan",
                            cd_email_address: "Company Email Address",
                            cd_gst_or_tax_number: "GST/Tax Number",
                            cd_mobile_number: "Company Mobile Number",
                            cd_trade_name: "Trade/Brand Name",
                            cd_company_name: "Business Name",
                            cd_website_url: "Website URL",
                            cd_authorized_signatory: "Authorized Signatory",
                            cd_registration_number: "CIN/ID Number",
                          }[item?.field] || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 truncate max-w-50 whitespace-nowrap text-xs md:text-sm text-grey font-medium wrap-break-words">
                      <Tooltip
                        title={item?.data?.result?.search_data}
                        placement="topLeft"
                      >
                        <span
                          className={`${
                            item?.data?.field === "cd_website_url" ||
                            item?.data?.field === "id_email_address" ||
                            item?.data?.field === "cd_email_address"
                              ? ""
                              : "capitalize"
                          } wrap-break-words`}
                        >
                          {item?.data?.result?.search_data || "-"}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs capitalize md:text-sm text-grey font-medium">
                      {checkValue(item?.data?.result?.tag)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-grey font-medium">
                      {checkValue(item?.data?.result?.age)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs capitalize text-grey font-medium">
                      {checkValue(item?.data?.result?.data_category)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-2 text-center text-sm text-gray-400"
                  >
                    <NoDataMessage
                      contentOne="No Data Checks Found"
                      navigateCreate={null}
                      isNeedIcon={true}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Datachecks;
