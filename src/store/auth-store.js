import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      isCheckingAuth: false,

      setAuth: (status) => set({ isAuthenticated: status }),
      setChecking: (status) => set({ isCheckingAuth: status }),

      logout: () =>
        set({
          isAuthenticated: false,
          isCheckingAuth: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
