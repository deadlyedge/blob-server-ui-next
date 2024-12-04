"use server"

import { UserUsageType } from "@/types"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

export const getUsage = async (token: string, user: string) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/user/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data as UserUsageType
  } catch (error) {
    // console.error("Error checking token:", error)
    return null
  }
}
