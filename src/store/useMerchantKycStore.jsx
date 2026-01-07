import { create } from "zustand";
import { persist } from "zustand/middleware";
import kycService from "../pages/Merchants/KYCDocuments/KYCDocDetails/Services/kyc.api";
import kycApprovalService from "../pages/Merchants/KYCApprovals/KYCApprovalDocs/Services/kycApproval.api";

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
      setComesFrom: (data) => set({ comesFrom: data }),
      setPayLoad: (data) => set({ payLoad: data }),
      setKycData: (data) => set({ kycData: data }),
      ...kycService(set), // spread the service methods in
      ...kycApprovalService(set),
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
