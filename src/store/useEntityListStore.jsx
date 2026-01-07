import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure, showSuccess } from "../utils";
const LIMIT = 10;
const useEntityListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  entityList: [],
  entityDetail: {},
  apiDocsList: [],
  apiOcrList: [],
  isLastPage: false,
  setApiDocsList: (data) => set({ apiDocsList: data }),

  fetchEntityList: (page = 1, limit = LIMIT, filterQuery = "") => {
    set({ isLoading: true });

    const params = new URLSearchParams(filterQuery);

    // ✅ Remove status if value is "all"
    if (params.get("status") === "all") {
      params.delete("status");
    }

    const finalQuery = params.toString() ? `&${params.toString()}` : "";

    // const finalQuery = filterQuery?.toString()
    //   ? `&${filterQuery?.toString()}`
    //   : '';

    ApiCall.get(
      `onboarding/properties/entity?page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const entityList = response?.data?.entities || [];
          set({
            page,
            limit,
            entityList,
            isLastPage,
            isLoading: false,
          });
        } else {
          // showFailure(response?.message);
          set({ isLoading: false });
        }
      },
    );
  },
  changeEntityStatus: (page, id, callBack) => {
    set({ isLoading: true });
    ApiCall.patch(
      `onboarding/properties/entity/${id}/status`,
      {},
      (response) => {
        if (response.success) {
          console.log(response);
          showSuccess(response?.message);
          set({
            page,
            isLoading: false,
          });
          callBack(response.success);
        } else {
          showFailure(response?.message);
          set({ isLoading: false });
        }
      },
    );
  },

  createEntity: (data, callback) => {
    set({ isLoading: true });
    ApiCall.post(`onboarding/properties/entity`, data, (res) => {
      console.log(res, "responses");
      if (res.success) {
        showSuccess(res);
        callback(res);
        set({
          isLoading: false,
        });
      } else {
        showFailure(res?.message);
        set({ isLoading: false });
      }
    });
  },

  fetchEntityDetail: (id) => {
    set({ isLoading: true });
    ApiCall.get(`onboarding/properties/entity/${id}`, (res) => {
      if (res.success) {
        set({
          entityDetail: res?.data || [],
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
        });
      }
    });
  },

  updateEntity: (id, data, callback) => {
    set({ isLoading: true });
    ApiCall.patch(`onboarding/properties/entity/${id}`, data, (res) => {
      console.log(res, "responses");
      if (res.success) {
        showSuccess(res);
        callback(res);
        set({
          isLoading: false,
        });
      } else {
        showFailure(res?.message);
        set({ isLoading: false });
      }
    });
  },

  getApiDocuments: () => {
    ApiCall.get(`onboarding/api-documents/list-api-docs`, (res) => {
      if (res) {
        const docsresult = Object.entries(res?.data?.doc_verification[0]).map(
          ([key, value]) => ({
            value: key,
            label: value,
          }),
        );
        const ocrresult = Object.entries(res?.data?.ocr[0]).map(
          ([key, value]) => ({
            value: key,
            label: value,
          }),
        );

        set({
          isLoading: false,
          apiDocsList: docsresult || [],
          apiOcrList: ocrresult || [],
        });
      }
    });
  },

  deleteEntity: (id, callback) => {
    // /api/v2/onboarding/properties/entity/{entityId}
    ApiCall.delete(`onboarding/properties/entity/${id}`, {}, (res) => {
      if (res) {
        if (res.success) {
          showSuccess(res);
          callback(res);
          set({
            isLoading: false,
          });
        } else {
          showFailure(res?.message);
          set({ isLoading: false });
        }
      }
    });
  },
}));
export default useEntityListStore;
