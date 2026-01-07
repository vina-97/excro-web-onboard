import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";
const LIMIT = 10;
const useKYCDocListStore = create((set) => ({
  page: 1,
  limit: LIMIT,
  isLoading: true,
  kycDocList: [],
  isLastPage: false,

  //   fetchKycDocList: (page = 1, limit = LIMIT, filterQuery = '') => {
  //     //console.log(param, "test param");
  //     console.log(filterQuery, 'filterQuery filterQueryfilterQueryfilterQuery');

  //     set({ isLoading: true });
  //     const finalQuery = filterQuery?.toString()
  //       ? `&${filterQuery?.toString()}`
  //       : '';

  //     ApiCall.get(
  //       `onboarding/kyc-document?page=${page}&limit=${limit}${finalQuery}`,
  //       (response) => {
  //         if (response?.success) {
  //           const { isLastPage = false } = response?.data || [];
  //           const kycDocList = response.data || [];
  //           set({
  //             page,
  //             limit,
  //             kycDocList,
  //             isLastPage,
  //             isLoading: false,
  //           });
  //         } else {
  //           showFailure(response?.message);
  //           set({ isLoading: false });
  //         }
  //       }
  //     );
  //   },

  fetchKycDocList: (page = 1, limit = LIMIT, approveList, query) => {
    set({ isLoading: true });

    const finalQuery = query ? `&type=${query}` : "";
    let url = `onboarding/kyc-document?`;

    if (approveList) {
      url += `${approveList}&`;
    }

    url += `page=${page}&limit=${limit}${finalQuery}`;

    console.log("Final API URL:", url);

    ApiCall.get(url, (response) => {
      if (response?.success) {
        const { isLastPage = false } = response?.data || {};
        const kycDocList = response.data || [];
        set({
          page,
          limit,
          kycDocList,
          isLastPage,
          isLoading: false,
        });
      } else {
        showFailure(response?.message);
        set({ isLoading: false });
      }
    });
  },
}));
export default useKYCDocListStore;
