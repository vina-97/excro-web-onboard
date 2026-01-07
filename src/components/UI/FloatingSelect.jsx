import { Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const FloatingSelect = ({
  label,
  getValue,
  onValueChange,
  options = [],
  name,
  showValueAndLabel = false,
  sendFullObject = false,
  labelKey,
  valueKey,
  from,
  ref,
  onScrollEnd,
  loading,
  arrayList,
  disabled,
  onSearch,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const RANDOM_ID_LENGTH = 9;
  const RANDOM_TO_STRING = 36;
  const RANDOM_ID_SLICE = 2;
  const RANDOM_ID_OBSERVE = 1.5;

  const id = useMemo(() => {
    const randomPart = Math.random()
      .toString(RANDOM_TO_STRING)
      .slice(RANDOM_ID_SLICE, RANDOM_ID_SLICE + RANDOM_ID_LENGTH);
    return props.id || `input-${randomPart}`;
  }, [props.id]);

  const [value, setValue] = useState(getValue || "");
  const showLabelAbove = focused || !!value;

  // Add this useEffect to sync with getValue
  useEffect(() => {
    setValue(getValue || "");
  }, [getValue]);

  const handleChange = (newValue) => {
    let valueToSend = newValue;

    const selectedOption = arrayList?.find((opt) =>
      typeof opt === "string"
        ? opt === newValue
        : name === "country"
          ? opt[labelKey] === newValue
          : opt[valueKey] === newValue,
    );

    if (
      sendFullObject &&
      selectedOption &&
      typeof selectedOption === "object"
    ) {
      valueToSend = selectedOption;
      setValue(newValue);

      if (onValueChange) {
        onValueChange({
          name,
          selectValue: newValue,
          fullObject: {
            [labelKey]: valueToSend[labelKey],
            [valueKey]: valueToSend[valueKey],
          },
        });
        return;
      }
      return false;
    } else {
      setValue(newValue);
      if (onValueChange) {
        onValueChange({ name, selectValue: newValue });
      }
    }
  };
  console.log(name, options);

  const selectOptions = showValueAndLabel
    ? options.map((opt) => ({
        value: opt.value,
        label:
          name === "mcc" || name === "clientId" ? (
            opt.label && opt.value ? (
              `${opt.value} - ${opt.label}`
            ) : (
              opt.label || opt.value || ""
            )
          ) : name !== "country" ? (
            `${opt.label}-${opt.value}`
          ) : (
            <span>
              {opt.label && (
                <>
                  <span dangerouslySetInnerHTML={{ __html: opt.label }} />
                  <span className="mx-2">-</span>
                </>
              )}
              {opt.value}
            </span>
          ),
      }))
    : options;

  const customFilterOption = (input, option) => {
    if (typeof option.label === "string") {
      return option.label.toLowerCase().includes(input.toLowerCase());
    }
    if (typeof option.value === "string") {
      return option.value.toLowerCase().includes(input.toLowerCase());
    }
    return false;
  };

  const handlePopupScroll = (e) => {
    const { target } = e;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isNearBottom =
      scrollHeight - scrollTop <= clientHeight * RANDOM_ID_OBSERVE;

    if (isNearBottom && onScrollEnd && !loading) {
      onScrollEnd();
    }
  };
  console.log(options, "options", selectOptions);

  return (
    <div className="relative w-full" ref={ref}>
      <Select
        {...props}
        id={id}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={
          from === "self" ? (e) => onValueChange(e, setValue) : handleChange
        }
        options={selectOptions}
        ref={ref}
        onPopupScroll={handlePopupScroll}
        size="large"
        filterOption={customFilterOption}
        onSearch={onSearch}
        showSearch
        className={`w-full pt-4 ${name === "dateAndTimeFormat" ? "" : "capitalize"}`}
        disabled={disabled && value}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-3 px-1 transition-all duration-200 ease-in-out bg-white pointer-events-none font-normal
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

export default FloatingSelect;
