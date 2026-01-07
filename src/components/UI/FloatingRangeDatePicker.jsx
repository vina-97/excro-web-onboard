import React, { useState, useMemo } from "react";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const FloatingRangeDatePicker = ({
  label,
  value,
  onChange,
  name,
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
    return props.id || `rangepicker-${randomPart}`;
  }, [props.id]);

  const showLabelAbove = focused || (value && value[0] && value[1]);

  return (
    <div className="relative w-full">
      <RangePicker
        {...props}
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="pt-4 pb-1 px-3 placeholder:text-gray-400 w-full"
        size="large"
        format={props.format || "YYYY-MM-DD"}
        autoComplete="off"
      />
      <label
        htmlFor={id}
        className={`
          absolute left-3 px-1 transition-all duration-200 ease-in-out bg-white border-0 pointer-events-none font-normal
          ${
            showLabelAbove
              ? "text-sm -top-2.5 z-10 text-light"
              : "text-sm top-1/2 transform -translate-y-1/2 text-black"
          } 
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingRangeDatePicker;
