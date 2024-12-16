"use client"

import { useEffect, useRef, useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { logger } from "@/lib/utils"
import { useAppStore } from "@/lib/store" // Import the store

export const UploadZone = ({ token }: { token: string }) => {
  const [isPending, startTransition] = useTransition()
  const { setFiles } = useAppStore() // Use the store
  const ws = useRef<WebSocket>(null)

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_SOCKET_ENDPOINT as string
    )

    socket.onopen = () => {
      console.log("WebSocket connection established")
      socket.send(token) // Send the token immediately after connection is established
    }
    socket.onmessage = (event) => {
      if (typeof event.data === "string")
        console.log("Message from server:", event.data)
      else if (typeof event.data === "object") toast.success("file uploaded")
    }

    socket.onclose = () => {
      console.log("WebSocket connection closed")
    }

    ws.current = socket

    return () => {
      // Close WebSocket connection on unmount
      socket.close()
    }
  }, [token])

  const uploadSocket = (fileName: string, fileBytes: ArrayBuffer) => {
    console.log(token, ws.current)
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(fileName) // Send the file name
      ws.current.send(fileBytes) // Send the file data
      // socket.send(
      //   new Uint8Array([
      //     0x45, 0x4e, 0x44, 0x5f, 0x4f, 0x46, 0x5f, 0x46, 0x49, 0x4c, 0x45,
      //   ])
      // ) // Send end-of-file marker as binary
      console.log("File sent to WebSocket")
    } else {
      logger("WebSocket is not open")
      toast.error("WebSocket is not open", {
        duration: 8000,
      })
    }
  }

  const socketUploadFiles = (files: File[]) => {
    for (const file of files) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const fileBytes = fileReader.result as ArrayBuffer
        uploadSocket(file.name, fileBytes) // Pass the file name
      }
      fileReader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const files: File[] = Array.from(acceptedFiles ?? [])

    startTransition(async () => {
      try {
        socketUploadFiles(files)
        setFiles()
      } catch (error) {
        logger(`error: ${error}`)
        toast.error("Upload Failed", {
          description: `${error}`,
          duration: 8000,
        })
      }
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  return (
    <>
      <div
        {...getRootProps()}
        className='z-50 w-40 h-20 flex flex-col justify-center items-center border-2 border-dashed text-zinc-800 bg-gray-100 rounded bg-opacity-50 cursor-pointer group hover:bg-opacity-90 duration-200 uppercase'>
        <div className='flex-auto text-center text-lg '>Drop Files Here</div>
        <div className='flex-init'>
          <input {...getInputProps()} />
          <svg
            className='w-8 h-8 mx-auto rotate-45 text-blue-500 group-hover:rotate-[135deg] group-hover:text-lime-500 duration-200'
            fill='currentColor'
            viewBox='7 2 10 20'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z'></path>
          </svg>
        </div>
        <div className='flex-auto ml-5 sm:ml-0 lg:ml-5 text-sm'>
          click to select
        </div>
      </div>
      {isPending && (
        <div className='fixed w-full h-full flex justify-center items-center bg-black/50'>
          <LoaderIcon color='#2F80ED' className='animate-spin' />
        </div>
      )}
    </>
  )
}
