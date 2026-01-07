import React from "react";
import nodataicon from "../../../assets/images/common-icons/nodata_icon.svg";
// import { Button } from 'antd';
// import { Plus } from 'lucide-react';
import PrimaryButton from "../Buttons/PrimaryButton";

const NoDataMessage = ({
  contentOne,
  contentTwo,
  buttonText,
  isNeedIcon,
  width = "180px",
  height = "180px",
}) => {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="text-center w-full max-w-md flex flex-col items-center">
        {isNeedIcon && (
          <div className={`w-[${width}] h-[${height}]`}>
            <img
              src={nodataicon}
              alt="background"
              className="mx-auto w-full h-full object-contain"
            />
          </div>
        )}

        <h2 className=" text-xl leading-[20px] text-[#010101] font-semibold mb-[10px]">
          {contentOne}
        </h2>

        <p className="text-[13px] leading-[20px] font-normal text-primary-black-12 mb-[24px]">
          {contentTwo}
        </p>

        {buttonText && <PrimaryButton label={buttonText} iconLeft="+" />}
      </div>
    </div>
  );
};

export default NoDataMessage;
