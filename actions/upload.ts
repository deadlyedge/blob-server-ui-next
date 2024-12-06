"use server"

import { logger } from "@/lib/utils"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL

/**
 * Uploads multiple files to a server in a single batch request.
 *
 * This function takes an array of files and a token for authorization, 
 * constructs a FormData object with the files, and sends a POST request 
 * to the server's batch upload endpoint. The request includes an 
 * authorization header with a bearer token.
 *
 * @param {File[]} files - An array of File objects to be uploaded.
 * @param {string} token - A string representing the authorization token.
 * @returns {Promise<any>} - A promise that resolves with the server's response data.
 * @throws Will throw an error if the request fails, logging the error message.
 */
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
