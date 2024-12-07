import { create } from "zustand"
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types"
import { getUsage, listFiles } from "@/actions"

type AppState = {
  userToken: AuthenticatedUserType | null
  usage: UserUsageType | null
  files: FileInfoType[] | null
  // refresh: boolean
  setFiles: () => Promise<void>
  setUserToken: (userToken: AuthenticatedUserType | null) => void
  setUsage: () => Promise<void>
  // setFiles: (files: FileInfoType[] | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  userToken: null,
  usage: null,
  files: null,
  // refresh: false,
  setFiles: async () => {
    const files = await listFiles(useAppStore.getState().userToken?.token || "")
    set({ files })
  },
  setUsage: async () => {
    const currentUserToken = useAppStore.getState().userToken
    if (currentUserToken) {
      const usage = await getUsage(currentUserToken)
      set({ usage })
    }
  },
  // setUserToken: (userToken: AuthenticatedUserType | null) => set({ userToken }),
  setUserToken: (userToken: AuthenticatedUserType | null) => set({ userToken }),
  // setFiles: (files: FileInfoType[] | null) => set({ files }),
}))
