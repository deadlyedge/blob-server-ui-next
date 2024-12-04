"use server"

import { logger } from "@/lib/utils"
import axios from "axios"

export const deleteFiles = async (
  idsToDelete: string[],
  token: string | undefined
) => {
  try {
    idsToDelete.forEach(async (id) => {
      await axios.delete(`${process.env.API_BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    })

    logger(`[DELETE FILES] ${idsToDelete.length} file(s) deleted.`)
  } catch (error) {
    logger(`delete failed, error: ${error}`)
  }
}
