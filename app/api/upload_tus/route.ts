import { logger } from "@/lib/utils"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL

export const POST = async (req: Request) => {
  const formData = await req.formData() // Get the form data from the request
  const token = formData.get("token") // Get the token from the form data

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authentication token missing" }),
      {
        status: 401,
      }
    )
  }
  // Send the complete file to the user's API
  try {
    const response = await axios.post(`${apiBaseUrl}/upload_batch`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Add this line
      },
    })

    return new Response(JSON.stringify(response.data), { status: 200 })
  } catch (error) {
    logger(`[UPLOAD FILES] ${error}`)
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    })
  }
}
