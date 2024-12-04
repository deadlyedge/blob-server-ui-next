"use server"

import { logger } from "@/lib/utils"
import axios from "axios"

export const deleteFiles = async (
  idsToDelete: string[],
  token: string | undefined
) => {
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
