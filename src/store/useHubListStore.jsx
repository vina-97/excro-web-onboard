import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useHubListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  hubList: [],
  isLastPage: false,

  fetchHubList: (page = 1, limit = LIMIT, filterQuery = "") => {
    set({ isLoading: true });
    const finalQuery = filterQuery?.toString()
      ? `&${filterQuery?.toString()}`
      : "";

    ApiCall.get(
      `onboarding/properties/hub?page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const hubList = response.data.hubs || [];
          set({
            page,
            limit,
            hubList,
            isLastPage,
            isLoading: false,
          });
        } else {
          showFailure(response?.message);
          set({ isLoading: false });
        }
      },
    );
  },
}));
export default useHubListStore;
