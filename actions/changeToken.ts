"use server"

import { UserUsageType } from "@/types"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

export const changeToken = async (
  user: string,
  token: string
): Promise<UserUsageType | null> => {
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
