import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiCall from "../utils/ApiCall";
import { showFailure, showSuccess } from "../utils";

const ONBOARDING_API_PATH = "onboarding/business";
const EDIT_ONBOARDING_API_PATH = "onboarding/business";
const ONBOARDING_KYC_API_PATH = "onboarding/kyc-document/business";

const FILE_UPLOAD_API_PATH = "onboarding/s3/upload";

const useOnboardingStore = create(
  persist(
    (set, get) => ({
      merchantId: null,
      steps: {
        basic: {},
        business: {},
        bank: {},
        kyc: {},
      },
      setMerchantId: (id) => set({ merchantId: id }),
      updateStepData: (stepKey, data) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [stepKey]: { ...state.steps[stepKey], ...data },
          },
        })),
      getStepData: (stepKey) => get().steps[stepKey],

      onboardingNextData: {},
      onboardingData: {},
      btnLoading: false,
      isLoading: false,
      updateBtnLoading: false,
      error: null,
      uploadProgress: 0,
      uploadedFiles: [],
      uploadedFile: {},
      fileLoading: false,
      kycData: [],
      isAuthLoading: false,
      setOnboardingData: (data) => set({ onboardingData: data }),
      setUploadedFile: (data) => set({ uploadedFile: data }),
      setLoading: (data) => set({ loading: data }),
      setIsLoading: (data) => set({ isLoading: data }),

      fetchOnboardingData: async (businessID) => {
        console.log("APIin");
        set({ isLoading: true, error: null });

        try {
          console.log("inside");

          const response = await new Promise((resolve, reject) => {
            ApiCall.get(`${ONBOARDING_API_PATH}/${businessID}`, (res) => {
              if (res?.success) {
                console.log("minside");

                resolve(res);
              } else {
                console.log("inelse");
                showFailure(res);
                reject(new Error(res?.message || "Business not found"));
              }
            });
          });
          console.log("out");

          const businessInfo = response.data || {};

          set({
            onboardingData: businessInfo,
            kycData: businessInfo?.kycDocuments || [],
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          console.log("catchin");

          const errorMsg = error.message || "Failed to fetch onboarding data";

          set({
            error: errorMsg,
            isLoading: false,
            onboardingData: {},
          });

          showFailure(errorMsg); // ✅ WILL SHOW NOW
          throw error;
        }
      },

      fetchBusinessData: async (businessID, getValue) => {
        set({ btnLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.get(
              `${ONBOARDING_API_PATH}/${businessID}/document?value=${getValue}`,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          const businessRenderInfo = response.data?.business || {};
          set((prev) => ({
            ...prev,
            onboardingData: {
              ...prev.onboardingData,
              ...(Object.keys(businessRenderInfo).length > 0
                ? { business: { ...businessRenderInfo } }
                : {}),
            },
            btnLoading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to fetch business data";
          set({ error: errorMsg, btnLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      fetchKycData: async (businessID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.get(
              `${ONBOARDING_KYC_API_PATH}/${businessID}`,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          const businessKYCInfo = response.data || {};
          set((prev) => ({
            ...prev,
            kycData: businessKYCInfo,
            isLoading: false,
          }));
          return response.data;
        } catch (error) {
          const errorMsg =
            error?.message || "Failed to fetch business kyc data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      fetchAuthorizedData: async (businessID, getValue) => {
        console.log(getValue);
        const payload = { name: getValue?.name, pan: getValue?.pan };
        set({ isAuthLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.post(
              `${ONBOARDING_API_PATH}/${businessID}/signatory/verify`,
              payload,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          set((prev) => ({
            ...prev,
            isAuthLoading: false,
          }));
          showSuccess(response || "Data updated successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to verify data";
          set({ error: errorMsg, isAuthLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      addOnboardingData: async (newData) => {
        set({ updateBtnLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.post(ONBOARDING_API_PATH, newData, (response) => {
              response?.success ? resolve(response) : reject(response);
            });
          });
          console.log(response.data, "storeinside");

          set({
            onboardingNextData: response.data || {},
            updateBtnLoading: false,
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to add onboarding data";
          set({ error: errorMsg, updateBtnLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      addAndUpdateBankData: async (newData, businessID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.post(
              `${ONBOARDING_API_PATH}/${businessID}/banks`,
              newData,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to add bank data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      deleteBankData: async (bankID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.delete(
              `${ONBOARDING_API_PATH}/banks/${bankID}`,
              {},
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to add bank data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      handlePrimaryBankData: async (businessID, bankID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(
              `${EDIT_ONBOARDING_API_PATH}/${businessID}/banks/${bankID}/primary`,
              {},
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to add primary bank data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      handleVerifyBankData: async (bankID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(
              `${EDIT_ONBOARDING_API_PATH}/banks/${bankID}/verify`,
              {},
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to verify bank data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      updateOnboardingData: async (updatedData, businessID, activeStep) => {
        set({ updateBtnLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(
              `${EDIT_ONBOARDING_API_PATH}/${businessID}/${activeStep}`,
              updatedData,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });
          if (response.success) {
            set({
              onboardingNextData: { ...updatedData },
              updateBtnLoading: false,
            });
            showSuccess(response || "Data updated successfully");
            return response.data;
          } else {
            showFailure(response.message || "Failed to update onboarding data");
            set({
              updateBtnLoading: false,
            });
            return;
          }
        } catch (error) {
          const errorMsg = error?.message || "Failed to update onboarding data";
          set({ error: errorMsg, updateBtnLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      reuploadOnboardingKYCData: async (updatedData, businessID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(
              `${EDIT_ONBOARDING_API_PATH}/${businessID}/kyc/reupload`,
              updatedData,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          showSuccess(response || "Data updated successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to update onboarding data";
          set({ error: errorMsg, isLoading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      uploadFile: async (file, clientID, documentType, name) => {
        set({
          fileLoading: true,
          error: null,
          uploadProgress: 0,
        });
        console.log(file);

        try {
          const formData = new FormData();
          const safeName = file.name.normalize("NFC").replace(/[–—]/g, "-");
          console.log(safeName, "safename");

          formData.append("uploadFile", file, safeName);
          const response = await new Promise((resolve, reject) => {
            ApiCall.upload(
              `/${FILE_UPLOAD_API_PATH}?uploadFor=${documentType}&userId=${clientID}`,
              formData,
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

      uploadMultipleFiles: async (files, clientID, documentType) => {
        set({
          isLoading: true,
          error: null,
          uploadProgress: 0,
        });

        try {
          const formData = new FormData();
          files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          });
          formData.append("clientID", clientID);
          formData.append("documentType", documentType);

          const response = await new Promise((resolve, reject) => {
            ApiCall.upload(
              `${FILE_UPLOAD_API_PATH}/multiple`,
              formData,
              (progress) => set({ uploadProgress: progress }),
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          const newFiles = files.map((file, index) => ({
            name: file.name,
            type: documentType,
            url: response.data.fileUrls[index],
            uploadedAt: new Date().toISOString(),
          }));

          set((prev) => ({
            isLoading: false,
            uploadedFiles: [...prev.uploadedFiles, ...newFiles],
          }));

          showSuccess(`${files.length} files uploaded successfully`);
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Files upload failed";
          set({
            error: errorMsg,
            isLoading: false,
            uploadProgress: 0,
          });
          showFailure(errorMsg);
          throw error;
        }
      },

      removeUploadedFile: (fileUrl) => {
        set((prev) => ({
          uploadedFiles: prev.uploadedFiles.filter(
            (file) => file.url !== fileUrl,
          ),
        }));
      },

      resetUploadState: () =>
        set({
          uploadProgress: 0,
          error: null,
          loading: false,
          isLoading: false,
          fileLoading: false,
        }),
      resetOnboardingData: () => {
        set({
          onboardingData: {},
          onboardingNextData: {},
          uploadedFiles: [],
          uploadedFile: {},
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("onboarding-storage");
          sessionStorage.removeItem("onboarding-storage");
        }
      },
    }),

    {
      name: "onboarding-storage", // Key in localStorage
      partialize: (state) => ({
        onboardingData: state.onboardingData,
        uploadedFiles: state.uploadedFiles,
        uploadedFile: state.uploadedFile,
      }),
    },
  ),
);

export default useOnboardingStore;
