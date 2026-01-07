import React from "react";
import { Button } from "antd";

const PrimaryButton = ({
  label,
  custom,
  onNotify,
  iconLeft = null,
  iconRight = null,
  className = "",
  notifyParams = null,
  ...rest
}) => {
  const handleClick = () => {
    if (typeof onNotify === "function") {
      onNotify(notifyParams); // ✅ Call your custom logic
    }
    // ✅ Do NOT prevent default or stop propagation – let form submission happen naturally
  };
  return (
    <Button
      {...rest}
      onClick={handleClick}
      htmlType="submit"
      className={`${className} ${!rest.disabled && custom === "color" ? "!bg-[#010101] hover:!bg-[#5635B3]" : !rest.disabled ? "!bg-[#5635B3]" : "!bg-[#757575]"} !text-[#FFFFFF] !font-semibold !text-[13px] transition-colors duration-300 !leading-[13px] !border-none !rounded-[6px] !h-10`}
    >
      {iconLeft && <span className="mr-1">{iconLeft}</span>}
      {label}
      {iconRight && <span>{iconRight}</span>}
    </Button>
  );
};

export default PrimaryButton;
