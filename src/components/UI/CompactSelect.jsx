import { useState } from "react";
import { Space, Select } from "antd";
import FloatingInput from "./FloatingInput";

const CompactSelectInput = ({ selectOptions, selectProps, inputProps }) => {
  const [selectValue, setSelectValue] = useState(
    selectProps?.defaultValue || "",
  );
  const [inputValue, setInputValue] = useState(inputProps?.defaultValue || "");

  return (
    <Space.Compact className="w-full">
      <div className="relative flex-1">
        <Select
          {...selectProps}
          options={selectOptions}
          value={selectValue}
          onChange={(value) => {
            setSelectValue(value);
            selectProps?.onChange?.(value);
          }}
          className="h-full"
          style={{ width: "100%" }}
        />
      </div>
      <FloatingInput
        {...inputProps}
        getValue={inputValue}
        onValueChange={({ selectValue }) => {
          setInputValue(selectValue);
          inputProps?.onValueChange?.({ selectValue });
        }}
        style={{ flex: 2 }}
      />
    </Space.Compact>
  );
};

export default CompactSelectInput;
