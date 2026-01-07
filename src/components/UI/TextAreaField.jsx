import React from "react";
import searchIcon from "../../assets/images/common-icons/search-icon.svg";
const TestAreaField = ({ ...props }) => {
  return (
    <div className="onboard-business-search-teaxtarea-container">
      {props.icon && (
        <img
          src={searchIcon}
          alt="Search"
          className="onboard-business-search-icon"
        />
      )}
      {props.label && (
        <p className="text-[#40444C] font-medium text-sm !mb-[10px]">
          {props.label}
        </p>
      )}

      <textarea
        placeholder={props.placeholder}
        onChange={props.handleChange}
        name={props.name}
        value={props.value}
        autoComplete="off"
        className={`${props.error ? "!border-red-500" : ""} "h-20 w-full"`}
        rows={4}
      />
      {props.error && (
        <p className="text-[#D92D20] font-medium text-sm !mb-[10px]">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default TestAreaField;
