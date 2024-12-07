"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { deleteFiles } from "@/actions"
import { useAppStore } from "@/lib/store" // Import the store

export const List = () => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userToken, files, setFiles } = useAppStore() // Use the store

  const onSelect = (fileId: string) => {
    setSelectedFileIds((prevSelectedIds) => {
      const isSelected = prevSelectedIds.includes(fileId)
      return isSelected
        ? prevSelectedIds.filter((id) => id !== fileId)
        : [...prevSelectedIds, fileId]
    })
  }

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

  useEffect(() => {
    setIsLoading(true)
    try {
      setFiles()
      setSelectedFileIds([])
    } catch (error: unknown) {
      console.error("Error fetching files:", error)
      toast.error("Error fetching files. Please try again later.", {
        description: (error as string) || "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [setFiles])

  if (!userToken) return <div>Not authenticated</div>

  const handleDelete = async () => {
    setIsLoading(true)
    if (selectedFileIds.length > 0) {
      try {
        await deleteFiles(selectedFileIds, userToken.token)
        setIsLoading(false)
        setSelectedFileIds([])
        setFiles()
        toast.success("Files deleted successfully!")
      } catch (error: unknown) {
        console.error("Error deleting files:", error)
        toast.error("Error deleting files. Please try again later.", {
          description: `${error}`,
        })
      }
    }
  }

  return (
    <>
      {isLoading && (
        <div className='fixed w-full h-full z-30 bg-black/50 flex items-center justify-center '>
          Loading...
        </div>
      )}
      <div className='fixed z-40 left-0 bottom-0'></div>
      <div className='flex flex-wrap items-center justify-center relative sm:justify-start mt-[138px] sm:mt-20'>
        {files ? (
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
