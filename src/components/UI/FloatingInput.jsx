// import React, { useState, useMemo, useEffect } from 'react';
// import { Input, Select } from 'antd'; // Assuming you're using Ant Design components
// import { restrictInputValue } from '../../utils';

// const FloatingInput = ({
//   label,
//   getValue,
//   name,
//   onValueChange,
//   from,
//   prefix,
//   code,
//   disabled,
//   maxLength,
//   prefixOptions = [], // Add this prop for dropdown options
//   onPrefixChange, // Add this prop to handle prefix selection changes,
//   prefixDropdown,
//   ref,
//   onScrollEnd,
//   loading,
//   type,
//   ...props
// }) => {
//   const RANDOM_ID_OBSERVE = 1.5;
//   const [focused, setFocused] = useState(getValue ? true : false);
//   const [selectedPrefix, setSelectedPrefix] = useState(
//     code || (prefixOptions.length > 0 ? prefixOptions[0].value : '')
//   );

//   const RANDOM_ID_LENGTH = 9;
//   const RANDOM_TO_STRING = 36;
//   const RANDOM_ID_SLICE = 2;

//   const id = useMemo(() => {
//     const randomPart = Math.random()
//       .toString(RANDOM_TO_STRING)
//       .slice(RANDOM_ID_SLICE, RANDOM_ID_SLICE + RANDOM_ID_LENGTH);
//     return props.id || `input-${randomPart}`;
//   }, [props.id]);

//   const [value, setValue] = useState(getValue || '');
//   const showLabelAbove = focused || !!value;

//   const handleChange = (e) => {
//     let newValue = restrictInputValue(name, e.target.value);
//     setValue(newValue);
//     if (onValueChange) {
//       onValueChange({ name, selectValue: newValue });
//     }
//   };

//   const handlePrefixChange = (value) => {
//     setSelectedPrefix(value);
//     if (onPrefixChange) {
//       onPrefixChange(value);
//     }
//   };

//   useEffect(() => {
//     setValue(getValue || '');
//   }, [getValue]);

//   const handlePopupScroll = (e) => {
//     const { target } = e;
//     const { scrollTop, scrollHeight, clientHeight } = target;
//     const isNearBottom =
//       scrollHeight - scrollTop <= clientHeight * RANDOM_ID_OBSERVE;

//     if (isNearBottom && onScrollEnd && !loading) {
//       onScrollEnd();
//     }
//   };

//   return (
//     <div className="relative w-full" ref={ref}>
//       {prefix && prefixDropdown ? (
//         <Input
//           type={type}
//           {...props}
//           id={id}
//           value={value}
//           onChange={
//             from === 'self' ? (e) => onValueChange(e, setValue) : handleChange
//           }
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           ref={ref}
//           className="pt-4 pb-1 px-3 placeholder:text-gray-400"
//           size="large"
//           prefix={
//             <div
//               className={`flex items-center ${
//                 showLabelAbove ? 'border-r border-extralight pr-2' : ''
//               }`}
//               onClick={(e) => e.stopPropagation()} // Prevent event bubbling
//               onMouseDown={(e) => e.preventDefault()}
//             >
//               <Select
//                 value={prefix ? selectedPrefix : undefined}
//                 onChange={handlePrefixChange}
//                 style={{ width: 90 }}
//                 variant="borderless"
//                 popupMatchSelectWidth={false}
//                 options={prefixOptions} // Recommended way to pass options in v5+
//                 onPopupScroll={handlePopupScroll}
//                 showSearch
//               />
//             </div>
//           }
//           maxLength={maxLength}
//         />
//       ) : prefix ? (
//         <Input
//           type={type}
//           {...props}
//           id={id}
//           value={value}
//           onChange={
//             from === 'self' ? (e) => onValueChange(e, setValue) : handleChange
//           }
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           className="pt-4 pb-1 px-3 placeholder:text-gray-400"
//           size="large"
//           prefix={
//             <span
//               className={
//                 showLabelAbove
//                   ? 'text-extralight border-r border-extralight pr-2 pt-1 text-sm'
//                   : ''
//               }
//             >
//               {prefix ? code : undefined}
//             </span>
//           }
//           maxLength={maxLength}
//         />
//       ) : (
//         <Input
//           type={type}
//           {...props}
//           id={id}
//           value={value}
//           onChange={
//             from === 'self' ? (e) => onValueChange(e, setValue) : handleChange
//           }
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           className="pt-4 pb-1 px-3 placeholder:text-gray-400"
//           size="large"
//           disabled={disabled || (value && disabled)}
//           maxLength={maxLength}
//         />
//       )}
//       <label
//         htmlFor={id}
//         className={`
//           absolute left-3 px-1 transition-all duration-200 ease-in-out ${disabled && !value ? 'bg-bottom' : 'bg-white'} border-0 pointer-events-none font-normal capitalize
//           ${
//             showLabelAbove
//               ? 'text-sm -top-2.5 z-10 text-light'
//               : 'text-sm top-1/2 transform -translate-y-1/2 text-black'
//           }
//         `}
//       >
//         {label}
//       </label>
//     </div>
//   );
// };

