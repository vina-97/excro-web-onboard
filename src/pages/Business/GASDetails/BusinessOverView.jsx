import { useState } from "react";

import UniversalModal from "../../../components/UI/Modal/UniversalModal";
import { capitalizeFirstLetter, checkValue } from "../../../utils";
import dayjs from "dayjs";
import { Tooltip } from "antd";
const MAGIC_6 = 6;
const MAGIC_2 = 2;
const BusinessOverView = ({ data }) => {
  console.log(data);
  const [OpenPopupModel, setOpenPopupModel] = useState(false);
  const [MccList, setMccList] = useState([]);

  const res = data?.business ?? {};

  const fields = [
    { label: "GST Number", value: res?.kyc?.gst },
    { label: "Legal Business Name", value: res.legalName },
    { label: "Trading/ Brand Name", value: res.tradeName },
    { label: "Business Type", value: res.entityType },
    { label: "Business Entity", value: res?.entity?.name },

    { label: "Business/ Individual PAN Number", value: res?.kyc?.pan },
    {
      label: "Incorporation Date",
      value:
        res?.incorporationDate &&
        dayjs(res?.incorporationDate).format("DD-MM-YYYY"),
    },

    {
      label: "Business Industry",
      value: `${res?.industry?.code} - ${res?.industry?.name}`,
    },
    { label: "Business CIN/ID Number", value: res?.kyc?.cin },

    {
      label: "Business/ Profession Description",
      value: res.description,
    },
    { label: "MCC", value: res?.mcc ? res?.mcc : "" },
  ];

  const handleShowMccList = (item) => {
    setMccList(item);
    setOpenPopupModel(true);
  };
  const handleCancel = () => {
    setOpenPopupModel(false);
  };

  console.log(MccList, "MccList");
  return (
    <div className="">
      <div className="relative mb-10">
        <h2 className="text-[#010101] font-semibold text-xl sm:text-xl relative mb-10">
          Basic Business Information
          <span className="absolute bottom-0 top-10 left-0 w-10 h-[1.5px] bg-[#5635B3]"></span>
        </h2>

        <div className="flex flex-wrap">
          {fields
            .filter(
              (field, index) =>
                index < MAGIC_6 ||
                (field.value !== null &&
                  field.value !== undefined &&
                  field.value !== "" &&
                  (!Array.isArray(field.value) || field.value.length > 0)),
            )
            .map((field, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-7">
                <p className="text-primary-black-12 text-sm sm:text-base font-normal mb-2">
                  {field.label}
                </p>
                <div className="text-base sm:text-[16px] text-[#010101] gap-2 font-semibold flex break-all capitalize">
                  {field.label === "MCC"
                    ? (() => {
                        const values = field.value || [];
                        const showValues = values.slice(0, MAGIC_2);
                        const extraCount = values.length - MAGIC_2;

                        return (
                          <>
                            {showValues.map((item, i) => (
                              <div
                                className="onboard-business-filter-tag rounded-3xl! min-w-0"
                                key={i}
                              >
                                <p className="text-[12px] truncate">
                                  <Tooltip
                                    placement="topLeft"
                                    title={item?.code + "-" + item?.description}
                                  >
                                    {item?.code + "-" + item?.description}
                                  </Tooltip>
                                </p>
                              </div>
                            ))}

                            {extraCount > 0 && (
                              <div
                                className="onboard-business-filter-tag rounded-3xl! min-w-0 bg-gray-100 cursor-pointer"
                                onClick={() => handleShowMccList(values)}
                              >
                                <p className="text-[12px] truncate">
                                  +{extraCount} more
                                </p>
                              </div>
                            )}
                          </>
                        );
                      })()
                    : checkValue(field.value)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="border-t border-[#D9D9D9] pt-10 mb-25">
        <h2 className="text-[#010101] font-semibold text-xl sm:text-xl relative mb-10">
          Address Information
          <span className="absolute bottom-0 top-10 left-0 w-10 h-[1.5px] bg-[#5635B3]"></span>
        </h2>

        <div className="mb-8">
          <p className="text-primary-black-12 text-sm sm:text-base font-normal mb-2">
            Registered Address
          </p>
          <p className="text-base sm:text-[16px] text-[#010101] font-semibold">
            {capitalizeFirstLetter(
              checkValue(res?.businessAddress?.fullAddress),
            )}
          </p>
        </div>
      </div>

      <UniversalModal
        isOpen={OpenPopupModel}
        onClose={handleCancel}
        onSubmit={null}
        fetchLoader={null}
        closeIcon={true}
        from="nobtn"
        width={600}
      >
        <div className=" p-4">
          <div className="mb-4 text-[#000011] text-sm sm:text-base font-medium">
            {/* <div className=" w-16 h-16 flex items-center justify-center">
              <ImageLoader
                imageKey="onboardBusinessSuccessToast"
                className={`w-16 h-16`}
              />
            </div> */}
            MCC
          </div>
          <div className="flex flex-wrap! gap-4">
            {MccList &&
              MccList?.map((item, i) => (
                <div
                  className="onboard-business-filter-tag rounded-3xl!  min-w-0"
                  key={i}
                >
                  <p className="text-[12px] truncate">
                    {item?.code + "-" + item?.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </UniversalModal>
    </div>
  );
};

export default BusinessOverView;
