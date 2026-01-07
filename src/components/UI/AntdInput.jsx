// import { useState } from 'react';
import { Form, Input } from "antd";

const AntdInput = ({
  label,
  name,
  isMandatory,
  isOptional,
  onValueChange,
  labelCss,
  error,
  customstyle,
  value,
  ...rest
}) => {
  // const [value, setValue] = useState(value);

  const handleChange = (e) => {
    const newValue = e.target.value;
    // setValue(newValue);

    if (onValueChange) {
      onValueChange({ name, value: newValue });
    }
  };

  return (
    <Form.Item
      layout="vertical"
      label={
        <>
          {label && <label className={labelCss}>{label}</label>}
          {isMandatory && <span className="text-col ml-1">*</span>}
          {isOptional && <span className="ml-1"> (Optional)</span>}
        </>
      }
      className={`${!label && "input-label-disable"}  `}
      validateStatus={error ? "error" : ""}
      help={error || ""}
    >
      <Input
        {...rest}
        onChange={(e) => handleChange(e)}
        value={value}
        name={name}
        className={`${error ? "!border-red-500" : ""} ${customstyle ? customstyle : ""} !h-[44px] !rounded-[8px] focus:!shadow-none`}
      />
    </Form.Item>
  );
};

export default AntdInput;
