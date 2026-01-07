import React from "react";
import UniversalDrawer from "../UI/Drawer/UniversalDrawer";
import PrimaryButton from "./Buttons/PrimaryButton";
import TertiaryButton from "./Buttons/TertiaryButton";
import AntdSelect from "./AntdSelect";
import AntdInput from "./AntdInput";

const FilterDrawer = ({ ...props }) => {
  const handleChange = (item) => {
    props.dataHandling(item);
  };

  const handleSubmit = () => {
    props.actionSubmit();
  };

  return (
    <UniversalDrawer
      title={props.title}
      open={props.open}
      onClose={props.onClose}
      size="large"
    >
      <div>
        {props.data &&
          props.data.length > 0 &&
          props.data.map((item, i) =>
            item.type === "select" ? (
              <div className="w-100" key={i}>
                <AntdSelect
                  label={item.label}
                  placeholder={item.placeholder}
                  onValueChange={handleChange}
                  value={item.value || ""}
                  // customstyle="!bg-[#f7f8f8]"
                  options={item.options}
                  name={item.name}
                />
              </div>
            ) : (
              <div className="w-100 mt-[20px] mb-[24px]" key={i}>
                <AntdInput
                  label={item.label}
                  placeholder={item.placeholder}
                  labelCss={"text-[#40444C] text-[14px] font-medium "}
                  name={item.name}
                  value={item.value || ""}
                  onValueChange={handleChange}
                />
              </div>
            ),
          )}
      </div>
      <div className="fixed bottom-0 right-0 bg-white p-4 flex justify-end gap-2 w-[450px] !shadow-[0_-3px_6.6px_0_rgba(0,0,0,0.06)]">
        <TertiaryButton
          type="default"
          size="large"
          label="Reset All"
          onNotify={props.handleReset}
        />

        <PrimaryButton
          type="primary"
          size="large"
          label={`Apply Filter`}
          onNotify={handleSubmit}
          custom="color"
          disabled={props.checkData}
        />
      </div>
    </UniversalDrawer>
  );
};

export default FilterDrawer;
