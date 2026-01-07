import React from "react";
import { Button } from "antd";

const TertiaryButton = ({
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
      className={`${className} !border-none text-[15px] rounded-md text-sm font-medium !bg-white text-primary-black-12`}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {label}
      {iconRight && <span>{iconRight}</span>}
    </Button>
  );
};

export default TertiaryButton;
