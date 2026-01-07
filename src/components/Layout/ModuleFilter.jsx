import React from "react";
import SecondaryButton from "../UI/Buttons/SecondaryButton";
import InputField from "../UI/InputField";

export const ModuleFilter = ({ ...props }) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div>
        <InputField
          placeholder={`Search ${props.placeholder} Name... `}
          value={props.value}
          name={props.name}
          handleChange={(e) => props.onChangeSearchText(e)}
          icon={true}
        />
      </div>
      <div>
        <div className="flex gap-3">
          <div className="flex items-center justify-end confirm-btn">
            <SecondaryButton
              label={"Filter"}
              iconLeft=""
              className=""
              onNotify={props.filterAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
