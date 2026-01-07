import React from "react";
import { useParams } from "react-router-dom";
import AntdSelect from "../../../../components/UI/AntdSelect";
import AntdInput from "../../../../components/UI/AntdInput";

const EntityInfoCard = ({ ...props }) => {
  const { entityId } = useParams();
  const BusinessTypeList = [
    { label: "Individual", value: "individual" },
    { label: "Business", value: "business" },
  ];

  const handleChange = (e) => {
    props.getValue(e);
  };

  return (
    <>
      <div className="p-7.5 flex  border border-[#E5E7EB] rounded-xl bg-white">
        <div className="w-100 mr-7.5">
          <AntdSelect
            label="Business Type"
            placeholder="e.g., Business"
            name="entityType"
            value={props?.EntityData?.entityType || ""}
            options={BusinessTypeList}
            onValueChange={(e) => handleChange(e)}
            disabled={entityId ? true : false}
          />
        </div>
        <div className="w-100">
          <AntdInput
            label="Entity Name"
            placeholder="e.g., Private Limited"
            labelCss={"text-[#40444C] text-[14px] font-medium "}
            name="entityName"
            value={props?.EntityData?.entityName || ""}
            onValueChange={(e) => handleChange(e)}
            disabled={entityId ? true : false}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(EntityInfoCard);
