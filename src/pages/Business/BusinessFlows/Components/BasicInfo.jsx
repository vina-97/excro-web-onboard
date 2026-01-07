import { forwardRef, useImperativeHandle, useEffect } from "react";
import { Input, Form } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { basicSchema } from "../validations/basicSchema";
import { useParams } from "react-router-dom";

const BasicInfo = forwardRef(({ data, onSubmit }, ref) => {
  const { businessID } = useParams();

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(basicSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: (data?.name || "").trim(),
      email: (data?.email || "").trim(),
      phone: {
        countryCode: (data?.phone?.countryCode || "+91").trim(),
        number: (data?.phone?.number || "").trim(),
      },
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", (data.name || "").trim());
      setValue("email", (data.email || "").trim());
      setValue("phone.countryCode", (data.phone?.countryCode || "+91").trim());
      setValue("phone.number", (data.phone?.number || "").trim());
    }
  }, [data, setValue]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      const valid = await trigger();
      if (valid) {
        onSubmit(getValues());
        return true;
      }
      return false;
    },
  }));

  return (
    <Form
      layout="vertical"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 w-full max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Enter Your Full Name*"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="e.g., John Doe"
                {...field}
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
                  trigger("name");
                }}
                maxLength={100}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Contact Number*"
          validateStatus={errors.phone?.number ? "error" : ""}
          help={errors.phone?.number?.message}
        >
          <Controller
            name="phone.number"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="e.g., 9090909090"
                {...field}
                status={errors.phone?.number ? "error" : ""}
                onChange={(e) => {
                  const numbersOnly = e.target.value.replace(/\D/g, "");
                  field.onChange(numbersOnly);
                  trigger("phone.number");
                }}
                minLength={10}
                maxLength={10}
              />
            )}
          />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Email Address*"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="e.g., johndoe@gmail.com"
                {...field}
                status={errors.email ? "error" : ""}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  field.onChange(value);
                  trigger("email");
                }}
                disabled={businessID}
              />
            )}
          />
        </Form.Item>
      </div>
    </Form>
  );
});

BasicInfo.displayName = "BasicInfo";

export default BasicInfo;
