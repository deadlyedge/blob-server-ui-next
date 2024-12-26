import { logger } from "@/lib/utils"
import { NextResponse } from "next/server"
import { Upload } from "tus-js-client"

const apiBaseUrl = process.env.API_BASE_URL

export const POST = async (req: Request) => {
  const formData = await req.formData() // Get the form data from the request
  const token = formData.get("token") // Get the token from the form data
  const fileInput = formData.get("files") as File
  const fileBuffer = Buffer.from(await fileInput.arrayBuffer())
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authentication token missing" }),
      {
        status: 401,
      }
    )
  }
  // Send the complete file to the user's API
  const upload = new Upload(fileBuffer, {
    endpoint: `${apiBaseUrl}/upload_tus/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      filename: fileInput.name,
      filetype: fileInput.type,
      name: fileInput.name,
      type: fileInput.type,
    },
    // chunkSize: 5 * 1024 * 1024, // 5MB per chunk
    onError: function (error) {
      console.log("Failed because: " + error)
      return new NextResponse("Tus Failed", { status: 400 })
    },
    onSuccess: () => {
      console.log("Upload fininshed")
      return new NextResponse("Tus Success", { status: 200 })
    },
  })
  try {
    upload.start()

    return new NextResponse("Tus sending", { status: 201 })
  } catch (error) {
    logger(`[UPLOAD FILES] ${error}`)
    return new NextResponse(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    })
  }
}
