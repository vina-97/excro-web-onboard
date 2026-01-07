import React from "react";
import searchIcon from "../../assets/images/common-icons/search-icon.svg";
const InputField = ({ ...props }) => {
  return (
    <div className="onboard-business-search-container">
      {props.icon && (
        <img
          src={searchIcon}
          alt="Search"
          className="onboard-business-search-icon"
        />
      )}
      {props.label && <label>{props.label}</label>}

      <input
        type="text"
        placeholder={props.placeholder}
        onChange={props.handleChange}
        name={props.name}
        value={props.value}
        autoComplete="off"
        className={props.className}
      />
    </div>
  );
};

export default InputField;
