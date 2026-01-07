import ImageLoader from "../../../../components/UI/ImageLoader";
import LottieLoader from "../../../../components/UI/LottieUnique/LottieLoader";
import { CheckOutlined } from "@ant-design/icons";

export default function StepSidebar({
  currentStep,
  completedSteps = [],
  onStepClick,
}) {
  console.log(completedSteps);

  const steps = [
    {
      key: "basic",
      label: "Basic Information",
      helper: "Your personal contact details to get started securely.",
      icon: <ImageLoader imageKey="BasicInfo" />,
    },
    {
      key: "business",
      label: "Business Information",
      helper: "Collect all essential business details for verification.",
      icon: <ImageLoader imageKey="BusinessInfo" />,
    },
    // {
    //   key: 'bankInformation',
    //   label: 'Bank & Financial Details',
    //   helper: 'Provide your bank details to enable secure payouts.',
    //   icon: <ImageLoader imageKey="BankInfo" />,
    // },
    {
      key: "kyc",
      label: "KYC Details",
      helper: "Verify your identity by uploading valid documents.",
      icon: <ImageLoader imageKey="KycInfo" />,
    },
  ];

  const getStepStatus = (key) => {
    const order = [
      "basic",
      "business",
      // 'bankInformation',
      "kyc",
      "riskManager",
      "completed",
    ];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(key);

    if (stepIndex === currentIndex) {
      return "active";
    }

    if (completedSteps.includes(key) || stepIndex < currentIndex) {
      return "completed";
    }

    return "pending";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 text-white flex flex-col flex-1">
        <div className="flex items-center mb-6">
          <div className="bg-white rounded-md shadow-sm flex items-center">
            <ImageLoader
              imageKey="excroLogo"
              className="object-contain w-40 p-1"
            />
          </div>
        </div>

        <h2 className="h3 font-semibold mb-2">Business Onboarding</h2>
        <p className="text-sm h3 text-gray-200 mb-5">
          Quick, simple, and secure setup.
        </p>

        <div className="relative">
          <div className="absolute left-4.75 top-3 bottom-3 w-0.5 bg-primary-theme-12" />
          <ul className="space-y-6 relative z-10">
            {steps.map((step) => {
              const status = getStepStatus(step.key);
              const clickable = status !== "pending";
              console.log(status);

              return (
                <li
                  key={step.key}
                  className={`flex items-center relative transition-all duration-200 ${
                    clickable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => clickable && onStepClick(step.key)}
                >
                  <div className="w-10 flex justify-center relative shrink-0">
                    {status === "completed" ? (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-theme-13 text-white">
                        <CheckOutlined />
                      </div>
                    ) : status === "active" ? (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-theme-13 text-white">
                        {step.icon}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10">
                        <div className="w-5 h-5 rounded-full border-2 border-violet bg-primary-theme-14" />
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <span
                      className={`block text-lg ${
                        status === "active"
                          ? "font-bold text-white"
                          : status === "completed"
                            ? "font-medium text-gray-300"
                            : "font-medium text-primary-purple-1"
                      }`}
                    >
                      {step.label}
                    </span>

                    {(status === "active" || status === "completed") && (
                      <p
                        className={`text-sm mt-1 ${
                          status === "active"
                            ? "text-white"
                            : status === "completed"
                              ? "text-primary-grey-4"
                              : ""
                        }`}
                      >
                        {step.helper}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto self-start -ml-20">
          <LottieLoader lottieKey="onboardCard" className="w-125" />
        </div>
      </div>
    </div>
  );
}
