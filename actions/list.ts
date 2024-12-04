"use server"

import { FileInfoType } from "@/types"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

export const listFiles = async (token: string) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const files: FileInfoType[] = response.data

    files.forEach((file) => {
      // file.upload_at = new Date(file.upload_at).toLocaleString()
      file.baseUrl = apiBaseUrl
    })

    return files as FileInfoType[]
  } catch (error) {
    // console.error("Error listing files:", error)
    return []
  }
}
