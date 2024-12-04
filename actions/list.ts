"use server"

import { FileInfoType } from "@/types"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

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
