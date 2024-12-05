"use server"

import { logger } from "@/lib/utils"
import axios from "axios"
import { NextResponse } from "next/server"

const apiBaseUrl = process.env.API_BASE_URL

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

// export const uploadFile = async (
//   formData: FormData,
//   token: string,
//   filename?: string
// ) => {
//   try {
//   } catch (error) {
//     logger(`[UPLOAD FILE] ${error}`)
//     throw error
//   }
// }
