import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import useOnboardingStore from "../../../store/useOnboardingStore";
import BasicInfo from "./Components/BasicInfo";
import BusinessInformation from "./Components/BusinessInformation";
import { CheckCircleFilled } from "@ant-design/icons";
import StepSidebar from "./Components/StepSidebar";
import ImageLoader from "../../../components/UI/ImageLoader";
import { showFailure, windowScrollTo } from "../../../utils";
import KYCAndAuthorized from "./Components/KycAndAuthorized";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RiskManager from "./Components/RiskManager";
import UniversalModal from "../../../components/UI/Modal/UniversalModal";
import { UniqueAvatar } from "../../../components/UI/Avatar/UniqueAvatar";
import LottieLoader from "../../../components/UI/LottieUnique/LottieLoader";

const MAGIC_NUMBER_500 = 500;
const MAGIC_NUMBER_3000 = 3000;
export default function OnboardingLayout() {
  const [activeStep, setActiveStep] = useState("basic");
  const [completedSteps, setCompletedSteps] = useState([]);

  const {
    onboardingData,
    isLoading,
    addOnboardingData,
    updateOnboardingData,
    fetchOnboardingData,
    resetOnboardingData,
    updateBtnLoading,
  } = useOnboardingStore();
  const { businessID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [closeOnboardModal, setCloseOnboardModal] = useState(false);

  const stepsOrder = ["basic", "business", "kyc", "riskManager", "completed"];

  const [isStepLoading, setIsStepLoading] = useState(false);

  const hasJustCreated = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!businessID && location) {
        resetOnboardingData();
        setActiveStep("basic");
        return;
      }

      // Only fetch if not freshly created
      if (businessID && !hasJustCreated.current) {
        setIsStepLoading(true);
        const result = await fetchOnboardingData(businessID);
        const status = result?.onboarding?.status;

        if (status) {
          const currentIndex = stepsOrder.indexOf(status);
          const completed =
            currentIndex > 0 ? stepsOrder.slice(0, currentIndex) : [];

          setCompletedSteps(completed);
          setActiveStep(status || "basic");
        }
        setIsStepLoading(false);
      } else {
        // reset the flag so that next navigation will trigger fetch
        hasJustCreated.current = false;
      }
    };

    loadData();
  }, [businessID, location]);

  const handleNext = async () => {
    if (formRef.current) {
      await formRef.current.submit();
    }
  };

  const handleBack = () => {
    windowScrollTo();
    const index = stepsOrder.indexOf(activeStep);
    if (index > 0) {
      setActiveStep(stepsOrder[index - 1]);
    }
  };

  const handleStepClick = (key) => {
    const currentIndex = stepsOrder.indexOf(activeStep);
    const clickedIndex = stepsOrder.indexOf(key);
    if (clickedIndex <= currentIndex || completedSteps.includes(key)) {
      windowScrollTo();
      setActiveStep(key);
    }
  };

  const handleStepSubmitInternal = async (stepKey, payload) => {
    windowScrollTo();
    try {
      setCompletedSteps((prev) =>
        prev.includes(stepKey) ? prev : [...prev, stepKey],
      );

      try {
        if (!businessID && stepKey === "basic") {
          const createResponse = await addOnboardingData(payload);
          const newClientId = createResponse?.businessId;
          if (newClientId) {
            hasJustCreated.current = true; // prevent refetch right after navigation

            // optional: fetch once manually before navigation if needed immediately
            const result = await fetchOnboardingData(newClientId);
            if (result?.onboarding?.status) {
              setActiveStep(result.onboarding.status || "basic");
            }

            setTimeout(() => {
              navigate(`${location.pathname}/${createResponse.businessId}`, {
                replace: true,
              });
            }, MAGIC_NUMBER_500);
          }
          return { businessID: newClientId };
        } else {
          // Steps 2–4 → Update
          const updateRes = await updateOnboardingData(
            payload,
            businessID,
            stepKey,
          );

          if (updateRes?.nextStep === "completed") {
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              navigate(`/merchant-generic-detail/${businessID}?tab=business`);
            }, MAGIC_NUMBER_3000);
            return;
          }

          const result = await fetchOnboardingData(businessID);
          if (result?.onboarding?.status) {
            setActiveStep(result.onboarding.status || "basic");
          }
        }
      } catch (err) {
        showFailure("Step submission failed:", err);
        throw err;
      }
    } catch (error) {
      showFailure("Something went wrong while saving.", error);
    }
  };

  const handleClose = () => {
    setCloseOnboardModal(false);
    navigate(`/merchant-generic-detail/${businessID}`);
  };

  const stepProps = {
    data: onboardingData || {},
    loading: isLoading,
    ref: formRef,
    from: "parent",
    onSubmit: (data) => handleStepSubmitInternal(activeStep, data),
  };

  const renderStep = () => {
    switch (activeStep) {
      case "basic":
        return <BasicInfo {...stepProps} />;
      case "business":
        return <BusinessInformation stepProps={stepProps} />;

      case "kyc":
        return <KYCAndAuthorized stepProps={stepProps} />;
      case "riskManager":
        return <RiskManager {...stepProps} />;
      default:
        return null;
    }
  };

  const getRenderStep = () => {
    switch (activeStep) {
      case "basic":
        return "Basic Information";
      case "business":
        return null;

      case "kyc":
        return "Authorized Signatory";
      default:
        return null;
    }
  };
  const excludedSteps = ["riskManager", "completed"];
  const visibleSteps = stepsOrder.filter(
    (step) => !excludedSteps.includes(step),
  );

  return isLoading || isStepLoading ? (
    <div className="flex justify-center items-center h-screen">
      <LottieLoader lottieKey="loaderIcon" className="w-37.5" />
    </div>
  ) : (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <div
          className="hidden md:flex flex-col w-132.5 text-white fixed top-0 left-0 bottom-0"
          style={{
            background:
              "linear-gradient(135deg, #454422 0% ,#463DFF 50%, #0497fe 100%)",
          }}
        >
          <div className="relative">
            <div className="absolute top-0 right-0">
              <ImageLoader imageKey="ArrowOnboard" />
            </div>
          </div>
          <StepSidebar
            currentStep={activeStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Main Content (Scrollable) */}
        <div className="flex-1 ml-0 md:ml-132.5 bg-bg-primary-black-14 flex flex-col relative">
          <div className="p-8 flex-1 overflow-y-auto pb-28">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-start">
                <div className="mb-3">
                  <h2 className="text-2xl font-semibold text-black">
                    {getRenderStep()}
                  </h2>
                  {!["business", "riskManager"].includes(activeStep) && (
                    <div className="h-[1.20px] w-12 bg-purple mt-2"></div>
                  )}
                </div>
              </div>
              {renderStep()}
            </div>
          </div>

          <div
            className={`fixed bottom-0 right-0 left-0 md:left-132.5 bg-white border-t border-gray-200 flex ${["riskManager"].includes(activeStep) ? "justify-end" : "justify-between"} items-center px-6 py-4 shadow-md z-50`}
          >
            {!["riskManager", "completed"].includes(activeStep) && (
              <p className="text-sm text-purple">
                Step {visibleSteps.indexOf(activeStep) + 1}/
                {visibleSteps.length}
              </p>
            )}

            <div className="flex items-center gap-3">
              {activeStep !== "basic" && (
                <div
                  className="text-primary-black-12 text-sm cursor-pointer"
                  onClick={handleBack}
                >
                  Back
                </div>
              )}

              <Button
                type="default"
                loading={updateBtnLoading}
                className="px-5 py-2 rounded-lg [&_.ant-btn-loading-icon]:mr-2 [&_.ant-btn-loading-icon]:mt-1"
                onClick={handleNext}
                disabled={updateBtnLoading}
              >
                <span className="text-white">
                  {activeStep === "kyc"
                    ? "Finish"
                    : activeStep === "riskManager"
                      ? "Confirm"
                      : "Next Step"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <UniversalModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          from="nobtn"
          closeIcon={false}
          width={400}
        >
          <div className="flex flex-col items-center justify-center text-center py-8">
            <CheckCircleFilled style={{ fontSize: 60, color: "#00C853" }} />
            <h2 className="text-xl font-semibold text-black mt-4">
              Business Profile Created
            </h2>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Your business details have been submitted successfully.
              <br />
              The next step is approval by our compliance team.
            </p>
          </div>
        </UniversalModal>
      )}
      {closeOnboardModal && (
        <UniversalModal
          isOpen={closeOnboardModal}
          onClose={() => setCloseOnboardModal(false)}
          from="nobtn"
          closeIcon={false}
          width={400}
        >
          <div className="items-center justify-center text-center p-6">
            <div className="flex justify-center items-center">
              <UniqueAvatar
                imgSrc="alertCircle"
                className="bg-[#FEF0C7] w-10 h-10 p-2 rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold text-black mt-4">
              Exit Onboarding
            </h2>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Are you sure you want to exit Onboarding?
            </p>
            <div className="flex justify-center items-center gap-3 mt-3">
              <div
                className="text-primary-black-12 cursor-pointer"
                onClick={() => setCloseOnboardModal(false)}
              >
                No
              </div>
              <Button
                type="default"
                className="px-6 py-2 rounded-md"
                onClick={handleClose}
              >
                <span className="text-white">Yes</span>
              </Button>
            </div>
          </div>
        </UniversalModal>
      )}
    </>
  );
}
