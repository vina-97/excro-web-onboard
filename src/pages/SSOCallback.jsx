import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showFailure, showSuccess } from "../utils";
import { useAuthStore } from "../store/auth-store";
import ImageLoader from "../components/UI/ImageLoader";
import ApiCall from "../utils/ApiCall";

const SSOCallback = () => {
  console.log("firstIN");

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setChecking } = useAuthStore();
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) {
      return;
    }
    hasVerifiedRef.current = true;

    const validateSSOParams = (params) => {
      const code = params.get("code");
      const from = params.get("from");

      if (!code) {
        return "Invalid SSO request (missing code)";
      }

      if (!["merchant", "entity"].includes(from)) {
        return "Invalid SSO source";
      }

      return null;
    };

    const resolveSSORoute = ({
      from,
      merchantId,
      entityId,
      onboardingStatus,
    }) => {
      if (from === "merchant") {
        if (onboardingStatus === "pending") {
          return merchantId
            ? `/create-business/${merchantId}`
            : "/create-business";
        }

        return merchantId
          ? `/merchant-generic-detail/${merchantId}?tab=business`
          : "/create-business";
      }

      if (from === "entity") {
        return entityId ? `/edit-entity/${entityId}` : "/create-entity";
      }

      return "/create-business";
    };

    const verify = () => {
      const validationError = validateSSOParams(params);

      if (validationError) {
        showFailure(validationError);
        setAuth(false);
        return;
      }

      const code = params.get("code");
      const from = params.get("from");
      const merchantId = params.get("merchantId");
      const entityId = params.get("entityId");
      const onboardingStatus = params.get("onboardingStatus");

      setChecking(true);

      ApiCall.get(`sso/exchange?code=${code}`, (res) => {
        setChecking(false);

        if (!res?.success) {
          setAuth(false);
          showFailure(res?.message || "Authentication failed");
          return;
        }

        setAuth(true);
        showSuccess(res);

        const redirectPath = resolveSSORoute({
          from,
          merchantId,
          entityId,
          onboardingStatus,
        });

        navigate(redirectPath, { replace: true });
      });
    };

    verify();
  }, [params, navigate, setAuth, setChecking]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-indigo-100">
      <div className="flex flex-col items-center text-center animate-pulse">
        <ImageLoader imageKey="rugrLogo" className="w-30 h-30" />
        <h2 className="text-lg font-semibold text-gray-800 mt-5">
          Verifying your details
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Please wait while we securely validate your details.
        </p>
      </div>
    </div>
  );
};

export default SSOCallback;
