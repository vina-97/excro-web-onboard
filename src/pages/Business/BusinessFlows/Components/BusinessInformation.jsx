import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form, Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { businessSchema } from "../validations/businessSchema";
import ImageLoader from "../../../../components/UI/ImageLoader";
import BusinessOnboarding from "./BusinessOnboarding";
import useOnboardingStore from "../../../../store/useOnboardingStore";
import { useParams } from "react-router-dom";

const NUMBER_500 = 500;
const NUMBER_2 = 2;

export default function BusinessInformation({ stepProps }) {
  console.log(stepProps);

  const { fetchBusinessData, onboardingData, btnLoading } =
    useOnboardingStore();
  const [step, setStep] = useState(
    onboardingData?.business &&
      Object.keys(onboardingData?.business)?.length > 0
      ? NUMBER_2
      : 1,
  );
  const { businessID } = useParams();
  const [businessData, setBusinessData] = useState(
    onboardingData?.business || null,
  );

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(businessSchema),
    mode: "onChange",
    defaultValues: {
      idValue:
        onboardingData?.business?.kyc?.gst ||
        onboardingData?.business?.kyc?.cin ||
        onboardingData?.business?.kyc?.pan ||
        "",
    },
  });

  const onProceed = async () => {
    const valid = await trigger();
    if (valid) {
      {
        if (step === 1) {
          const records = await fetchBusinessData(
            businessID,
            getValues()?.idValue.trim(),
          );
          setBusinessData(records);
          setTimeout(() => setStep(NUMBER_2), NUMBER_500);
          return;
        } else {
          const records = await fetchBusinessData(
            businessID,
            getValues()?.idValue.trim(),
          );
          setBusinessData(records);
          return;
        }
      }
    }
    return false;
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full mx-auto p-30"
          >
            <div className="flex flex-col items-center">
              <div className="mb-3">
                <ImageLoader imageKey="BusinessLogoWithClock" />
              </div>
              <div className="flex flex-wrap items-baseline justify-center gap-2 text-center max-w-[480px]">
                <h1 className="text-2xl font-semibold text-black">
                  GST Number or CIN Number or Pan Card
                </h1>
                <p className="text-primary-black-12 text-sm leading-relaxed">
                  Provide your GST Number, CIN Number, or PAN Card. We&apos;ll
                  auto-fetch your registered business details for faster
                  onboarding.
                </p>
              </div>

              <div className="mt-5 w-full flex justify-center">
                <div className="w-full max-w-xl">
                  <Form layout="vertical" onFinish={handleSubmit(onProceed)}>
                    <Form.Item
                      label=""
                      validateStatus={errors.idValue ? "error" : ""}
                      help={errors.idValue?.message}
                    >
                      <Controller
                        name="idValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={(field.value || "").toUpperCase()}
                            onChange={(e) => {
                              setValue("idValue", e.target.value.toUpperCase());
                              trigger("idValue");
                            }}
                            size="large"
                            placeholder="eg., 36ABCDE1234F1Z5 ''or'' L12345DL2015PLC012345 ''or'' AAAPL1234C"
                            aria-label="GST/CIN/PAN"
                            maxLength={21}
                            className="!pr-0 !rounded-lg"
                            suffix={
                              <Button
                                type="default"
                                size="large"
                                onClick={onProceed}
                                loading={btnLoading}
                                disabled={btnLoading}
                                className="!rounded-md !text-white !bg-purple !border-0 [&_.ant-btn-loading-icon]:mr-2 [&_.ant-btn-loading-icon]:mt-1"
                              >
                                Proceed
                              </Button>
                            }
                          />
                        )}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === NUMBER_2 && (
          <motion.div
            key="step2"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center">
              <div className="flex flex-wrap items-baseline justify-center gap-2 text-center max-w-[480px]">
                <h1 className="text-2xl font-semibold text-black">
                  GST Number or CIN Number or Pan Card
                </h1>
                <p className="text-primary-black-12 text-sm leading-relaxed">
                  Business information will be auto fetched from number
                </p>
              </div>

              <div className="mt-5 w-full flex justify-center">
                <div className="w-full max-w-xl">
                  <Form layout="vertical" onFinish={handleSubmit(onProceed)}>
                    <Form.Item
                      label=""
                      validateStatus={errors.idValue ? "error" : ""}
                      help={errors.idValue?.message}
                    >
                      <Controller
                        name="idValue"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={(field.value || "").toUpperCase()}
                            onChange={(e) => {
                              setValue("idValue", e.target.value.toUpperCase());
                              trigger("idValue");
                            }}
                            size="large"
                            placeholder="eg., 36ABCDE1234F1Z5 ''or'' L12345DL2015PLC012345 ''or'' AAAPL1234C"
                            aria-label="GST/CIN/PAN"
                            maxLength={21}
                            className="!pr-0 !rounded-lg"
                            suffix={
                              <Button
                                type="default"
                                size="large"
                                onClick={onProceed}
                                loading={btnLoading}
                                disabled={btnLoading}
                                className="!rounded-md !text-white !bg-purple !border-0 [&_.ant-btn-loading-icon]:mr-2 [&_.ant-btn-loading-icon]:mt-1"
                              >
                                Proceed
                              </Button>
                            }
                          />
                        )}
                      />
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            {/* <button
              onClick={() => setStep(1)}
              className="text-purple-600 text-sm underline"
            >
              ← Go Back
            </button> */}
            <BusinessOnboarding businessData={businessData} {...stepProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
