import { create } from "zustand";
import entityService from "../pages/Master/Entity/AddEditEntity/Services/entity.api";

const useEntityStore = create((set) => ({
  entityData: {},
  loading: false,
  btnLoading: false,
  error: null,
  entityReturnData: {},
  setEntityData: (data) => set({ entityData: data }),
  ...entityService(set),
}));
export default useEntityStore;
