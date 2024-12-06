"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileInfoType } from "@/types"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { deleteFiles } from "@/actions/delete"
import { listFiles } from "@/actions/list"
import { useRefresh } from "./providers"

export const List = ({ token }: { token: string }) => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<FileInfoType[] | null>(null)
  const { refresh, setRefresh } = useRefresh()
  const router = useRouter()

  const onSelect = (fileId: string) => {
    setSelectedFileIds((prevSelectedIds) => {
      const isSelected = prevSelectedIds.includes(fileId)
      return isSelected
        ? prevSelectedIds.filter((id) => id !== fileId)
        : [...prevSelectedIds, fileId]
    })
  }

  const handleDelete = async () => {
    if (selectedFileIds.length > 0) {
      try {
        await deleteFiles(selectedFileIds, token)
        setRefresh(!refresh)
        toast.success("Files deleted successfully!")
      } catch (error: unknown) {
        console.error("Error deleting files:", error)
        toast.error("Error deleting files. Please try again later.", {
          description: `${error}`,
        })
      }
    }
  }

  useEffect(() => {
    const getFiles = async () => {
      setIsLoading(true)
      try {
        const fetchedFiles = await listFiles(token)
        setFiles(fetchedFiles)
        setSelectedFileIds([])
      } catch (error: unknown) {
        console.error("Error fetching files:", error)
        toast.error("Error fetching files. Please try again later.", {
          description: (error as string) || "Unknown error",
        })
      } finally {
        setIsLoading(false)
      }
    }
    getFiles()
    router.refresh()
  }, [refresh, router, token])

  useEffect(() => {
    const message =
      selectedFileIds.length > 0
        ? `${selectedFileIds.length} file(s) selected.`
        : files
        ? `${files.length} file(s) in database.`
        : "No files found."
    toast(selectedFileIds.length > 0 ? "Selected Files" : "File List", {
      description: message,
    })
  }, [files, selectedFileIds.length])

  return (
    <>
      <div className='fixed z-40 left-0 bottom-0'></div>
      <div className='flex flex-wrap items-center justify-center relative sm:justify-start mt-[138px] sm:mt-20'>
        {isLoading ? (
          <div className='relative w-full h-20 z-10 bg-black/50 flex flex-col items-center justify-center '>
            Loading...
          </div>
        ) : files ? (
          files.map((file) => (
            <Item
              key={file.file_id}
              file={file}
              selected={selectedFileIds.includes(file.file_id)}
              onSelect={onSelect}
            />
          ))
        ) : (
          <p>No files found.</p>
        )}
        {selectedFileIds.length > 0 && (
          <DeleteButton handleDelete={handleDelete} />
        )}
      </div>
    </>
  )
}
