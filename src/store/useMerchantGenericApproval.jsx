import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiCall from "../utils/ApiCall";
import { showFailure, showSuccess } from "../utils";

const LIMIT = 10;
const ENTITY_API_PATH = "onboarding/risk-checks/aml/decision-make";

const useMerchantGenericApproval = create(
  persist(
    (set) => ({
      page: 1,
      limit: LIMIT,
      isLoading: true,
      merchantApprovalList: [],
      selectedAMLRecords: {},
      onboardHistory: {},
      amlReturnData: {},
      isLastPage: false,
      btnLoading: false,
      scoreResults: {},
      isLoadingAML: true,
      almSansactionData: {},
      setScoreResults: (data) => set({ scoreResults: data }),

      setSelectedAMLRecords: (data) => set({ selectedAMLRecords: data }),
      // /api/v2/onboarding/business
      fetchMerchantList: (page = 1, limit = LIMIT, filterQuery = "") => {
        //console.log(param, "test param");
        console.log(
          filterQuery,
          "filterQuery filterQueryfilterQueryfilterQuery",
        );

        set({ isLoading: true });
        const finalQuery = filterQuery?.toString()
          ? `&${filterQuery?.toString()}`
          : "";

        ApiCall.get(
          `onboarding/business?page=${page}&limit=${limit}${finalQuery}`,
          (response) => {
            if (response?.success) {
              const { isLastPage = false } = response?.data || [];
              const merchantApprovalList = response.data || [];
              set({
                page,
                limit,
                merchantApprovalList,
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
      fetchOnboardHistory: (businessID) => {
        set({ isLoading: true });

        ApiCall.get(
          `onboarding/business/${businessID}?type=gas`,
          (response) => {
            if (response?.success) {
              const merchantApprovalDetail = response.data || {};
              set({
                onboardHistory: merchantApprovalDetail,
                isLoading: false,
              });
            } else {
              showFailure(response?.message);
              set({ isLoading: false });
            }
          },
        );
      },

      updateAMLMatchData: async (updatedData, amlId) => {
        set({ btnLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(`${ENTITY_API_PATH}/${amlId}`, updatedData, (res) => {
              res?.success ? resolve(res) : reject(res);
            });
          });

          set({
            amlReturnData: response,
            btnLoading: false,
          });

          showSuccess(response?.message);
          return response;
        } catch (error) {
          const errorMsg = error?.message;
          set({ error: errorMsg, btnLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      fetchAMLSearcDetails: (sanctionId, searchHistoryId) => {
        set({ isLoadingAML: true });

        ApiCall.get(
          `onboarding/risk-checks/aml/${searchHistoryId}/${sanctionId}`,
          (response) => {
            if (response?.success) {
              const amlSearcDetails = response.data?.data?.sanction || {};
              set({
                scoreResults: amlSearcDetails,
                isLoadingAML: false,
              });
            } else {
              showFailure(response?.message);
              set({ isLoadingAML: false });
            }
          },
        );
      },

      fetchAMLSansactionDetails: (businessId, searchHistoryId, sanctionId) => {
        set({ isLoadingAML: true });
        ApiCall.get(
          `onboarding/business/${businessId}/aml/sanction-detail?searchHistoryId=${searchHistoryId}&sanctionId=${sanctionId}`,
          (response) => {
            if (response?.success) {
              const amlSansactionDetails = response.data || {};
              set({
                almSansactionData: amlSansactionDetails,
                isLoadingAML: false,
              });
            } else {
              showFailure(response?.message);
              set({ isLoadingAML: false });
            }
          },
        );
      },

      addBankAccount: (businessId, data, callback) => {
        set({ btnLoading: true });
        ApiCall.post(
          `onboarding/business/${businessId}/banks`,
          data,
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },

      setPrimaryAccount: (businessId, bankId, data = {}, callback) => {
        set({ btnLoading: true });

        ApiCall.patch(
          `onboarding/business/${businessId}/banks/${bankId}/primary`,
          data,
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },

      deleteBankAccount: (bankId, data = {}, callback) => {
        set({ btnLoading: true });
        ApiCall.delete(
          `onboarding/business/banks/${bankId}`,
          data,
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },
      riskCheckEnable: (id, data, callback) => {
        const params = new URLSearchParams();

        if (data.type) {
          params.append("type", data.type);
        }
        if (data.website) {
          params.append("website", data.website);
        }
        if (data.file) {
          params.append("file", data.file);
        }
        if (data.reason) {
          params.append("reason", data.reason);
        }
        // if (data.businessId) {
        //   params.append('businessId', data.businessId);
        // }
        set({ btnLoading: true });
        ApiCall.post(
          `onboarding/business/${id}/risk-check/enable?${params.toString()}`,
          {},
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },

      decisionMaking: (id, data, callback) => {
        set({ btnLoading: true });

        ApiCall.post(
          `onboarding/business/${id}/aml/decision-make`,
          data,
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },

      uploadFile: async (file, id, name) => {
        set({
          fileLoading: true,
          error: null,
          uploadProgress: 0,
        });
        try {
          const uploadFile = new FormData();
          const safeName = file.name.normalize("NFC").replace(/[–—]/g, "-");
          uploadFile.append("uploadFile", file, safeName);
          const response = await new Promise((resolve, reject) => {
            ApiCall.upload(
              `/onboarding/business/${id}/upload-logo`,
              uploadFile,
              (progress) => set({ uploadProgress: progress }),
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          const fileInfo = {
            fileKey: response.data?.fileKey,
            signedUrl: response.data?.signedUrl,
            size: file.size,
            type: file.type,
          };

          set((state) => ({
            uploadedFile: {
              ...state.uploadedFile,
              [name]: fileInfo,
            },
          }));

          showSuccess(response || `${file.name} uploaded successfully`);
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "File upload failed";
          set({
            error: errorMsg,
            fileLoading: false,
            uploadProgress: 0,
          });
          showFailure(errorMsg);
          throw error;
        }
      },

      approvalReject: async (id, data, callback) => {
        // /api/v2/onboarding/business/{businessId}/approval/gas

        set({ btnLoading: true });

        ApiCall.patch(
          `onboarding/business/${id}/approval/gas`,
          data,
          (response) => {
            if (response?.success) {
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
              callback(response.success);
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },

      verifyAccount: async (id, data = {}, callback) => {
        // /api/v2/onboarding/business/banks/{bankId}/verify
        set({ btnLoading: true });

        ApiCall.patch(
          `onboarding/business/banks/${id}/verify`,
          data,
          (response) => {
            if (response?.success) {
              callback(response.success);
              showSuccess(response?.message);
              set({
                btnLoading: false,
              });
            } else {
              showFailure(response?.message);
              set({ btnLoading: false });
            }
          },
        );
      },
    }),
    {
      name: "merchant-generic-approval", // storage key
      partialize: (state) => ({
        selectedAMLRecords: state.selectedAMLRecords, // persist only what’s needed
        onboardHistory: state.onboardHistory,
      }),
    },
  ),
);

export default useMerchantGenericApproval;
