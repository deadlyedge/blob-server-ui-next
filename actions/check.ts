"use server"

import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL as string

export const checkToken = async (token: string) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { user } = response.data

    return { user: user as string, token }
  } catch (error) {
    // console.error("Error checking token:", error)
    return null
  }
}
