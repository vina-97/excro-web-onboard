import { toast } from "react-hot-toast";
import { AlertTriangle, Info } from "lucide-react";
// import CheckVerify from '../../assets/images/common-icons/check-verified-01.svg';
// import FailureIcon from '../../assets/images/common-icons/Failure.svg';
import onboardSuccessToast from "../../assets/images/common-icons/onboard-business-success-toast.svg";
import onboardErrorToast from "../../assets/images/common-icons/onboard-business-error-toast.svg";
import closeIcon from "../../assets/images/common-icons/onboard_business_close_icon.svg";

export const showToast = (type, msg) => {
  toast.dismiss();

  toast.custom((t) => {
    const icons = {
      success: <img src={onboardSuccessToast} className="w-7 h-7" />,
      error: <img src={onboardErrorToast} className="w-7 h-7" />,
      warning: <AlertTriangle size={16} className="text-yellow-600" />,
      info: <Info size={16} className="text-blue-600" />,
    };

    const borderColors = {
      success: "border-green-500",
      error: "border-red-500",
      warning: "border-yellow-500",
      info: "border-blue-500",
    };

    return (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } flex items-center justify-between p-2 rounded-[4px] shadow-lg bg-white`}
      >
        <div className="flex items-center">
          <div
            className={`w-8 h-8 ${borderColors[type]} flex items-center justify-center mr-3`}
          >
            {icons[type]}
          </div>
          <span className="text-sm font-medium text-[#010101]">
            {msg.charAt(0).toUpperCase() + msg.slice(1)}
          </span>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex items-center border border-transparent hover:border-[#999] hover:bg-gray-100 justify-center p-2 bg-white w-fit rounded-[5px] transition-all shadow-[0_2px_2px_0_rgba(16,24,40,0.05)] hover:shadow-[0_4px_4px_0_rgba(16,24,40,0.1)] cursor-pointer ml-4 text-gray-400 hover:text-gray-600"
        >
          <img src={closeIcon} alt="close" />
        </button>
      </div>
    );
  });
};
