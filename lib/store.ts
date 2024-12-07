import { create } from "zustand";
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types";

type AppState = {
  userToken: AuthenticatedUserType | null;
  usage: UserUsageType | null;
  files: FileInfoType[] | null;
  refresh: boolean;
  setRefresh: () => void;
  setUserToken: (userToken: AuthenticatedUserType | null) => void;
  setUsage: (usage: UserUsageType | null) => void;
  setFiles: (files: FileInfoType[] | null) => void;
};


export const useAppStore = create<AppState>((set) => ({
  userToken: null,
  usage: null,
  files: null,
  refresh: false,
  setRefresh: () => set((state) => ({ refresh: !state.refresh })),
  setUserToken: (userToken: AuthenticatedUserType | null) => set({ userToken }),
  setUsage: (usage: UserUsageType | null) => set({ usage }),
  setFiles: (files: FileInfoType[] | null) => set({ files }),
}));
