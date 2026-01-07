import { create } from "zustand";
import { persist } from "zustand/middleware";
import ApiCall from "../utils/ApiCall";
import { showFailure, showSuccess } from "../utils";

const ONBOARDING_API_PATH = "onboarding/merchant";
const EDIT_ONBOARDING_API_PATH = "onboarding/merchant";
const FILE_UPLOAD_API_PATH = "onboarding/s3/upload";

const useMerchantOnboardingStore = create(
  persist(
    (set) => ({
      onboardingNextData: {},
      onboardingData: {},
      loading: false,
      isLoading: false,
      error: null,
      uploadProgress: 0,
      uploadedFiles: [],
      uploadedFile: {},
      fileLoading: false,
      riskManagerModalOpen: false,
      setOnboardingData: (data) => set({ onboardingData: data }),
      setUploadedFile: (data) => set({ uploadedFile: data }),
      setLoading: (data) => set({ loading: data }),
      setRiskManagerModalOpen: (data) => set({ riskManagerModalOpen: data }),

      fetchOnboardingData: async (merchantID) => {
        set({ isLoading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.get(`${ONBOARDING_API_PATH}/${merchantID}`, (response) => {
              response?.success ? resolve(response) : reject(response);
            });
          });

          const merchantInfo = response.data?.merchantInfo || {};
          set({
            onboardingData:
              Object.keys(merchantInfo).length > 0 ? merchantInfo : {},
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to fetch onboarding data";
          set({ error: errorMsg, isLoading: false, onboardingData: {} }); // reset here too
          showFailure(errorMsg);
          throw error;
        }
      },

      addOnboardingData: async (newData) => {
        set({ loading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.post(ONBOARDING_API_PATH, newData, (response) => {
              response?.success ? resolve(response) : reject(response);
            });
          });

          set({
            onboardingNextData: response.data || {},
            loading: false,
          });
          showSuccess(response || "Data saved successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to add onboarding data";
          set({ error: errorMsg, loading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      updateOnboardingData: async (updatedData, merchantID, activeStep) => {
        set({ loading: true, error: null });
        try {
          const response = await new Promise((resolve, reject) => {
            ApiCall.patch(
              `${EDIT_ONBOARDING_API_PATH}/${merchantID}/${activeStep}`,
              updatedData,
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          set({
            onboardingNextData: { ...updatedData },
            loading: false,
          });
          showSuccess(response || "Data updated successfully");
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Failed to update onboarding data";
          set({ error: errorMsg, loading: false });
          showFailure(errorMsg);
          throw error;
        }
      },

      uploadFile: async (file, merchantID, documentType, name) => {
        console.log(file, merchantID, documentType, name);
        set({
          fileLoading: true,
          error: null,
          uploadProgress: 0,
        });

        try {
          const formData = new FormData();
          const safeName = file.name.normalize("NFC").replace(/[–—]/g, "-");
          formData.append("uploadFile", file, safeName);
          const response = await new Promise((resolve, reject) => {
            ApiCall.upload(
              `/${FILE_UPLOAD_API_PATH}?uploadFor=${documentType}&userId=${merchantID}`,
              formData,
              (progress) => set({ uploadProgress: progress }),
              (response) => {
                response?.success ? resolve(response) : reject(response);
              },
            );
          });

          const fileInfo = {
            fileKey: response.data?.result?.fileKey,
            signedUrl: response.data?.result?.signedUrl,
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
          return response.data?.result;
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

      uploadMultipleFiles: async (files, merchantID, documentType) => {
        set({
          loading: true,
          error: null,
          uploadProgress: 0,
        });

        try {
          const formData = new FormData();
          files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          });
          formData.append("merchantID", merchantID);
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
            loading: false,
            uploadedFiles: [...prev.uploadedFiles, ...newFiles],
          }));

          showSuccess(`${files.length} files uploaded successfully`);
          return response.data;
        } catch (error) {
          const errorMsg = error?.message || "Files upload failed";
          set({
            error: errorMsg,
            loading: false,
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

export default useMerchantOnboardingStore;
