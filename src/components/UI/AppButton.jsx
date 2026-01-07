import React from "react";
import { Button } from "antd";

const AppButton = ({ children, ...props }) => {
  return (
    <Button {...props} size="large">
      {children}
    </Button>
  );
};

export default AppButton;
