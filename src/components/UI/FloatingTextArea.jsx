import React, { useState, useMemo, useEffect } from "react";
import { Input } from "antd";
import { restrictInputValue } from "../../utils";

const { TextArea } = Input;

const FloatingTextArea = ({
  label,
  getValue,
  onValueChange,
  name,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const RANDOM_ID_LENGTH = 9;
  const RANDOM_TO_STRING = 36;
  const RANDOM_ID_SLICE = 2;

  const id = useMemo(() => {
    const randomPart = Math.random()
      .toString(RANDOM_TO_STRING)
      .slice(RANDOM_ID_SLICE, RANDOM_ID_SLICE + RANDOM_ID_LENGTH);
    return props.id || `textarea-${randomPart}`;
  }, [props.id]);
  const [value, setValue] = useState(getValue || "");
  const showLabelAbove = placeholder || focused || !!value;

  const handleChange = (e) => {
    let newValue = restrictInputValue(name, e.target.value);
    setValue(newValue);

    if (onValueChange) {
      onValueChange({ name, selectValue: newValue });
    }
  };
  useEffect(() => {
    setValue(getValue || "");
    // Reset focused state when value is reset to empty
    if (getValue === "") {
      setFocused(false);
    }
  }, [getValue]);
  return (
    <div className="w-full">
      <TextArea
        {...props}
        id={id}
        value={value}
        name={name}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoSize={{ minRows: 3, maxRows: 6 }}
        autoComplete="off"
        placeholder={!focused && !value ? placeholder : ""} // ⬅ here
      />
      <label
        htmlFor={id}
        className={`
          absolute left-3 px-1 transition-all duration-200 ease-in-out bg-white border-0 pointer-events-none font-normal
          ${
            showLabelAbove
              ? "text-sm -top-2.5 z-10 text-light"
              : "text-sm top-1/2 transform -translate-y-1/2 text-black p-0.5"
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingTextArea;
