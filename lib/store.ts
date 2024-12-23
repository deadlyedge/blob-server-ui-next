import { create } from "zustand"
import { getCookie, setCookie, removeCookie } from "typescript-cookie"

import { getUsage, listFiles, deleteFiles } from "@/actions"
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types"

type CookieStorageType = {
  getUserTokenCookie: () => AuthenticatedUserType | null
  setUserTokenCookie: (userToken: AuthenticatedUserType) => void
  removeUserTokenCookie: () => void
  getUploadSwitchCookie: () => string | null
  setUploadSwitchCookie: (switchName: string) => void
  removeUploadSwitchCookie: () => void
}

export const cookiesStorage: CookieStorageType = {
  getUserTokenCookie: () => {
    if (typeof document === "undefined") return null // Fallback value
    const userToken = {
      user: getCookie("user"),
      token: getCookie("token"),
    }
    return userToken.user && userToken.token
      ? (userToken as AuthenticatedUserType)
      : null
  },
  setUserTokenCookie: (userToken) => {
    setCookie("user", userToken.user, { path: "/", expires: 100 })
    setCookie("token", userToken.token, { path: "/", expires: 100 })
  },
  removeUserTokenCookie: () => {
    removeCookie("user", { path: "/" })
    removeCookie("token", { path: "/" })
  },
  getUploadSwitchCookie: () => {
    if (typeof document === "undefined") return "socket" // Fallback value
    return getCookie("uploadSwitch") ?? "socket"
  },
  setUploadSwitchCookie: (switchName) =>
    setCookie("uploadSwitch", switchName, { path: "/", expires: 100 }),
  removeUploadSwitchCookie: () => removeCookie("uploadSwitch", { path: "/" }),
}

type MaskStore = {
  type: "upload" | "loading" | null
  progress?: number
  isOpen: boolean
  onOpen: (type: "upload" | "loading" | null, progress?: number) => void
  onClose: () => void
}

export const useMask = create<MaskStore>((set) => ({
  type: null,
  progress: 0,
  isOpen: false,
  onOpen: (type, progress) =>
    set({ type, progress: progress || 0, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}))

type AppState = {
  userToken: AuthenticatedUserType | null
  usage: UserUsageType | null
  files: FileInfoType[] | null
  selectedFileIds: string[]
  isLoading?: boolean
  uploadSwitch: "socket" | "form" | "tus"
  setFiles: () => Promise<void>
  setUserToken: (userToken: AuthenticatedUserType | null) => void
  setUsage: () => Promise<void>
  setUploadSwitch: (uploadSwitch: AppState["uploadSwitch"]) => void
  onSelect: (fileId: string) => void
  handleDelete: () => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  userToken: null,
  usage: null,
  files: null,
  selectedFileIds: [],
  // isLoading: false,
  uploadSwitch:
    cookiesStorage.getUploadSwitchCookie() as AppState["uploadSwitch"],
  setFiles: async () => {
    // set({ isLoading: true })
    useMask.setState({ type: "loading", isOpen: true })
    const files = await listFiles(get().userToken?.token || "")
    set({ files })
    useMask.setState({ type: null, isOpen: false })
    // set({ isLoading: false })
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
      cookiesStorage.removeUserTokenCookie()
      set({ userToken: null })
    } else {
      cookiesStorage.setUserTokenCookie(userToken)
      set({ userToken })
    }
  },
  setUploadSwitch(uploadSwitch) {
    set({ uploadSwitch })
    cookiesStorage.setUploadSwitchCookie(uploadSwitch)
    console.log("upload switched to: ", uploadSwitch)
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
      // set({ isLoading: true })
      try {
        await deleteFiles(selectedFileIds, userToken?.token || "")
        set({ selectedFileIds: [] })
        await setFiles()
      } catch (error) {
        console.error("Error deleting files:", error)
      } finally {
        // set({ isLoading: false })
      }
    }
  },
}))
