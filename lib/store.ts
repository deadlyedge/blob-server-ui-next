import { create } from "zustand"
import { getCookie, setCookie, removeCookie } from "typescript-cookie"

import { getUsage, listFiles, deleteFiles } from "@/actions"
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types"
import { delay } from "./utils"

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

type AppState = {
  userToken: AuthenticatedUserType | null
  usage: UserUsageType | null
  files: FileInfoType[] | null
  selectedFileIds: string[]
  isLoading: boolean
  setFiles: () => Promise<void>
  setUserToken: (userToken: AuthenticatedUserType | null) => void
  setUsage: () => Promise<void>
  onSelect: (fileId: string) => void
  handleDelete: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  userToken: null,
  usage: null,
  files: null,
  selectedFileIds: [],
  isLoading: false,
  setFiles: async () => {
    set({ isLoading: true })
    while (true) {
      const files = await listFiles(get().userToken?.token || "")
      if (files !== get().files) {
        set({ files })
        break
      }
      delay(2000)
    }

    set({ isLoading: false })
  },
  setUsage: async () => {
    const currentUserToken = get().userToken
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
  onSelect: (fileId: string) => {
    const { selectedFileIds } = get()
    const isSelected = selectedFileIds.includes(fileId)
    set({
      selectedFileIds: isSelected
        ? selectedFileIds.filter((id) => id !== fileId)
        : [...selectedFileIds, fileId],
    })
  },
  handleDelete: async () => {
    const { selectedFileIds, userToken, setFiles } = get()
    if (selectedFileIds.length > 0) {
      set({ isLoading: true })
      try {
        await deleteFiles(selectedFileIds, userToken?.token || "")
        set({ selectedFileIds: [] })
        await setFiles()
      } catch (error) {
        console.error("Error deleting files:", error)
      } finally {
        set({ isLoading: false })
      }
    }
  },
}))
