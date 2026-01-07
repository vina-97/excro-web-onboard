import React from "react";
import { Button } from "antd";
import SortIcon from "../../../assets/images/common-icons/filter-lines.svg";

const SecondaryButton = ({
  label,
  onNotify,
  iconLeft = null,
  iconRight = null,
  className = "",
  notifyParams = null,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      onClick={() => onNotify(notifyParams)}
      type="default"
      // className={`${className} !border-none text-base font-bold text-secondary-black !bg-white duration-200`}
      className={`${className} !border-none !bg-[#F3F5F8] !text-[#231F20] !font-medium !text-[13px] !leading-[13px] duration-200 !py-[14px] !px-[20px]`}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {label === "Filter" && (
        <img src={SortIcon} alt="filter" className="filter-icon" />
      )}

      <span className={className}>{label}</span>
      {iconRight && <span>{iconRight}</span>}
    </Button>
  );
};

export default SecondaryButton;
