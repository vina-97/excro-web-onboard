import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useClientListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  clientList: [],
  isLastPage: false,

  fetchClientList: (page = 1, limit = LIMIT, filterQuery = "") => {
    //console.log(param, "test param");
    console.log(filterQuery, "filterQuery filterQueryfilterQueryfilterQuery");

    set({ isLoading: true });
    const finalQuery = filterQuery?.toString()
      ? `&${filterQuery?.toString()}`
      : "";

    ApiCall.get(
      `onboarding/client?page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const clientList = response.data || [];
          set({
            page,
            limit,
            clientList,
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
export default useClientListStore;
