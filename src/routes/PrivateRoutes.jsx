import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import LottieLoader from "../components/UI/LottieUnique/LottieLoader";
import MainLayout from "../components/Layout/MainLayout";

const PrivateRoutes = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return <LottieLoader lottieKey="loaderIcon" />;
  }

  if (isAuthenticated) {
    return <MainLayout />;
  }

  return <Navigate to="/auth/callback" replace state={{ from: location }} />;
};

export default PrivateRoutes;
