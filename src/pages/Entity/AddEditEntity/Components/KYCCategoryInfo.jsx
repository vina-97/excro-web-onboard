import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AntdSelect from "../../../../components/UI/AntdSelect";
import AntdInput from "../../../../components/UI/AntdInput";
import ImageLoader from "../../../../components/UI/ImageLoader";
import TertiaryButton from "../../../../components/UI/Buttons/TertiaryButton";
import PrimaryButton from "../../../../components/UI/Buttons/PrimaryButton";
import KYCDrawer from "./KYCDrawer";
import useKycStore from "../../../../store/useKycStore";
import { showFailure } from "../../../../utils";
import useEntityListStore from "../../../../store/useEntityListStore";
import UniversalModal from "../../../../components/UI/Modal/UniversalModal";
const KYCCategoryInfo = ({ EntityData }) => {
  const { getKYCCategoryList, KYCCategoryList } = useKycStore();
  const {
    createEntity,
    entityDetail,
    updateEntity,
    fetchEntityDetail,
    isLoading,
    getApiDocuments,
    apiDocsList,
    apiOcrList,
  } = useEntityListStore();

  const [entityState, setEntityState] = useState({
    count: 1,
    categoryName: "",
    category: null,
    docsfield: [
      {
        name: "",
        isMandatory: "false",
        verification: {
          method: "",
          api: "",
        },
        id: Math.random() + new Date(),
      },
    ],
    isSideBarOpen: false,
    addCategory: false,
    deletePopModel: false,
  });

  const {
    count,
    categoryName,
    category,
    docsfield,
    isSideBarOpen,
    addCategory,
    deletePopModel,
  } = entityState;
  const { entityId } = useParams();
  const Navigate = useNavigate();
  const location = useLocation();
  const AllOptionsData = {
    KYCCategoryList,
    mandatoryList: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
    verificationList: [
      { label: "Manual", value: "manual" },
      { label: "Document Verification", value: "doc_verification" },
      { label: "Ocr", value: "ocr" },
    ],
    ApiDocumentList: [
      { label: "Aadhar_v1", value: "ind_aadhaar" },
      { label: "Pan_v1", value: "ind_pan" },
      { label: "Gst_v1", value: "ind_gst" },
    ],
  };

  useEffect(() => {
    if (entityId && entityDetail && !addCategory) {
      const data =
        entityDetail?.documentProofs?.length > 0
          ? entityDetail?.documentProofs
          : [];
      data &&
        data?.map((item) => {
          if (item?.documents?.length > 0) {
            setEntityState((prev) => ({
              ...prev,
              docsfield: item?.documents || [],
              isSideBarOpen: false,
              addCategory: false,
              // set category to null if no documents
            }));
          }
        });
    } else if (addCategory) {
      setEntityState((prev) => ({
        ...prev,
        count: 1,
        categoryName: "",
        category: {},
        docsfield: [
          {
            name: "",
            isMandatory: "false",
            verification: {
              method: "",
              api: "",
            },
            id: Math.random() + new Date(),
          },
        ],
        isSideBarOpen: true,
        addCategory: true,
      }));
    }
  }, [entityDetail, addCategory]);
  useEffect(() => {
    getKYCCategoryList();
    getApiDocuments();
  }, []);

  useEffect(() => {
    if (location?.pathname?.split("/").includes("create-entity")) {
      setEntityState({
        count: 1,
        categoryName: "",
        category: null,
        docsfield: [
          {
            name: "",
            isMandatory: "false",
            verification: {
              method: "",
              api: "",
            },
            id: Math.random() + new Date(),
          },
        ],
        isSideBarOpen: false,
        addCategory: false,
        deletePopModel: false,
      });
    }
  }, [location]);

  const handleClick = (type) => {
    if (type === "increase") {
      setEntityState((prev) => ({
        ...prev,
        count: prev.count + 1,
      }));
      handleClickAdd("count");
    } else {
      setEntityState((prev) => ({
        ...prev,
        count: prev.count - 1,
      }));
    }
  };
  const handleClickAdd = (add) => {
    const emptyObj = {
      name: "",
      isMandatory: "false",
      verification: {
        method: "",
        api: "",
      },
      id: Math.random() + new Date(),
    };
    const docs = [...docsfield];
    if (add && Number(docs.length) <= Number(count)) {
      setEntityState((prev) => ({
        ...prev,
        docsfield: [...prev.docsfield, emptyObj],
      }));
    } else if (add && Number(count) < Number(docs.length)) {
      return;
    } else {
      const check = ["doc_verification", "ocr"];
      let hasError = false;

      for (let i = 0; i < docs.length; i++) {
        const { name, verification } = docs[i];

        if (!name || !verification?.method) {
          showFailure("Please fill the required fields");
          hasError = true;
          break; // stop validation after first error
        }

        if (check.includes(verification.method) && !verification.api) {
          showFailure("Please select API document");
          hasError = true;
          break;
        }
      }

      // Only push emptyObj if all rows are valid
      if (!hasError) {
        setEntityState((prev) => ({
          ...prev,
          docsfield: [...prev.docsfield, emptyObj],
        }));
      }
    }
  };

  const handleDeleteRow = (idx) => {
    setEntityState((prev) => {
      const newDocs = [...prev.docsfield];
      newDocs.splice(idx, 1);

      return {
        ...prev,
        docsfield: newDocs, // update only docsfield
      };
    });
  };

  const handleOpenSideBar = (item) => {
    const result = {
      kycCategoryId: item?.kycCategoryId,
      kycCategory: {
        code: item?.kycCategory?.code,
        name: item?.kycCategory?.name,
      },

      kycCategoryStatus: item?.kycCategoryStatus,
    };

    setEntityState((prev) => ({
      ...prev,
      isSideBarOpen: true,
      count: item.mandatory,
      docsfield: item?.documents,
      categoryName: item?.kycCategory?.name,
      category: result,
    }));
  };

  const handleAddcategory = () => {
    setEntityState((prev) => ({
      ...prev,
      isSideBarOpen: true,
      addCategory: true,
    }));
  };
  const handleClose = () => {
    setEntityState((prev) => ({
      ...prev,
      isSideBarOpen: false,
      addCategory: false,
    }));
    fetchEntityDetail(entityId);
  };

  const handleChange = (item, index, name) => {
    setEntityState((prev) => {
      const docs = [...prev.docsfield];

      if (name) {
        if (item.name === "method") {
          docs[index][name][item.name] = item.value;
          docs[index][name]["api"] = "";
        } else {
          docs[index][name][item.name] = item.value;
        }
      } else {
        docs[index][item.name] = item.value;
      }

      return {
        ...prev,
        docsfield: docs, // ✅ update only this field
      };
    });
  };

  const handleCategoryChange = (item) => {
    const fullObj = KYCCategoryList.find((opt) => opt.value === item.value);
    const result = {
      kycCategoryId: fullObj?.id,
      kycCategory: {
        code: fullObj?.code,
        name: fullObj?.name,
      },

      kycCategoryStatus: fullObj?.status,
    };
    setEntityState((prev) => ({
      ...prev,
      categoryName: item.value,
      category: result,
    }));
  };

  const handleCancel = () => {
    Navigate("/view-entity");
  };

  const handleClickDelete = (item) => {
    setEntityState((prev) => ({
      ...prev,
      deletePopModel: !prev.deletePopModel,
      category: item,
      count: item?.mandatory,
      docsfield: item?.documents,
      categoryName: item?.kycCategory?.name,
    }));
  };

  const handleSubmit = (type) => {
    const docs = [...docsfield];
    const check = ["doc_verification", "ocr"];
    const { entityType, entityName } = EntityData;
    if (!entityType) {
      showFailure("Please select entity type");
    } else if (!entityName) {
      showFailure("Please enter entity name");
    } else if (!categoryName) {
      showFailure("Please select category name");
    } else if (!count) {
      showFailure("At least one mandatory document is required.");
    } else {
      let hasError = false;
      for (let i = 0; i < docs.length; i++) {
        const { name, verification } = docs[i];

        if (!name || !verification?.method) {
          showFailure("Please fill the required fields");
          hasError = true;
          break; // stop validation after first error
        }

        if (check.includes(verification.method) && !verification.api) {
          showFailure("Please select API document");
          hasError = true;

          break;
        }
      }

      // if (Number(docs.length) < Number(count)) {
      //   showFailure(
      //     `${count} mandatory documents were selected, but only ${docs.length} were sent. Please submit the remaining ${count - docs.length}.`
      //   );
      //   hasError = true;
      // } else

      if (!hasError) {
        const payload = docs.map(
          ({ name, isMandatory, verification, documentId }) => ({
            name,
            isMandatory:
              isMandatory === "true" || isMandatory === true ? true : false, // convert to boolean
            verification,
            documentId,
          }),
        );

        let data;

        if (entityId) {
          data = {
            kycCategoryId: category?.kycCategoryId,
            kycCategory: {
              code: category?.kycCategory?.code,
              name: category?.kycCategory?.name,
            },
            mandatory: Number(count),
            kycCategoryStatus: category?.kycCategoryStatus,
            documents: payload,
            ...(type ? { type } : {}),
          };
          updateEntity(entityId, data, (res) => {
            if (res.success) {
              fetchEntityDetail(entityId);
              setEntityState((prev) => ({
                ...prev,
                isSideBarOpen: false,
                deletePopModel: false,
                addCategory: false,
              }));
            }
          });
        } else {
          data = {
            entityType: entityType,
            entity: {
              name: entityName,
            },
            documentProofs: [
              {
                kycCategoryId: category?.kycCategoryId,
                kycCategory: {
                  code: category?.kycCategory?.code,
                  name: category?.kycCategory?.name,
                },
                mandatory: Number(count),
                kycCategoryStatus: category?.kycCategoryStatus,
                documents: payload,
              },
            ],
          };
          createEntity(data, (res) => {
            if (res.success) {
              Navigate(`/edit-entity/${res?.data?.entity?.id}`);
            }
          });
        }
      }
    }
  };

  const handleOnClose = () => {
    setEntityState((prev) => ({
      ...prev,
      deletePopModel: false,
    }));
  };
  return (
    <>
      <div className="mb-7.5">
        <div className="text-[#010101] font-semibold text-[20px] leading-5 mt-6">
          KYC Category
        </div>
        {!entityId && (
          <div className="px-7.5 py-5 border border-[#E5E7EB] rounded-xl bg-white mt-7.5 mb-25">
            {!entityId ? (
              <>
                <div className="flex ">
                  <div className="w-100 mr-7.5">
                    <AntdSelect
                      label="Category Name"
                      placeholder="e.g., Proof of Identity"
                      value={categoryName}
                      options={AllOptionsData.KYCCategoryList}
                      onValueChange={handleCategoryChange}
                    />
                  </div>
                  <div className="w-100">
                    <div className="text-[#40444C] text-[14px] font-medium pt-0.75 pb-2.5">
                      No of Mandatory Documents
                    </div>
                    <div className="flex justify-between items-center border border-[#EDEEF1] h-11 rounded-lg py-3 px-6">
                      <p
                        className="bg-[#F2F2F2] text-primary-black-12 px-2.5 text-[15px] cursor-pointer"
                        onClick={() => count > 1 && handleClick("decrease")}
                      >
                        -
                      </p>
                      <p className="text-[#40444C] font-medium text-[14px]">
                        {count}
                      </p>
                      <p
                        className="bg-[#F2F2F2] text-primary-black-12 px-2.5 text-[15px] cursor-pointer"
                        onClick={() => handleClick("increase")}
                      >
                        +
                      </p>
                    </div>
                  </div>
                </div>
                {count > 0 && (
                  <div className="w-full custom-onboard-table-style mt-5 overflow-y-auto">
                    <table className="table-fixed w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="w-[27.5%]">Document Name</th>
                          <th className="w-[15%]">Is Mandatory</th>
                          <th className="w-[27%]">Verification Method</th>
                          <th className="w-[27%]">API Document</th>
                          <th className="w-12.5"></th>
                          <th className="w-12.5"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {docsfield?.map((item, i) => (
                          <tr key={item.id || i}>
                            <td className="p-2">
                              <AntdInput
                                label=""
                                placeholder="Document Name"
                                customstyle="w-full"
                                name="name"
                                value={item.name}
                                onValueChange={(e) => handleChange(e, i)}
                              />
                            </td>

                            <td className="p-2">
                              <AntdSelect
                                label=""
                                placeholder="e.g., Yes"
                                customstyle="w-full"
                                options={AllOptionsData.mandatoryList}
                                name="isMandatory"
                                // value={item.isMandatory || 'false'}
                                value={String(item.isMandatory)}
                                onValueChange={(e) => handleChange(e, i)}
                              />
                            </td>

                            <td className="p-2">
                              <AntdSelect
                                label=""
                                placeholder="e.g., Manual"
                                customstyle="w-full"
                                options={AllOptionsData.verificationList}
                                name="method"
                                value={item.verification.method ?? ""}
                                onValueChange={(e) =>
                                  handleChange(e, i, "verification")
                                }
                              />
                            </td>

                            <td className="p-2">
                              <AntdSelect
                                label=""
                                placeholder="e.g., Aadhar_v1"
                                customstyle="w-full"
                                options={
                                  item.verification.method ===
                                  "doc_verification"
                                    ? apiDocsList
                                    : item.verification.method === "ocr"
                                      ? apiOcrList
                                      : []
                                }
                                name="api"
                                value={item.verification.api || ""}
                                onValueChange={(e) =>
                                  handleChange(e, i, "verification")
                                }
                                disabled={
                                  item?.verification?.method === "manual"
                                    ? true
                                    : false
                                }
                              />
                            </td>

                            <td className="p-0 align-middle text-center">
                              {docsfield.length - 1 === i && (
                                <ImageLoader
                                  imageKey="onboardMenuAdd"
                                  className="w-6 h-6 cursor-pointer"
                                  custonstyle={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  onClick={() => handleClickAdd("")}
                                />
                              )}
                            </td>

                            {/* Delete Icon */}
                            <td className="p-0 align-middle text-center">
                              {docsfield.length > 1 && (
                                <ImageLoader
                                  imageKey="onboardMenuDelete"
                                  className="w-6 h-6 cursor-pointer"
                                  custonstyle={{
                                    width: "24px",
                                    height: "24px",
                                    minWidth: "24px",
                                    minHeight: "24px",
                                  }}
                                  onClick={() => handleDeleteRow(i)}
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </div>

      {entityId && (
        <>
          <div>
            {entityDetail?.documentProofs?.length > 0 &&
              entityDetail?.documentProofs?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-7.5 py-5 border border-[#E5E7EB] rounded-xl bg-white mb-5"
                >
                  <div className="text-[#010101] text-[16px] font-semibold leading-4">
                    {item?.kycCategory?.name}
                  </div>
                  <div className="flex">
                    <p className="mr-2.5">
                      <ImageLoader
                        imageKey="onboardDocsDelete"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleClickDelete(item)}
                      />
                    </p>
                    <p>
                      <ImageLoader
                        imageKey="onboardDocsEdit"
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleOpenSideBar(item, i)}
                      />
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-end items-center mt-5">
            <p
              className="border border-[#DADADA] p-4.5 text-[#341C6E] font-semibold text-[15px] leading-3.75 bg-[#FFFFFF] cursor-pointer"
              onClick={() => handleAddcategory("addcategory")}
            >
              +Add Another Category
            </p>
          </div>
        </>
      )}

      {!entityId && (
        <div className="fixed bottom-0 right-0 bg-white p-4 flex justify-end gap-2 w-full shadow-[0_-3px_6.6px_0_rgba(0,0,0,0.06)]!">
          <TertiaryButton
            type="default"
            size="large"
            label="Cancel"
            onNotify={handleCancel}
          />

          <PrimaryButton
            type="primary"
            size="large"
            label={`Submit`}
            custom="color"
            onNotify={handleSubmit}
            disabled={isLoading}
          />
        </div>
      )}

      <KYCDrawer
        open={isSideBarOpen}
        onClose={handleClose}
        title={addCategory ? "Add KYC Category" : "Edit KYC Category"}
        entityId={addCategory ? "" : entityId}
        options={AllOptionsData}
        handleClickAdd={() => handleClickAdd("")}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        entityState={entityState}
        handleDeleteRow={handleDeleteRow}
        handleChange={handleChange}
        handleClick={handleClick}
        handleCategoryChange={handleCategoryChange}
        isLoading={isLoading}
        apiDocsList={apiDocsList}
        apiOcrList={apiOcrList}
      />

      <UniversalModal
        isOpen={deletePopModel}
        onClose={handleOnClose}
        onSubmit={null}
        fetchLoader={null}
        closeIcon={true}
        from="nobtn"
        width={500}
      >
        <div className="text-center p-4">
          <div className="flex justify-center mb-4">
            <div className=" w-16 h-16 flex items-center justify-center">
              <ImageLoader
                imageKey="onboardBusinessConfirm"
                className={`w-16 h-16`}
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Delete this Category?</h2>
          <p className="text-gray-600 mb-6">
            {`Are you sure you want to delete ${category?.kycCategory?.name}?`}
          </p>
          <div className="flex justify-center gap-4">
            <TertiaryButton
              type="default"
              size="large"
              label="No"
              onNotify={handleOnClose}
            />

            <PrimaryButton
              type="primary"
              size="large"
              label={`Yes`}
              onNotify={() => handleSubmit("delete")}
              custom="color"
              disabled={isLoading}
            />
          </div>
        </div>
      </UniversalModal>
    </>
  );
};

export default KYCCategoryInfo;
