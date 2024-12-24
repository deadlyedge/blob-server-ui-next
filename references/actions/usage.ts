"use server"

import { AuthenticatedUserType, UserUsageType } from "@/types"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

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
