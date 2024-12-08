import { create } from "zustand"
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types"
import { getUsage, listFiles } from "@/actions"
import { getCookie, setCookie, removeCookie } from "typescript-cookie"

type AppState = {
  userToken: AuthenticatedUserType | null
  usage: UserUsageType | null
  files: FileInfoType[] | null
  setFiles: () => Promise<void>
  setUserToken: (userToken: AuthenticatedUserType | null) => void
  setUsage: () => Promise<void>
}

type StateStorageType = {
  getItem: () => AuthenticatedUserType | null
  setItem: (userToken: AuthenticatedUserType) => void
  removeItem: () => void
}

export const cookiesStorage: StateStorageType = {
  getItem: () => {
    const userToken = {
      user: getCookie("user"),
      token: getCookie("token"),
    }
    return userToken.user && userToken.token
      ? (userToken as AuthenticatedUserType)
      : null
  },
  setItem: (userToken) => {
    setCookie("user", userToken.user, { path: "/", expires: 100 })
    setCookie("token", userToken.token, { path: "/", expires: 100 })
  },
  removeItem: () => {
    removeCookie("user", { path: "/" })
    removeCookie("token", { path: "/" })
  },
}

export const useAppStore = create<AppState>((set) => ({
  userToken: null,
  usage: null,
  files: null,
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
  setUserToken: (userToken: AuthenticatedUserType | null) => {
    if (!userToken) {
      cookiesStorage.removeItem()
      set({ userToken: null })
    } else {
      cookiesStorage.setItem(userToken)
      set({ userToken })
    }
  },
}))
