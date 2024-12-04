"use server"

import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL

export const checkToken = async (token: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { user: data.user, token }
  } catch {
    return null
  }
}
