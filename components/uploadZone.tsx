"use client"

import { useTransition } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { LoaderIcon } from "lucide-react"
import { logger } from "@/lib/utils"
import { useAppStore } from "@/lib/store" // Import the store
import axios from "axios"

const CHUNK_SIZE = 1024 * 256 // 256kb chunk size

export const UploadZone = ({ token }: { token: string }) => {
  const [isPending, startTransition] = useTransition()
  const { setFiles } = useAppStore() // Use the store

  const uploadChunk = async (
    chunk: Blob,
    fileName: string,
    index: number,
    totalChunks: number
  ) => {
    const formData = new FormData()
    formData.append("token", token)
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
    } catch (error) {
      logger(`error: ${error}`)
      toast.error("Upload Failed", {
        description: `${error}`,
        duration: 8000,
      })
    }
  }

  // const streamUploadFiles = async (files: File[]) => {
  //   for (const file of files) {
  //     const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const streamUploadFiles = async (files: File[]) => {
    for (const file of files) {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      const uploadPromises = [] // Collect promises for concurrent uploads

      for (let index = 0; index < totalChunks; index++) {
        const start = index * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end) // Get the chunk

        console.log(
          `Uploading chunk ${index + 1} of ${totalChunks} for file ${file.name}`
        )
        uploadPromises.push(uploadChunk(chunk, file.name, index, totalChunks)) // Schedule chunk upload
      }

      await Promise.all(uploadPromises) // Wait for all uploads to complete
    }
  }
  //   };
  // };

  const onDrop = async (acceptedFiles: File[]) => {
    const files: File[] = Array.from(acceptedFiles ?? [])

    startTransition(async () => {
      try {
        await streamUploadFiles(files)
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
