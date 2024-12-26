import { logger } from "@/lib/utils"
import axios from "axios"

const apiBaseUrl = process.env.API_BASE_URL

// Store chunks in memory
const chunksMap = new Map<string, File[]>()

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
  const fileChunk = formData.get("file")
  const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10)
  const totalChunks = parseInt(formData.get("totalChunks") as string, 10)

  // Check if fileChunk is valid
  if (!fileChunk || !(fileChunk instanceof File)) {
    return new Response(JSON.stringify({ error: "Invalid file chunk" }), {
      status: 400,
    })
  }
  const fileName = fileChunk.name

  // Store the chunk in memory
  if (!chunksMap.has(fileName)) {
    chunksMap.set(fileName, [])
  }
  chunksMap.get(fileName)![chunkIndex] = fileChunk

  // Check if all chunks have been uploaded
  if (chunksMap.get(fileName)!.length === totalChunks) {
    // Combine all chunks into a single Blob
    const completeFile = new Blob(chunksMap.get(fileName)!, {
      type: fileChunk.type,
    })

    // Create a new FormData instance to send to the user's API
    const formDataToSend = new FormData()
    formDataToSend.append("files", completeFile, fileName) // Append the complete file

    // Send the complete file to the user's API
    try {
      const response = await axios.post(
        `${apiBaseUrl}/upload_batch`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add this line
          },
        }
      )

      // Clear the chunks from memory after sending
      chunksMap.delete(fileName)

      return new Response(JSON.stringify(response.data), { status: 200 })
    } catch (error) {
      logger(`[UPLOAD FILES] ${error}`)
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
      })
    }
  }

  return new Response(
    JSON.stringify({ message: "Chunk uploaded successfully" }),
    { status: 200 }
  )
}
