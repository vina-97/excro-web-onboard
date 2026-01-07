import { create } from "zustand";

const useAppStore = create((set) => ({
  // ✅ create popup handle
  isCreateModalOpen: false,
  handleCreateModal: () =>
    set((state) => ({ isCreateModalOpen: !state?.isCreateModalOpen })),

  //filter search
  filterSearch: "",
  handleFilterSearch: (value) => set(() => ({ filterSearch: value })),

  // ✅ Global state variables
  token: localStorage.getItem("token") || null,
  user: null,
  sidebarOpen: true,

  // ✅ Actions to update state
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useAppStore;
