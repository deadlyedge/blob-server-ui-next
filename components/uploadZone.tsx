"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store" // Import the store

export const UploadZone = () => {
  const [isPending, startTransition] = useTransition()
  const [onDragOver, setOnDragOver] = useState(false)
  const { userToken, setFiles, uploadSwitch } = useAppStore() // Use the store
  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    if (uploadSwitch !== "socket") return
    // Establish WebSocket connection
    const socket = new WebSocket(
      `wss://${process.env.NEXT_PUBLIC_API_BASE_DOMAIN as string}/upload_socket`
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
  }, [userToken, setFiles, uploadSwitch])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!userToken?.token) return null
      startTransition(async () => {
        if (
          uploadSwitch === "socket" &&
          ws.current &&
          ws.current.readyState === WebSocket.OPEN
        ) {
          for (const file of acceptedFiles) {
            const fileReader = new FileReader()
            fileReader.onload = () => {
              const fileBytes = fileReader.result as ArrayBuffer
              ws.current?.send(file.name)
              ws.current?.send(fileBytes)
              console.log("File sending to WebSocket")
            }
            fileReader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
          }
        } else if (uploadSwitch === "tus") {
          for (const file of acceptedFiles) {
            // Send the complete file to the user's API
            // const upload = new tus.Upload(file, {
            //   endpoint: "https://f.zick.xyz/upload_tus/",
            //   headers: {
            //     Authorization: `Bearer ${userToken.token}`,
            //   },
            //   retryDelays: [0, 3000, 5000, 10000, 20000],
            //   metadata: {
            //     filename: file.name,
            //     filetype: file.type,
            //     name: file.name,
            //     type: file.type,
            //   },
            //   // chunkSize: 5 * 1024 * 1024, // 5MB per chunk
            //   onError: function (error) {
            //     console.log("Failed because: " + error)
            //   },
            //   onSuccess: () => {
            //     toast.success(`file: ${file.name} uploaded by tus`)
            //     setFiles()
            //   },
            // })
            // upload.start()
            const data = new FormData()
            data.append("files", file as File)
            data.append("token", userToken.token)

            const response = await axios.post("/api/upload_tus", data)
            if (response) {
              toast.success(`file: ${file.name} uploaded by tus`)
              setFiles()
            }
          }
        } else {
          // Fallback to the previous method if WebSocket is not available
          const batchFiles = new FormData()
          acceptedFiles.forEach((file) => batchFiles.append("files", file))
          batchFiles.append("token", userToken.token)

          const endpoint = `https://${
            process.env.NEXT_PUBLIC_API_BASE_DOMAIN as string
          }/upload_batch`

          await axios.post(endpoint, batchFiles, {
            headers: {
              Authorization: `Bearer ${userToken.token}`,
            },
          })
          setFiles()
        }
      })
    },
    [userToken, setFiles, uploadSwitch]
  )

  const { getRootProps, getInputProps } = useDropzone({
    // onDrop,
    maxFiles: 5,
    maxSize: 1024 * 1024 * 100, // 100MB limit
  })

  useEffect(() => {
    const dropArea = document.body
    const leaveArea = document.getElementById("leave-zone")

    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer?.files || [])
      if (files.length > 0 && files.length < 11) {
        onDrop(files)
        setOnDragOver(false)
        setFiles()
      } else {
        toast.error("Exceeded maximum files limit (10 files)", {
          duration: 3000,
        }) // 10 files
      }
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
    }
    const handleDragEnter = () => {
      setOnDragOver(true)
    }
    const handleDragLeave = () => {
      setOnDragOver(false)
    }

    dropArea?.addEventListener("drop", handleDrop)
    dropArea?.addEventListener("dragover", handleDragOver)
    dropArea?.addEventListener("dragenter", handleDragEnter)
    leaveArea?.addEventListener("dragleave", handleDragLeave)

    return () => {
      dropArea?.removeEventListener("drop", handleDrop)
      dropArea?.removeEventListener("dragover", handleDragOver)
      dropArea?.removeEventListener("dragenter", handleDragEnter)
      leaveArea?.removeEventListener("dragleave", handleDragLeave)
      // setOnDragOver(false)
    }
  }, [onDrop, setFiles])

  return (
    <>
      <div
        id='leave-zone'
        className={cn(
          "fixed left-0 top-0 bg-black/50 w-[100vw] h-[100vh] flex items-center justify-center p-20",
          onDragOver ? "backdrop-blur-md" : "hidden"
        )}>
        <div className='rounded border-dashed border-4 border-zinc-200 p-40 pointer-events-none'>
          Drop Files
        </div>
      </div>
      <div
        {...getRootProps()}
        className='z-50 w-40 h-20 flex flex-col justify-center items-center border-2 border-dashed text-zinc-800 bg-gray-100 rounded bg-opacity-50 cursor-pointer group hover:bg-opacity-90 duration-200 uppercase'>
        <div className='flex-auto text-center text-md '>Drop Files</div>
        <div>
          <input {...getInputProps()} />
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
