import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import OnboardingLayout from "../../pages/Business/BusinessFlows/OnboardingLayout";
import { useEffect } from "react";

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return location?.pathname.startsWith("/create-business") ? (
    <OnboardingLayout />
  ) : (
    <div className="flex flex-col h-screen overflow-hidden scrollbar-none">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 h-full overflow-y-auto px-7.5 pt-4.75! pb-4 bg-[#F7F7F7]!">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
