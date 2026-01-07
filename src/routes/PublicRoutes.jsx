import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

const PublicRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  const [params] = useSearchParams();

  const code = params.get("code");
  const from = params.get("from");
  const merchantId = params.get("merchantId");
  const entityId = params.get("entityId");
  const onboardingStatus = params.get("onboardingStatus");

  if (!isAuthenticated || !code) {
    return <Outlet />;
  }

  if (from === "merchant") {
    if (onboardingStatus === "pending") {
      return (
        <Navigate
          to={
            merchantId ? `/create-business/${merchantId}` : "/create-business"
          }
          replace
        />
      );
    }

    if (merchantId) {
      return (
        <Navigate
          to={`/merchant-generic-detail/${merchantId}?tab=business`}
          replace
        />
      );
    }

    return <Navigate to="/create-business" replace />;
  }

  if (from === "entity") {
    return (
      <Navigate
        to={entityId ? `/edit-entity/${entityId}` : "/create-entity"}
        replace
      />
    );
  }

  return <Navigate to="/create-business" replace />;
};

export default PublicRoutes;
