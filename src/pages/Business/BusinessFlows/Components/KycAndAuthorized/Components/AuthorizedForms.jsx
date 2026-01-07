import { Button, Form, Input, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authorizedSchema } from "../../../validations/authorizedSchema";
import ImageLoader from "../../../../../../components/UI/ImageLoader";
import useOnboardingStore from "../../../../../../store/useOnboardingStore";
import { useParams } from "react-router-dom";
import { showFailure } from "../../../../../../utils";

const AuthorizedForms = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState({});
  const [validatedPans, setValidatedPans] = useState(new Set());
  const NUMBER_10 = 10;
  const NUMBER_150 = 150;

  const ALLOWED_AUTHORIZED_SIGNATORY = 12;
  const { fetchAuthorizedData } = useOnboardingStore();
  const { businessID } = useParams();

  const {
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorizedSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      authorizedRecords:
        data?.authorizedSignatory?.length > 0
          ? data.authorizedSignatory.map((record) => ({
              name: (record.name || "").trim(),
              pan: (record.pan || "").trim(),
              isVerified: record.isVerified || false,
            }))
          : [{ name: "", pan: "", isVerified: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authorizedRecords",
  });

  const watchPanFields = watch("authorizedRecords");
  const debouncedVerifyRef = useRef();
  const lastValidationRef = useRef({});

  useEffect(() => {
    const fn = (idx, pan, name) => triggerPanValidation(idx, pan, name);
    let t = null;
    debouncedVerifyRef.current = (idx, pan, name) => {
      if (t) {
        clearTimeout(t);
      }
      t = setTimeout(() => fn(idx, pan, name), NUMBER_150);
    };
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  }, []);
  console.log(verifiedStatus);

  useEffect(() => {
    if (data?.authorizedSignatory?.length > 0) {
      remove();

      const newStatus = {};
      const newValidatedSet = new Set();

      data?.authorizedSignatory.forEach((record, index) => {
        if (index === 0) {
          setValue(
            `authorizedRecords.${index}.name`,
            (record.name || "").trim(),
          );
          setValue(`authorizedRecords.${index}.pan`, (record.pan || "").trim());
          setValue(
            `authorizedRecords.${index}.isVerified`,
            record.isVerified || false,
          );
        } else {
          append({
            name: (record.name || "").trim(),
            pan: (record.pan || "").trim(),
            isVerified: record.isVerified || false,
          });
        }

        if (record.isVerified) {
          newStatus[index] = "verified";
          newValidatedSet.add(
            `${index}-${(record.pan || "").trim()}-${(record.name || "").trim()}`,
          );
        } else {
          newStatus[index] = "invalid";
        }
      });

      setVerifiedStatus(newStatus);
      setValidatedPans(newValidatedSet);
    }
  }, [data]);

  const triggerPanValidation = async (index, panValue, nameValue) => {
    const trimmedPan = (panValue || "").trim();
    const trimmedName = (nameValue || "").trim();

    if (!trimmedPan || !trimmedName) {
      return;
    }

    const validationKey = `${index}-${trimmedPan}-${trimmedName}`;

    if (validatedPans.has(validationKey)) {
      return;
    }

    if (lastValidationRef.current[validationKey]) {
      return;
    }

    lastValidationRef.current[validationKey] = true;

    setLoading(true);
    try {
      const response = await fetchAuthorizedData(businessID, {
        pan: trimmedPan,
        name: trimmedName,
      });

      if (response?.isVerified) {
        setVerifiedStatus((prev) => ({ ...prev, [index]: "verified" }));
        setValue(`authorizedRecords.${index}.isVerified`, true);
        setValidatedPans((prev) => new Set([...prev, validationKey]));
      } else {
        setVerifiedStatus((prev) => ({ ...prev, [index]: "invalid" }));
        setValue(`authorizedRecords.${index}.isVerified`, false);
      }
    } catch (error) {
      message.error("PAN validation failed", error);
      showFailure(error);
    } finally {
      setLoading(false);
      delete lastValidationRef.current[validationKey];
    }
  };

  const addRecord = () => {
    append({ name: "", pan: "", isVerified: false });
  };

  const removeRecord = (index) => {
    if (fields.length > 1) {
      remove(index);

      // Clean up verified status
      const updatedStatus = { ...verifiedStatus };
      delete updatedStatus[index];
      const reindexed = {};
      Object.entries(updatedStatus).forEach(([key, val]) => {
        const newKey = key > index ? key - 1 : key;
        reindexed[newKey] = val;
      });
      setVerifiedStatus(reindexed);

      // Clean up validated pans for removed index
      setValidatedPans((prev) => {
        const newSet = new Set();
        prev.forEach((item) => {
          const [itemIndex] = item.split("-");
          if (parseInt(itemIndex) !== index) {
            newSet.add(item);
          }
        });
        return newSet;
      });
    } else {
      showFailure("At least one authorized record is required");
    }
  };

  const isRecordVerified = (index) => verifiedStatus[index] === "verified";
  const isNameFilled = (index) => {
    const nameValue = watchPanFields?.[index]?.name || "";
    return nameValue.trim().length > 0;
  };

  return (
    <Form layout="vertical" className="space-y-2 w-full max-w-4xl">
      <div className="text-xs text-gray-500">
        * PAN will be automatically validated when 10 characters are entered and
        name is provided
      </div>
      <div className="text-xs text-gray-500">
        * You can add up to 12 authorized signatories.
      </div>

      {(fields.length || 0) < ALLOWED_AUTHORIZED_SIGNATORY && (
        <div className="mt-3">
          <Button type="default" className="bg-white!" onClick={addRecord}>
            <ImageLoader
              imageKey="onboardMenuAdd"
              className="w-5 h-5 cursor-pointer mr-2"
            />
            Add Signatory
          </Button>
        </div>
      )}

      <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-3">
        {fields.map((field, index) => {
          const status = verifiedStatus[index];
          const showDelete =
            !isRecordVerified(index) && fields.length > 1 && index !== 0;
          const panDisabled =
            !isNameFilled(index) || loading || isRecordVerified(index);

          return (
            <div key={field.id} className="flex items-start gap-4 w-full">
              <div
                className={`grid grid-cols-[1fr_1fr] gap-3 ${showDelete ? "w-[calc(100%-32px)]" : "w-full"}`}
              >
                <Form.Item
                  label="Name*(As per Govt. ID)"
                  validateStatus={
                    errors.authorizedRecords?.[index]?.name ? "error" : ""
                  }
                  help={errors.authorizedRecords?.[index]?.name?.message}
                  className="mb-0 w-full"
                >
                  <Controller
                    name={`authorizedRecords.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="e.g., John Doe"
                        {...field}
                        disabled={loading || isRecordVerified(index)}
                        status={errors.name ? "error" : ""}
                        onChange={(e) => {
                          let value = e.target.value;

                          // Allow only letters, spaces, and periods
                          value = value.replace(/[^A-Za-z\s.]/g, "");

                          // Prevent leading spaces (no space before the first letter)
                          value = value.replace(/^\s+/, "");

                          // Prevent multiple consecutive spaces
                          value = value.replace(/\s{2,}/g, " ");

                          field.onChange(value);
                          field.onChange(value);
                          trigger(`authorizedRecords.${index}.name`);

                          // Clear PAN field and verification status if name is cleared
                          if (!value) {
                            setValue(`authorizedRecords.${index}.pan`, "");
                            setValue(
                              `authorizedRecords.${index}.isVerified`,
                              false,
                            );
                            setVerifiedStatus((prev) => {
                              const newStatus = { ...prev };
                              delete newStatus[index];
                              return newStatus;
                            });

                            // Clear validated pans for this index
                            setValidatedPans((prev) => {
                              const newSet = new Set();
                              prev.forEach((item) => {
                                const [itemIndex] = item.split("-");
                                if (parseInt(itemIndex) !== index) {
                                  newSet.add(item);
                                }
                              });
                              return newSet;
                            });
                          }
                        }}
                        onBlur={(e) => {
                          // Trim on blur as well
                          const trimmedValue = e.target.value.trim();
                          if (trimmedValue !== field.value) {
                            field.onChange(trimmedValue);
                          }
                        }}
                      />
                    )}
                  />
                </Form.Item>
                <Form.Item
                  label="PAN*"
                  validateStatus={
                    errors.authorizedRecords?.[index]?.pan ? "error" : ""
                  }
                  help={errors.authorizedRecords?.[index]?.pan?.message}
                  className="mb-0 w-full"
                >
                  <Controller
                    name={`authorizedRecords.${index}.pan`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="e.g., ABCD1234PQRS"
                        {...field}
                        maxLength={10}
                        disabled={panDisabled}
                        suffix={
                          status === "verified" ? (
                            <ImageLoader
                              imageKey="verifiedIcon"
                              className="w-5 h-5"
                            />
                          ) : status === "invalid" ? (
                            <ImageLoader
                              imageKey="mismatchedIcon"
                              className="w-5 h-5"
                            />
                          ) : null
                        }
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toUpperCase()
                            .trim();
                          field.onChange(value);
                          trigger(`authorizedRecords.${index}.pan`);

                          const nameValue = (
                            watchPanFields?.[index]?.name || ""
                          ).trim();
                          const validationKey = `${index}-${value}-${nameValue}`;

                          if (
                            value.length === NUMBER_10 &&
                            nameValue &&
                            !validatedPans.has(validationKey) &&
                            !loading
                          ) {
                            debouncedVerifyRef.current?.(
                              index,
                              value,
                              nameValue,
                            );
                          }
                        }}
                        onBlur={(e) => {
                          // Trim on blur as well
                          const trimmedValue = e.target.value.trim();
                          if (trimmedValue !== field.value) {
                            field.onChange(trimmedValue);
                          }
                        }}
                      />
                    )}
                  />
                </Form.Item>
              </div>

              <div className="flex items-start pt-12 w-8 min-w-8">
                {!isRecordVerified(index) &&
                  fields.length > 1 &&
                  index !== 0 && (
                    <ImageLoader
                      imageKey="onboardMenuDelete"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => removeRecord(index)}
                    />
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default AuthorizedForms;
