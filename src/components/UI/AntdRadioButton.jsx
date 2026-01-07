import React, { useState } from "react";
import { Form, Radio } from "antd";

const AntdRadioButton = ({
  onValueChange,
  name,
  labelCss,
  label = "",
  isMandatory = false,
  options = [],
  ...restProps
}) => {
  const [value, setValue] = useState("");

  const handleOnchange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onValueChange) {
      onValueChange({ name, value: newValue });
    }
  };
  return (
    <Form.Item
      label={
        <>
          {label && (
            <label style={{ marginBottom: "0px" }} className={labelCss}>
              {label}
            </label>
          )}
          {isMandatory && <span className="text-danger ml-1">*</span>}
        </>
      }
    >
      <Radio.Group
        {...restProps}
        onChange={(e) => handleOnchange(e)}
        value={value}
      >
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};
export default AntdRadioButton;
