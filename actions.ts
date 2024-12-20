"use server"

import axios, { AxiosError } from "axios"
import { logger } from "@/lib/utils"
import { AuthenticatedUserType, FileInfoType, UserUsageType } from "@/types"

const apiBaseUrl = process.env.API_BASE_URL as string

export const changeToken = async ({
  user,
  token,
}: AuthenticatedUserType): Promise<UserUsageType | null> => {
  const url = `${apiBaseUrl}/user/${user}?function=change_token`
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  // console.log("headers:", headers)

  try {
    const { data } = await axios.get<UserUsageType>(url, { headers })
    console.log("Token checked successfully:", data)
    return data
  } catch (error) {
    // console.error("Error checking token:", error)
    return null
  }
}

export const checkAuth = async (
  token: string
): Promise<AuthenticatedUserType | undefined> => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error) {
    if (error instanceof AxiosError && error.status === 401) {
      logger("token not valid") // token not valid
    } else {
      throw new Error("api server error") // other errors
    }
  }
}

export const deleteFiles = async (idsToDelete: string[], token: string) => {
  const deletePromises = idsToDelete.map((id) =>
    axios.delete(`${process.env.API_BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  )

  try {
    await Promise.all(deletePromises)
    logger(`[DELETE FILES] ${idsToDelete.length} file(s) deleted.`)
  } catch (error) {
    logger(`delete failed, error: ${error}`)
  }
}

export const listFiles = async (token: string): Promise<FileInfoType[]> => {
  try {
    const { data }: { data: FileInfoType[] } = await axios.get(
      `${apiBaseUrl}/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return data.map((file) => ({
      ...file,
      baseUrl: apiBaseUrl,
    }))
  } catch {
    return []
  }
}

export const batchUploadFiles = async (files: File[], token: string) => {
  const formData = new FormData()
  files.map((file) => {
    formData.append("files", file) // must be 'files'
  })

  try {
    const response = await axios.post(`${apiBaseUrl}/batch_upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    logger(`[UPLOAD FILES] ${error}`)
    throw error
  }
}
export const chunkedUploadFiles = async (files: File[], token: string) => {
  try {
    const response = [{}]
    files.map(async (file) => {
      const contentType = file.type || "application/octet-stream"
      const res = await axios.post(`${apiBaseUrl}/chunked_upload`, file, {
        headers: {
          filename: file.name,
          "Content-Type": contentType,
          authorization: `Bearer ${token}`,
        },
      })
      response.push(res.data)
    })
    return response
  } catch (error) {
    logger(`[UPLOAD FILES] ${error}`)
    throw error
  }
}

export const getUsage = async ({
  user,
  token,
}: AuthenticatedUserType): Promise<UserUsageType | null> => {
  const url = `${apiBaseUrl}/user/${user}`
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  try {
    const { data } = await axios.get<UserUsageType>(url, { headers })
    return data
  } catch (error) {
    // console.error("Error checking token:", error)
    return null
  }
}
