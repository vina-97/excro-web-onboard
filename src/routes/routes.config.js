import { lazy } from "react";

export const lazyComponents = {
  EntityDetail: lazy(
    () => import("../pages/Entity/AddEditEntity/EntityDetail"),
  ),
  MerchantGenericDetail: lazy(
    () => import("../pages/Business/BusinessDetails/GenericDetail"),
  ),
  WebCheckDetail: lazy(
    () => import("../pages/Business/GASDetails/WebSiteChecks/WebCheckDetail"),
  ),
  AMLCheckDetails: lazy(
    () => import("../pages/Business/GASDetails/AMLChecks/AMLCheckDetails"),
  ),
  AMLCheckList: lazy(
    () => import("../pages/Business/GASDetails/AMLChecks/AMLCheckList"),
  ),
  OnboardingLayout: lazy(
    () => import("../pages/Business/BusinessFlows/OnboardingLayout"),
  ),
  Datachecks: lazy(
    () => import("../pages/Business/GASDetails/DataChecks/DataCheck"),
  ),
};

export const routes = [
  {
    path: "/create-business",
    component: lazyComponents.OnboardingLayout,
  },
  {
    path: "/create-business/:businessID",
    component: lazyComponents.OnboardingLayout,
  },

  {
    path: "/merchant-generic-detail/:businessID",
    component: lazyComponents.MerchantGenericDetail,
  },
  {
    path: "/merchant-generic-detail/website-check/:businessID",
    component: lazyComponents.WebCheckDetail,
  },
  {
    path: "/merchant-generic-detail/aml-search-results/:businessID",
    component: lazyComponents.AMLCheckList,
  },
  {
    path: "/merchant-generic-detail/aml-search-results/aml-sanction-detail/:businessID",
    component: lazyComponents.AMLCheckDetails,
  },
  {
    path: "/merchant-generic-detail/data-checks/:businessID",
    component: lazyComponents.Datachecks,
  },
  {
    path: "/create-entity",
    component: lazyComponents.EntityDetail,
  },
  {
    path: "/edit-entity/:entityId",
    component: lazyComponents.EntityDetail,
  },
];
