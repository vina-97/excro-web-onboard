import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useBankListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  banktList: [],
  isLastPage: false,
  clientInfo: {},

  fetchBankList: (page = 1, limit = LIMIT, clientID, filterQuery = "") => {
    set({ isLoading: true });
    console.log(filterQuery);
    // const finalQuery = filterQuery?.toString()
    //   ? `&${filterQuery?.toString()}`
    //   : '';

    ApiCall.get(
      `onboarding/bank/${clientID}`,
      // `onboarding/bank?clientId=${clientID}&page=${page}&limit=${limit}${finalQuery}`,
      (response) => {
        if (response?.success) {
          const { isLastPage = false } = response?.data || [];
          const bankList = response?.data?.bank || [];
          set({
            page,
            limit,
            bankList,
            isLastPage,
            isLoading: false,
            clientInfo: response?.data?.client || {},
          });
        } else {
          showFailure(response?.message);
          set({ isLoading: false });
        }
      },
    );
  },
}));
export default useBankListStore;
