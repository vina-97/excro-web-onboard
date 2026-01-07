import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useKycCategoryListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  categoryList: [],
  isLastPage: false,

  fetchCategoryList: (page = 1, limit = LIMIT, filterQuery = "") => {
    //console.log(param, "test param");
    //console.log(filterQuery, 'filterQuery filterQueryfilterQueryfilterQuery');

    set({ isLoading: true });
    const finalQuery = filterQuery?.toString()
      ? `&${filterQuery?.toString()}`
      : "";

    ApiCall.get(
      `onboarding/kyc-category?page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const categoryList = response.data || [];
          set({
            page,
            limit,
            categoryList,
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
export default useKycCategoryListStore;
