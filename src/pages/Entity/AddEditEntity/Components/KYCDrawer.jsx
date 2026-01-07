import React from "react";
import UniversalDrawer from "../../../../components/UI/Drawer/UniversalDrawer";
import TertiaryButton from "../../../../components/UI/Buttons/TertiaryButton";
import PrimaryButton from "../../../../components/UI/Buttons/PrimaryButton";
import AntdSelect from "../../../../components/UI/AntdSelect";
import AntdInput from "../../../../components/UI/AntdInput";
import ImageLoader from "../../../../components/UI/ImageLoader";

const KYCDrawer = ({ ...props }) => {
  return (
    <UniversalDrawer
      title={props.title}
      open={props.open}
      onClose={props.onClose}
      size={1000}
    >
      <div>
        <div className="bg-white">
          <div className="flex">
            <div className="w-100 -mt-1.25 mr-7.5">
              <AntdSelect
                label="Category Name"
                placeholder="e.g., Proof of Identity"
                customstyle=""
                options={props?.options?.KYCCategoryList}
                value={props?.entityState?.categoryName}
                onValueChange={props.handleCategoryChange}
                disabled={props.entityId}
              />
            </div>

            <div className="w-100">
              <div className="text-[#40444C] text-[14px] font-medium pb-2.5">
                No of Mandatory Documents
              </div>
              <div className="flex justify-between items-center border border-[#EDEEF1] h-11 rounded-lg py-3 px-6">
                <p
                  className="bg-[#F2F2F2] text-primary-black-12 px-2.5 text-[15px] cursor-pointer"
                  onClick={() =>
                    props.entityState?.count > 1 &&
                    props.handleClick("decrease")
                  }
                >
                  -
                </p>
                <p className="text-[#40444C] font-medium text-[14px]">
                  {props.entityState?.count}
                </p>
                <p
                  className="bg-[#F2F2F2] text-primary-black-12 px-2.5 text-[15px] cursor-pointer"
                  onClick={() => props.handleClick("increase")}
                >
                  +
                </p>
              </div>
            </div>
          </div>
          {props.entityState?.count > 0 && (
            <div className="w-full custom-onboard-table-style mt-5 overflow-y-auto mb-15">
              <table className="table-fixed w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="w-[27%]">Document Name</th>
                    <th className="w-[15%]">Is Mandatory</th>
                    <th className="w-[27%]">Verification Method</th>
                    <th className="w-[27%]">API Document</th>
                    <th className="w-12.5"></th>
                    <th className="w-12.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {props?.entityState?.docsfield?.map((item, i) => (
                    <tr key={item.id || i}>
                      <td className="p-2">
                        <AntdInput
                          label=""
                          placeholder="Document Name"
                          customstyle="w-full"
                          name="name"
                          value={item.name}
                          onValueChange={(e) => props.handleChange(e, i)}
                        />
                      </td>

                      <td className="p-2">
                        <AntdSelect
                          label=""
                          placeholder="e.g., Yes"
                          customstyle="w-full"
                          options={props?.options?.mandatoryList}
                          name="isMandatory"
                          value={String(item.isMandatory)}
                          onValueChange={(e) => props.handleChange(e, i)}
                        />
                      </td>

                      <td className="p-2">
                        <AntdSelect
                          label=""
                          placeholder="e.g., Manual"
                          customstyle="w-full"
                          options={props?.options?.verificationList}
                          name="method"
                          value={item?.verification?.method ?? ""}
                          onValueChange={(e) =>
                            props.handleChange(e, i, "verification")
                          }
                        />
                      </td>

                      <td className="p-2">
                        <AntdSelect
                          label=""
                          placeholder="e.g., Aadhar_v1"
                          customstyle="w-full"
                          options={
                            item?.verification?.method === "doc_verification"
                              ? props?.apiDocsList
                              : item?.verification?.method === "ocr"
                                ? props?.apiOcrList
                                : []
                          }
                          name="api"
                          value={item?.verification?.api || ""}
                          onValueChange={(e) =>
                            props.handleChange(e, i, "verification")
                          }
                          disabled={
                            item?.verification?.method === "manual"
                              ? true
                              : false
                          }
                        />
                      </td>

                      <td className="p-0 align-middle text-center">
                        {props?.entityState?.docsfield?.length - 1 === i && (
                          <ImageLoader
                            imageKey="onboardMenuAdd"
                            className="w-6 h-6 cursor-pointer"
                            custonstyle={{
                              width: "24px",
                              height: "24px",
                              minWidth: "24px",
                              minHeight: "24px",
                              // marginTop: '-20px',
                            }}
                            onClick={() => props.handleClickAdd("")}
                          />
                        )}
                      </td>

                      {/* Delete Icon */}
                      <td className="p-0 align-middle text-center">
                        {props?.entityState?.docsfield?.length > 1 && (
                          <ImageLoader
                            imageKey="onboardMenuDelete"
                            className="w-6 h-6 cursor-pointer"
                            custonstyle={{
                              width: "24px",
                              height: "24px",
                              minWidth: "24px",
                              minHeight: "24px",
                              // marginTop: '-20px',
                            }}
                            onClick={() => props.handleDeleteRow(i)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-7.5">
        <TertiaryButton
          type="default"
          size="large"
          label="Cancel"
          onNotify={props.onClose}
        />

        <PrimaryButton
          type="primary"
          size="large"
          label={`${props.entityId ? "Update" : "Save"}`}
          onNotify={() => props.handleSubmit(props.entityId ? "edit" : "save")}
          custom="color"
          disabled={props.isLoading}
        />
      </div>
    </UniversalDrawer>
  );
};

export default KYCDrawer;
