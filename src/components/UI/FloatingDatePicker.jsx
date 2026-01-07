import React, { useState, useMemo, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const FloatingDatePicker = ({
  label,
  getValue,
  onValueChange,
  name,
  isFutureDateRestrict,
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
    return props.id || `datepicker-${randomPart}`;
  }, [props.id]);

  const [value, setValue] = useState(getValue || "");
  const showLabelAbove = focused || !!value;

  const handleChange = (date) => {
    setValue(date);
    if (onValueChange) {
      onValueChange({
        name,
        selectValue: date ? date.format("YYYY-MM-DD") : null,
      });
    }
  };

  useEffect(() => {
    setValue(getValue || "");
    if (getValue === "") {
      setFocused(false);
    }
  }, [getValue]);

  const disabledDate = (current) => {
    if (isFutureDateRestrict) {
      return current && current > dayjs().endOf("day");
    }
    return false;
  };

  return (
    <div className="relative w-full">
      <DatePicker
        {...props}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder=""
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="pt-4 pb-1 px-3 placeholder:text-gray-400 w-full"
        size="large"
        format={props?.format || "YYYY/MM/DD"}
        autoComplete="off"
        disabledDate={disabledDate} // ✅ Restrict future dates
      />
      <label
        htmlFor={id}
        className={`
          absolute left-3 px-1 transition-all duration-200 ease-in-out bg-white border-0 pointer-events-none font-normal capitalize
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

export default FloatingDatePicker;
