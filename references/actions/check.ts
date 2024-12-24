"use server"

import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL

export const checkToken = async (token: string) => {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return null
    }
    return { user: "api service offline", token }
  }
}
