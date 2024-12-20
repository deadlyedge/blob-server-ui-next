"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { cn, logger } from "@/lib/utils"
import { useAppStore } from "@/lib/store" // Import the store

export const UploadZone = () => {
  const [isPending, startTransition] = useTransition()
  const [onDragOver, setOnDragOver] = useState(false)
  const { userToken, setFiles } = useAppStore() // Use the store
  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_SOCKET_ENDPOINT as string
    )

    socket.onopen = () => {
      console.log("WebSocket connection established")
      socket.send(userToken ? userToken.token : "") // Send the token immediately after connection is established
    }
    socket.onmessage = (event) => {
      if (typeof event.data === "string" && event.data.includes("file_url")) {
        const jsonResponse = JSON.parse(event.data)
        console.log(jsonResponse)
        toast.success("file uploaded at", {
          action: (
            <a target='_blank' href={jsonResponse.show_image}>
              {jsonResponse.show_image}
            </a>
          ),
        })
        setFiles()
      }
    }

    socket.onclose = () => {
      console.log("WebSocket connection closed")
    }

    ws.current = socket

    return () => {
      // Close WebSocket connection on unmount
      socket.close()
    }
  }, [userToken, setFiles])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadChunk = async (
        chunk: Blob,
        fileName: string,
        index: number,
        totalChunks: number
      ) => {
        const formData = new FormData()
        formData.append("token", userToken ? userToken.token : "")
        formData.append("file", chunk, fileName)
        formData.append("chunkIndex", index.toString())
        formData.append("totalChunks", totalChunks.toString())

        try {
          const response = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })

          if (!response.data) {
            throw new Error(`Upload failed: ${response.statusText}`)
          }

          console.log("Chunk upload result:", response.data)
          if (response.status === 200) setFiles()
        } catch (error) {
          logger(`error: ${error}`)
          toast.error("Upload Failed", {
            description: `${error}`,
            duration: 8000,
          })
        }
      }

      startTransition(async () => {
        for (const file of acceptedFiles) {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const fileReader = new FileReader()
            fileReader.onload = () => {
              const fileBytes = fileReader.result as ArrayBuffer
              ws.current?.send(file.name)
              ws.current?.send(fileBytes)
              console.log("File sending to WebSocket")
            }
            fileReader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
          } else {
            const CHUNK_SIZE = 1024 * 512
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
            for (let index = 0; index < totalChunks; index++) {
              const start = index * CHUNK_SIZE
              const end = Math.min(start + CHUNK_SIZE, file.size)
              const chunk = file.slice(start, end) // Get the chunk

              console.log(
                `Uploading chunk ${index + 1} of ${totalChunks} for file ${
                  file.name
                }`
              )
              await uploadChunk(chunk, file.name, index, totalChunks)
            }
          }
        }
      })
    },
    [userToken, setFiles]
  )

  // const { getRootProps, getInputProps } = useDropzone({
  //   // onDrop,
  //   // noClick: true, // Prevent click to open file dialog
  //   // preventDropOnDocument: false,
  //   maxFiles: 5,
  //   maxSize: 1024 * 1024 * 100, // 100MB limit
  // })

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer?.files || [])
      if (files.length > 0 && files.length < 11) {
        onDrop(files)
      } else {
        toast.error("Exceeded maximum files limit (10 files)", {
          duration: 3000,
        }) // 10 files
      }
    }

    const dropArea = document.getElementById("drop-zone")

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      setOnDragOver(true)
    }
    const handleDragLeave = (event: DragEvent) => {
      // event.preventDefault()
      setOnDragOver(false)
    }

    dropArea?.addEventListener("drop", handleDrop)
    dropArea?.addEventListener("dragover", handleDragOver)
    dropArea?.addEventListener("dragleave", handleDragLeave)

    return () => {
      dropArea?.removeEventListener("drop", handleDrop)
      dropArea?.removeEventListener("dragover", handleDragOver)
      dropArea?.removeEventListener("dragleave", handleDragLeave)
      // setOnDragOver(false)
    }
  }, [onDrop])

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 bg-white/50 w-[100vw] h-[100vh] flex items-center justify-center p-20",
          onDragOver ? "backdrop-blur-md" : "hidden"
        )}>
        <div className='rounded border-dashed'>Drop Files</div>
      </div>
      <div
        // {...getRootProps()}
        className='z-50 w-40 h-20 flex flex-col justify-center items-center border-2 border-dashed text-zinc-800 bg-gray-100 rounded bg-opacity-50 cursor-pointer group hover:bg-opacity-90 duration-200 uppercase'>
        <div className='flex-auto text-center text-md '>Drop Files</div>
        <div>
          {/* <input {...getInputProps()} /> */}
          <svg
            className='w-8 h-8 mx-auto rotate-45 text-blue-500 group-hover:rotate-[135deg] group-hover:text-lime-500 duration-200'
            fill='currentColor'
            viewBox='7 2 10 20'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z'></path>
          </svg>
        </div>
        <div className='text-sm'>Into Window</div>
      </div>
      {isPending && (
        <div className='fixed w-full h-full flex justify-center items-center bg-black/50'>
          <LoaderIcon color='#2F80ED' className='animate-spin' />
        </div>
      )}
    </>
  )
}
