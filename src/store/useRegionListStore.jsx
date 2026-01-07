import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useRegionListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  regionList: [],
  isLastPage: false,

  fetchRegionList: (page = 1, limit = LIMIT, filterQuery = "") => {
    //console.log(param, "test param");
    console.log(filterQuery, "filterQuery filterQueryfilterQueryfilterQuery");

    set({ isLoading: true });
    const finalQuery = filterQuery?.toString()
      ? `&${filterQuery?.toString()}`
      : "";

    ApiCall.get(
      `onboarding/properties/region?page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const regionList = response.data.regions || [];
          set({
            page,
            limit,
            regionList,
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
export default useRegionListStore;
