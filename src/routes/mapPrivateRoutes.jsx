import { Suspense } from "react";

const mapPrivateRoutes = (routes) =>
  routes.map(({ path, component: Component }) => ({
    path,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  }));
export default mapPrivateRoutes;
