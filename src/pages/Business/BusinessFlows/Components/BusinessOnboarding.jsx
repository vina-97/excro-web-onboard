import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DatePicker, Form, Input, Radio, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { returnTimeZoneDate } from "../../../../utils";
import useMasterStore from "../../../../store/useMasterStore";
import dayjs from "dayjs";
import { useIntersectionObserver } from "../../../../hooks/useIntersectionObserver";

const { TextArea } = Input;
const NUMBER_3 = 3;
const MAGICNUMBER20 = 20;
const LIMIT_50 = 50;
const NUMBER_2 = 2;
const BusinessOnboarding = forwardRef(
  ({ businessData = {}, onSubmit }, ref) => {
    const {
      fetchEntities,
      fetchIndustries,
      loading,
      fetchMccCodes,
      entities,
      industries,
      mccCodes,
    } = useMasterStore();

    const [industryPage, setIndustryPage] = useState(1);
    const [industryHasMore, setIndustryHasMore] = useState(true);
    const [mccPage, setMccPage] = useState(1);
    const [mccHasMore, setMccHasMore] = useState(true);
    const RANDOM_ID_OBSERVE = 1.5;

    const [industryRef] = useIntersectionObserver({
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const [mccRef] = useIntersectionObserver({
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    const [mccScrollLoading, setMccScrollLoading] = useState(false);

    const handleIndustryScrollEnd = async () => {
      if (!loading && industryHasMore && industryPage > 1) {
        const response = await fetchIndustries(null, industryPage, LIMIT_50);
        if (Array.isArray(response)) {
          if (response.length < LIMIT_50) {
            setIndustryHasMore(false);
            return;
          }
          setIndustryPage((prev) => prev + 1);
        }
      }
    };
    const handleMccScrollEnd = async () => {
      if (mccScrollLoading || !mccHasMore || loading) {
        return;
      }

      setMccScrollLoading(true);
      try {
        const response = await fetchMccCodes(null, mccPage, LIMIT_50);

        if (Array.isArray(response) && response.length > 0) {
          setMccPage((prev) => prev + 1);

          if (response.length < LIMIT_50) {
            setMccHasMore(false);
          }
        } else {
          setMccHasMore(false);
        }
      } finally {
        setMccScrollLoading(false);
      }
    };

    /** ----------------------------------------------
     *  Build fields metadata *based on current data*
     *  (keeps identical to your original meta but
     *   also exposes nested keys for form)
     * ---------------------------------------------- */

    const fieldsMeta = useMemo(() => {
      const bd = businessData || {};

      return {
        legalName: {
          name: "legalName",
          label: "Business Name/ Legal Business Name",
          type: "text",
          span: 1,
          placeholder: "e.g., ABC Corporation Private Limited",
          mandatory: true,
          value: bd?.legalName || "",
        },
        tradeName: {
          name: "tradeName",
          label: "Trading / Brand Name",
          type: "text",
          span: 1,
          placeholder: "e.g., ABC Stores",
          mandatory: true,
          value: bd?.tradeName || "",
        },
        entityType: {
          name: "entityType",
          label: "Business Type",
          type: "radio",
          span: 1,
          placeholder: "Select entity type",
          mandatory: true,
          options: [
            { label: "Business", value: "business" },
            { label: "Individual", value: "individual" },
          ],
          value: bd?.entityType || "",
        },
        entity: {
          name: "entity.name",
          rawName: "name",
          label: "Business Entity",
          type: "entity",
          span: 1,
          placeholder: "Select entity",
          mandatory: true,
          value: bd?.entity?.name || "",
          options: entities || [],
        },
        pan: {
          name: "kyc.pan",
          rawName: "pan",
          label: "Business / Individual PAN Number",
          type: "text",
          span: 1,
          placeholder: "e.g., AAAAA1234A",
          mandatory: true,
          value: bd?.kyc?.pan || "",
        },
        incorporationDate: {
          name: "incorporationDate",
          label: "Incorporation Date",
          type: "date",
          span: 1,
          mandatory: false,
          value: bd?.incorporationDate
            ? returnTimeZoneDate(bd.incorporationDate)
            : "",
          placeholder: "Select incorporation date",
        },
        industry: {
          name: "industry.code",
          label: "Business Industry",
          type: "industry",
          span: 1,
          placeholder: "Select industry",
          mandatory: false,
          value: bd?.industry?.code
            ? `${bd?.industry?.code} - ${bd?.industry?.name}`
            : "",
        },
        cin: {
          name: "kyc.cin",
          rawName: "cin",
          label: "Business CIN/ID Number",
          type: "text",
          span: 1,
          placeholder: "e.g., U12345XX2024PTC123456",
          mandatory: false,
          value: bd?.kyc?.cin || "",
        },
        gst: {
          name: "kyc.gst",
          rawName: "gst",
          label: "Business / Individual GST Number",
          type: "text",
          span: 1,
          placeholder: "e.g., 36ABCDE1234F1Z5",
          mandatory: true,
          value: bd?.kyc?.gst || "",
        },

        fullAddress: {
          name: "businessAddress.fullAddress",
          rawName: "fullAddress",
          label: "Registered Address",
          type: "textarea",
          span: 3,
          value: bd?.businessAddress?.fullAddress || "",
          placeholder:
            "e.g., 123, 2nd Floor, Green Plaza, Bengaluru, Karnataka - 560001",
          mandatory: true,
        },
        mcc: {
          name: "mcc",
          label: "MCC",
          type: "mcc",
          span:
            bd?.mcc && Array.isArray(bd.mcc) && bd.mcc.length > NUMBER_3
              ? NUMBER_3
              : 1,
          value:
            bd?.mcc && Array.isArray(bd.mcc)
              ? bd.mcc.map((m) => `${m.code} - ${m.description}`).join(", ")
              : "",
          placeholder: "Select MCC",
          mandatory: false,
        },
        description: {
          name: "description",
          label: "Business / Profession Description",
          type: "textarea",
          span: 3,
          value: bd?.description || "",
          placeholder:
            "e.g., Manufacturer and distributor of organic packaged foods, supplying to retail stores and online marketplaces across India.",
          mandatory: false,
        },
      };
    }, [businessData]);

    /** ----------------------------------------------
     *  Split into information / otherInformation arrays
     *  (preserve your previous logic)
     * ---------------------------------------------- */
    const { informationFields, otherInformationFields } = useMemo(() => {
      const informationFields = [];
      const otherInformationFields = [];

      Object.entries(fieldsMeta).forEach(([key, meta]) => {
        const value = meta.value !== undefined ? meta.value : "";
        const fieldObj = {
          name: meta.name,
          key,
          label: meta.label,
          value,
          mandatory: meta.mandatory,
          type: meta.type || "text",
          span: meta.span || 1,
          placeholder: meta.placeholder || "",
          options: meta.options || [],
          display:
            meta.display ||
            ((v) => (
              <span className="text-black text-[15px] font-semibold">{v}</span>
            )),
        };

        if (value) {
          informationFields.push(fieldObj);
        } else {
          otherInformationFields.push(fieldObj);
        }
      });

      return { informationFields, otherInformationFields };
    }, [fieldsMeta]);

    /** ----------------------------------------------
     *  groupFieldsByRow same as your original
     * ---------------------------------------------- */
    const groupFieldsByRow = (fields) => {
      const rows = [];
      let currentRow = [];
      let currentSpan = 0;
      fields.forEach((f) => {
        if (currentSpan + f.span > NUMBER_3 || f.span === NUMBER_3) {
          if (currentRow.length) {
            rows.push(currentRow);
          }
          currentRow = [f];
          currentSpan = f.span;
        } else {
          currentRow.push(f);
          currentSpan += f.span;
        }
      });
      if (currentRow.length) {
        rows.push(currentRow);
      }
      return rows;
    };

    const informationRows = useMemo(
      () => groupFieldsByRow(informationFields),
      [informationFields],
    );

    /** ----------------------------------------------
     *  Build Yup schema dynamically using fieldsMeta
     *  - pan/gst validation patterns
     *  - businessAddress nested validation (pincode required if address present)
     * ---------------------------------------------- */
    const validationSchema = useMemo(() => {
      const topShape = {};
      const kycShape = {};
      const businessAddressShape = {};
      const entityShape = {};
      const NUMBER_30 = 30;
      Object.entries(fieldsMeta).forEach(([, meta]) => {
        const mandatory = !!meta.mandatory;
        console.log(meta.name);
        if (!mandatory) {
          if (meta.name.startsWith("kyc.")) {
            const fieldKey = meta.name.split(".")[1]; // pan/gst/cin
            if (fieldKey === "cin") {
              kycShape[fieldKey] = yup
                .string()
                .nullable()
                .notRequired()
                .test(
                  "valid-cin",
                  "CIN/ID can only contain letters, numbers, hyphens, and slashes",
                  (value) => !value || /^[A-Za-z0-9\-/]+$/.test(value), // only validate if value is entered
                )
                .max(NUMBER_30, "CIN/ID must not exceed 30 characters");
            }
          }
          return;
        }

        if (meta.name.startsWith("kyc.")) {
          const fieldKey = meta.name.split(".")[1]; // pan/gst/cin
          if (fieldKey === "pan") {
            kycShape[fieldKey] = yup
              .string()
              .trim()
              .required("PAN is mandatory")
              .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format");
          } else if (fieldKey === "gst") {
            const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/i;

            kycShape[fieldKey] = yup
              .string()
              .trim()
              .required("GST is mandatory")
              .matches(GSTIN_REGEX, "Invalid GST format");
          } else {
            kycShape[fieldKey] = yup
              .string()
              .required(`${meta.label} is mandatory`)
              .test("empty-check", `${meta.label} cannot be empty`, (value) => {
                if (value === "" || value === null || value === undefined) {
                  return false;
                }
                return true;
              })
              .nullable();
          }
        } else if (meta.name.startsWith("businessAddress.")) {
          const fieldKey = meta.name.split(".")[1];
          if (fieldKey === "fullAddress") {
            businessAddressShape[fieldKey] = yup
              .string()
              .required("Full Address is mandatory")
              .test("empty-check", "Full Address cannot be empty", (value) => {
                if (value === "" || value === null || value === undefined) {
                  return false;
                }
                return true;
              })
              .test(
                "pincode-check",
                "Full Address must contain a pincode",
                (value) => {
                  if (!value) {
                    return false;
                  }
                  const pincodeRegex = /\b\d{6}\b/;
                  return pincodeRegex.test(value);
                },
              )
              .nullable();
          } else {
            businessAddressShape[fieldKey] = yup
              .string()
              .required(`${meta.label} is mandatory`)
              .test("empty-check", `${meta.label} cannot be empty`, (value) => {
                if (value === "" || value === null || value === undefined) {
                  return false;
                }
                return true;
              })
              .nullable();
          }
        } else if (meta.name.startsWith("entity.")) {
          const fieldKey = meta.name.split(".")[1];

          if (fieldKey === "name") {
            entityShape[fieldKey] = yup
              .string()
              .required("Business Entity is mandatory")
              .test(
                "empty-check",
                "Business Entity cannot be empty",
                (value) => {
                  return !(
                    value === "" ||
                    value === null ||
                    value === undefined
                  );
                },
              )
              .nullable();
          }
        } else {
          if (meta.name === "incorporationDate") {
            topShape[meta.name] = yup
              .string()
              .required(`${meta.label} is mandatory`)
              .test("empty-check", `${meta.label} cannot be empty`, (value) => {
                if (value === "" || value === null || value === undefined) {
                  return false;
                }
                return true;
              })
              .nullable();
          } else {
            topShape[meta.name] = yup
              .string()
              .required(`${meta.label} is mandatory`)
              .test("empty-check", `${meta.label} cannot be empty`, (value) => {
                if (value === "" || value === null || value === undefined) {
                  return false;
                }
                return true;
              })
              .nullable();
          }
        }
      });

      const finalSchema = yup.object().shape({
        ...topShape,
        kyc: yup.object().shape(kycShape),
        businessAddress: yup.object().shape(businessAddressShape),
        entity: yup.object().shape(entityShape),
      });

      return finalSchema;
    }, [fieldsMeta]);

    /** ----------------------------------------------
     *  react-hook-form setup
     *  defaultValues built from data (nested for kyc and businessAddress)
     * ---------------------------------------------- */
    const defaultValues = useMemo(() => {
      const bd = businessData || {};

      let mccValue = [];
      if (bd?.mcc) {
        if (Array.isArray(bd.mcc)) {
          mccValue = bd.mcc.filter((mcc) => mcc.id && mcc.name);
        } else if (bd.mcc.id && bd.mcc.name) {
          mccValue = [bd.mcc];
        }
      }

      return {
        legalName: (bd.legalName || "").trim(),
        tradeName: (bd.tradeName || "").trim(),
        entityType: (bd.entityType || "").trim(),
        entity: {
          id: bd?.entity?.id,
          name: (bd?.entity?.name || "").trim(),
        },
        incorporationDate: bd?.incorporationDate
          ? returnTimeZoneDate(bd.incorporationDate)
          : "",
        kyc: {
          pan: (bd?.kyc?.pan || "").trim(),
          gst: (bd?.kyc?.gst || "").trim(),
          cin: (bd?.kyc?.cin || "").trim(),
        },
        description: (bd?.description || "").trim(),
        businessAddress: {
          fullAddress: (bd?.businessAddress?.fullAddress || "").trim(),
        },
        industry: {
          code: bd?.industry?.code,
          name: (bd?.industry?.name || "").trim(),
        },
        mcc: mccValue || [],
      };
    }, [businessData]);

    const {
      control,
      handleSubmit,
      trigger,
      getValues,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues,
    });

    useEffect(() => {
      const bd = businessData || {};
      setValue("legalName", bd.legalName || "");
      setValue("tradeName", bd.tradeName || "");
      setValue("entityType", bd.entityType || "");
      setValue("entity.name", bd?.entity?.name || "");
      setValue("entity.id", bd?.entity?.id || "");
      setValue(
        "incorporationDate",
        bd?.incorporationDate ? returnTimeZoneDate(bd.incorporationDate) : "",
      );
      setValue("description", bd?.description || "");
      setValue("kyc.pan", bd?.kyc?.pan || "");
      setValue("kyc.gst", bd?.kyc?.gst || "");
      setValue("kyc.cin", bd?.kyc?.cin || "");
      setValue(
        "businessAddress.fullAddress",
        bd?.businessAddress?.fullAddress || "",
      );
      setValue("industry.code", bd?.industry?.code || "");
      setValue("industry.name", bd?.industry?.name || "");

      if (bd?.mcc) {
        if (Array.isArray(bd.mcc)) {
          setValue(
            "mcc",
            bd.mcc.filter((mcc) => mcc.id && mcc.name),
          );
        } else if (bd.mcc.id && bd.mcc.name) {
          setValue("mcc", [bd.mcc]);
        }
      } else {
        setValue("mcc", []);
      }
    }, [businessData, setValue]);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const valid = await trigger();
        if (valid) {
          const values = getValues();
          onSubmit?.(values);
          return true;
        }
        return false;
      },
    }));

    /** ----------------------------------------------
     *  Render helpers (similar to your original)
     * ---------------------------------------------- */

    const getNestedError = (path, obj) => {
      try {
        return path.split(".").reduce((acc, key) => {
          if (acc && typeof acc === "object" && key in acc) {
            return acc[key];
          }
          return undefined;
        }, obj);
      } catch (error) {
        return error;
      }
    };

    const handlePopupScroll = (e, from) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom =
        scrollHeight - scrollTop <= clientHeight * RANDOM_ID_OBSERVE;

      if (!isNearBottom) {
        return;
      }

      if (from === "industry") {
        handleIndustryScrollEnd();
      } else if (from === "mcc") {
        handleMccScrollEnd();
      }
    };

    const renderInputField = (field) => {
      const name = field.name;
      const errorMessage = getNestedError(name, errors)?.message;

      return (
        <Form.Item
          label={`${field.label}${field.mandatory ? " *" : ""}`}
          validateStatus={errorMessage ? "error" : ""}
          help={errorMessage}
        >
          <div ref={name === "industry" ? industryRef : mccRef}>
            <Controller
              name={name}
              control={control}
              render={({ field: f }) => {
                switch (field.type) {
                  case "radio":
                    return (
                      <Radio.Group
                        {...f}
                        options={field.options}
                        value={f.value}
                        onChange={(e) => {
                          f.onChange(e.target.value);
                          trigger(name);
                          if (name === "entityType") {
                            // ✅ Reset entity fields when entityType changes
                            setValue("entity.id", "");
                            setValue("entity.name", "");
                            // ✅ Trigger re-render of entity field
                            trigger("entity.name");
                          }
                        }}
                      />
                    );
                  case "textarea":
                    return (
                      <TextArea
                        {...f}
                        placeholder={field.placeholder}
                        autoSize={{ minRows: 2, maxRows: 5 }}
                        onChange={(e) => {
                          f.onChange(e.target.value);
                          trigger(name);
                        }}
                      />
                    );
                  case "date":
                    return (
                      <DatePicker
                        {...f}
                        size="large"
                        style={{ width: "100%" }}
                        placeholder={field.placeholder}
                        format="YYYY-MM-DD"
                        value={f.value ? dayjs(f.value) : undefined}
                        onChange={(date, dateString) => {
                          f.onChange(dateString || "");
                          trigger(name);
                        }}
                      />
                    );

                  case "select":
                    return (
                      <Select
                        {...f}
                        placeholder={field.placeholder}
                        size="large"
                        options={field.options}
                        value={f.value || undefined}
                        onChange={(val) => {
                          f.onChange(val);
                          field.onChangeApi?.(val);

                          if (name === "entityType") {
                            setValue("entity.id", "");
                            setValue("entity.name", "");
                          }

                          trigger(name);
                        }}
                      />
                    );

                  case "entity":
                    return (
                      <Select
                        {...f}
                        placeholder={field.placeholder}
                        size="large"
                        value={f.value || undefined}
                        options={entities.map((getEntity) => ({
                          label: getEntity?.entity.name,
                          value: getEntity?.entity.id,
                        }))}
                        loading={loading}
                        onFocus={() => {
                          const entityType = getValues("entityType");

                          if (entityType) {
                            const alreadyFetchedForType =
                              entities?.length > 0 &&
                              entities[0]?.entityType === entityType;

                            if (!alreadyFetchedForType) {
                              fetchEntities(null, 1, MAGICNUMBER20, entityType);
                            }
                          }
                        }}
                        status={errors?.entity?.name ? "error" : ""}
                        className="capitalize"
                        disabled={!getValues("entityType")} // ✅ Disable if no entityType selected
                        onChange={(val) => {
                          const selected = entities.find(
                            (getEntity) => getEntity?.entity.id === val,
                          );
                          setValue("entity.id", val);
                          setValue("entity.name", selected?.entity?.name || "");
                          trigger("entity.name");
                        }}
                      />
                    );

                  case "industry":
                    return (
                      <Select
                        {...f}
                        placeholder={field.placeholder}
                        size="large"
                        showSearch
                        value={f.value || undefined}
                        options={industries.map((getIndustry) => ({
                          label: `${getIndustry?.code} - ${getIndustry?.name}`,
                          value: getIndustry?.code,
                        }))}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        loading={loading}
                        onFocus={() => {
                          if (industries.length === 0) {
                            fetchIndustries(null, 1, LIMIT_50).then(() =>
                              setIndustryPage(NUMBER_2),
                            );
                          }
                        }}
                        onPopupScroll={(e) => handlePopupScroll(e, "industry")}
                        className="capitalize"
                        onChange={(val) => {
                          const selected = industries.find(
                            (getIndustry) => getIndustry?.code === val,
                          );
                          setValue("industry.code", val);
                          setValue("industry.name", selected?.name || "");
                          trigger("industry.code");
                        }}
                      />
                    );

                  case "mcc":
                    return (
                      <Select
                        {...f}
                        placeholder={field.placeholder}
                        size="large"
                        mode="multiple"
                        value={
                          Array.isArray(f.value)
                            ? f.value.map((mcc) => mcc.code)
                            : []
                        }
                        options={mccCodes.map((mcc) => ({
                          label: `${mcc?.code} - ${mcc?.description}`,
                          value: mcc?.code,
                        }))}
                        loading={loading}
                        onFocus={() => {
                          if (mccCodes.length === 0) {
                            fetchMccCodes(null, 1, LIMIT_50).then(() => {
                              setMccPage(NUMBER_2); // ✅ start next page only after first load finishes
                            });
                          }
                        }}
                        onPopupScroll={(e) => handlePopupScroll(e, "mcc")}
                        optionRender={(option) => {
                          const currentCodes = Array.isArray(f.value)
                            ? f.value.map((mcc) => mcc.code)
                            : [];
                          const isSelected = currentCodes.includes(
                            option.value,
                          );

                          return (
                            <div className="flex items-center gap-3 p-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-4 h-4 appearance-none border border-purple rounded bg-white checked:border-purple cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:text-purple checked:after:text-xs checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 pointer-events-none"
                              />

                              <span className="text-sm font-medium text-black">
                                {option.label}
                              </span>
                            </div>
                          );
                        }}
                        className="w-full"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        maxTagCount="responsive"
                        onChange={(selectedCodes) => {
                          const currentMccs = Array.isArray(f.value)
                            ? f.value
                            : [];

                          const newCodes = selectedCodes.filter(
                            (code) =>
                              !currentMccs.some((mcc) => mcc.code === code),
                          );

                          const removedCodes = currentMccs
                            .filter((mcc) => !selectedCodes.includes(mcc.code))
                            .map((mcc) => mcc.code);

                          const newMccs = mccCodes.filter((mcc) =>
                            newCodes.includes(mcc.code),
                          );

                          const updatedMccs = currentMccs.filter(
                            (mcc) => !removedCodes.includes(mcc.code),
                          );

                          const finalMccs = [...updatedMccs, ...newMccs];

                          f.onChange(finalMccs);
                          trigger("mcc");
                        }}
                      />
                    );

                  default:
                    return (
                      <Input
                        {...f}
                        placeholder={field.placeholder}
                        size="large"
                        onChange={(e) => {
                          console.log(name);
                          const val = e.target.value;
                          if (["kyc.pan", "kyc.gst"].includes(name)) {
                            f.onChange(val.toUpperCase());
                          } else if (name === "kyc.cin") {
                            const value = e.target.value.trim();
                            f.onChange(value.toUpperCase());
                          } else {
                            f.onChange(val);
                          }
                          trigger(name);
                        }}
                      />
                    );
                }
              }}
            />
          </div>
        </Form.Item>
      );
    };

    const renderField = (field) => {
      const { label, value, display, name } = field;

      const displayValue =
        field.type === "mcc" && Array.isArray(value).length
          ? value.map((mcc) => `${mcc.id} - ${mcc.name}`).join(", ")
          : value;

      return (
        <div className="space-y-1">
          <label className="block text-sm text-primary-black-12">
            {displayValue ? label : ""}
          </label>
          {displayValue ? (
            display ? (
              <span
                className={`text-black font-semibold text-[15px] ${name === "description" ? "" : "capitalize"}`}
              >
                {display(displayValue)}
              </span>
            ) : (
              <div className="p-2 bg-gray-50 rounded border border-gray-200 min-h-10 flex items-center">
                <span
                  className={`text-black font-semibold text-[15px] ${name === "description" ? "" : "capitalize"}`}
                >
                  {displayValue}
                </span>
              </div>
            )
          ) : (
            renderInputField(field)
          )}
        </div>
      );
    };

    /** ----------------------------------------------
     *  JSX Render (mirrors your original layout)
     * ---------------------------------------------- */
    return (
      <div className="mt-8 overflow-hidden">
        <div className="w-full wrap-break-words">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            {informationRows.map((row) =>
              row.map((field) => (
                <div
                  key={field.key}
                  className={`${
                    field.span === NUMBER_3
                      ? "md:col-span-3 col-span-1"
                      : "col-span-1"
                  }`}
                >
                  {renderField(field)}
                </div>
              )),
            )}
          </div>

          {otherInformationFields.length > 0 && (
            <>
              <div className="h-px bg-primary-grey-7 my-6" />
              <h2 className="text-lg md:text-xl font-semibold text-primary-black-15">
                Other Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {otherInformationFields.map((field) => (
                  <div
                    key={field.key}
                    className={`${
                      ["textarea", "mcc"].includes(field.type)
                        ? "md:col-span-3"
                        : "col-span-1"
                    }`}
                  >
                    <Form layout="vertical" onSubmit={handleSubmit(onSubmit)}>
                      <div className="wrap-break-words whitespace-pre-wrap">
                        {renderField(field)}
                      </div>
                    </Form>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);

BusinessOnboarding.displayName = "BusinessOnboarding";
export default BusinessOnboarding;