// export default FloatingInput;

import React, { useState, useMemo, useEffect } from "react";
import { Input, Select } from "antd";
import { blockInvalidNumberKeys, restrictInputValue } from "../../utils";

const FloatingInput = ({
  label,
  getValue,
  name,
  onValueChange,
  from,
  prefix,
  code,
  disabled,
  maxLength,
  prefixOptions = [],
  onPrefixChange,
  prefixDropdown,
  ref,
  onScrollEnd,
  loading,
  type,
  ...props
}) => {
  const RANDOM_ID_OBSERVE = 1.5;
  const [focused, setFocused] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState(
    code || (prefixOptions.length > 0 ? prefixOptions[0].value : ""),
  );

  const RANDOM_ID_LENGTH = 9;
  const RANDOM_TO_STRING = 36;
  const RANDOM_ID_SLICE = 2;

  const id = useMemo(() => {
    const randomPart = Math.random()
      .toString(RANDOM_TO_STRING)
      .slice(RANDOM_ID_SLICE, RANDOM_ID_SLICE + RANDOM_ID_LENGTH);
    return props.id || `input-${randomPart}`;
  }, [props.id]);

  const [value, setValue] = useState(getValue || "");

  // Modified showLabelAbove logic
  const showLabelAbove = focused || (value && value !== "");

  const handleChange = (e) => {
    console.log("input");

    let newValue = restrictInputValue(name, e.target.value);
    setValue(newValue);
    if (onValueChange) {
      onValueChange({ name, selectValue: newValue });
    }
  };

  const handlePrefixChange = (value) => {
    setSelectedPrefix(value);
    if (onPrefixChange) {
      onPrefixChange(value);
    }
  };

  useEffect(() => {
    setValue(getValue || "");
    // Reset focused state when value is reset to empty
    if (getValue === "") {
      setFocused(false);
    }
  }, [getValue]);

  const handlePopupScroll = (e) => {
    const { target } = e;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isNearBottom =
      scrollHeight - scrollTop <= clientHeight * RANDOM_ID_OBSERVE;

    if (isNearBottom && onScrollEnd && !loading) {
      onScrollEnd();
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      {prefix && prefixDropdown ? (
        <Input
          type={type}
          {...props}
          id={id}
          value={value}
          onChange={
            from === "self" ? (e) => onValueChange(e, setValue) : handleChange
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={ref}
          className="pt-4 pb-1 px-3 placeholder:text-gray-400"
          size="large"
          prefix={
            <div
              className={`flex items-center ${
                showLabelAbove ? "border-r border-extralight pr-2" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Select
                value={prefix ? selectedPrefix : undefined}
                onChange={handlePrefixChange}
                style={{ width: 90 }}
                variant="borderless"
                popupMatchSelectWidth={false}
                options={prefixOptions}
                onPopupScroll={handlePopupScroll}
                showSearch
              />
            </div>
          }
          maxLength={maxLength}
        />
      ) : prefix ? (
        <Input
          type={type}
          {...props}
          id={id}
          value={value}
          onChange={
            from === "self" ? (e) => onValueChange(e, setValue) : handleChange
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="pt-4 pb-1 px-3 placeholder:text-gray-400"
          size="large"
          prefix={
            <span
              className={
                showLabelAbove
                  ? "text-extralight border-r border-extralight pr-2 pt-1 text-sm"
                  : ""
              }
            >
              {prefix ? code : undefined}
            </span>
          }
          maxLength={maxLength}
        />
      ) : (
        <Input
          type={type}
          {...props}
          id={id}
          value={value}
          onChange={
            from === "self" ? (e) => onValueChange(e, setValue) : handleChange
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="pt-4 pb-1 px-3 placeholder:text-gray-400"
          size="large"
          disabled={disabled}
          maxLength={maxLength}
          onKeyDown={
            type === "number" ? (e) => blockInvalidNumberKeys(e) : null
          }
        />
      )}
      <label
        htmlFor={id}
        className={`
          absolute left-3 px-1 transition-all duration-200 ease-in-out 
          ${disabled && !value ? "bg-bottom" : "bg-white"} 
          border-0 pointer-events-none font-normal capitalize
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

export default FloatingInput;
