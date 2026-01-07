import { Select, Form } from "antd";
import ImageLoader from "./ImageLoader";
const { Option } = Select;

const AntdSelect = ({
  label,
  name,
  isMandatory,
  isOptional,
  options = [],
  onValueChange,
  value,
  customstyle,
  ...rest
}) => {
  const handleChange = (newValue) => {
    if (onValueChange) {
      onValueChange({ name, value: newValue });
    }
  };
  const customFilterOption = (input, option) =>
    option.children.toLowerCase().includes(input?.toLowerCase());

  return (
    <Form.Item
      layout="vertical"
      label={
        <>
          {label && (
            <label className="text-[#40444C] text-[14px] font-medium">
              {label}
            </label>
          )}
          {isMandatory && <span className="text-[#9F6060] ml-1">*</span>}
          {isOptional && (
            <span className="ml-2 text-gray-500 text-sm">(Optional)</span>
          )}
        </>
      }
      className={`${!label && "input-label-disable"}  `}
    >
      <Select
        {...rest}
        value={value || undefined} // Fully controlled
        onChange={handleChange}
        size="medium"
        filterOption={customFilterOption}
        showSearch
        className={` ${customstyle ? customstyle : ""} hover:border-purple-600 focus:border-purple-600`}
        suffixIcon={
          <ImageLoader
            imageKey="DropDownIcon"
            className={`w-3 h-3  ${rest.disabled && "onboard-business-custom-icon"}`}
          />
        }
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default AntdSelect;
