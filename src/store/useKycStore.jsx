import { create } from "zustand";
import { persist } from "zustand/middleware";
// import kycService from '../pages/Clients/KYCDocuments/KYCDocDetails/Services/kyc.api';
// import kycApprovalService from '../pages/Clients/KYCApprovals/KYCApprovalDocs/Services/kycApproval.api';
import ApiCall from "../utils/ApiCall";
// import { showFailure, showSuccess } from '../utils';
const useKycStore = create(
  persist(
    (set) => ({
      kycData: {},
      loading: false,
      btnLoading: false,
      error: null,
      kycReturnData: {},
      payLoad: {},
      comesFrom: "",
      KYCCategoryList: [],
      setComesFrom: (data) => set({ comesFrom: data }),
      setPayLoad: (data) => set({ payLoad: data }),
      setKycData: (data) => set({ kycData: data }),
      // ...kycService(set), // spread the service methods in
      // ...kycApprovalService(set),
      // /api/v2/onboarding/properties/kyc-category
      // getKYCCategoryList:()=>{

      // }

      getKYCCategoryList: () => {
        set({ isLoading: true });
        ApiCall.get(`onboarding/properties/kyc-category`, (response) => {
          if (response.success) {
            console.log(response);
            const result = response?.data.map((item) => {
              return {
                ...item,
                label: item.name,
                value: item.code,
              };
            });

            console.log(result);
            // showSuccess(response);
            set({
              isLoading: false,
              KYCCategoryList: result,
            });
          } else {
            // showFailure(response?.message);
            set({ isLoading: false });
          }
        });
      },
    }),
    {
      name: "kyc-storage", // Key in localStorage
      partialize: (state) => ({
        kycData: state.kycData,
        kycReturnData: state.kycReturnData,
        payLoad: state.payLoad,
        comesFrom: state.comesFrom,
        // Add more keys if you want to persist e.g. loading state
      }),
    },
  ),
);

export default useKycStore;
