"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileInfoType } from "@/types"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { listFiles, deleteFiles } from "@/actions/actions"
import { useAppStore } from "@/lib/store" // Import the store
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const List = () => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])
  const { userToken, refresh, setRefresh, files, setFiles } = useAppStore() // Use the store
  const router = useRouter()
  const queryClient = useQueryClient()

  if (!userToken) return <div>Not authenticated</div>

  const onSelect = (fileId: string) => {
    setSelectedFileIds((prevSelectedIds) => {
      const isSelected = prevSelectedIds.includes(fileId)
      return isSelected
        ? prevSelectedIds.filter((id) => id !== fileId)
        : [...prevSelectedIds, fileId]
    })
  }

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteFiles(ids, userToken.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", userToken.token] })
      setRefresh()
      toast.success("Files deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Error deleting files:", error)
      toast.error("Error deleting files. Please try again later.", {
        description: error.message,
      })
    },
  })

  const handleDelete = () => {
    if (selectedFileIds.length > 0) {
      deleteMutation.mutate(selectedFileIds)
    }
  }

  const {
    data: fetchedFiles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["files", userToken?.token], // Handle potential null token
    queryFn: () => listFiles(userToken?.token!), // Handle potential null token
    enabled: !!userToken, // Only run query if userToken is available
  })
  
  useEffect(() => {
    if (isError) {
      toast.error("Error fetching files. Please try again later.", {
        description: error.message,
      })
    }
  }, [isError])

  useEffect(() => {
    setFiles(fetchedFiles || [])
    setSelectedFileIds([])
  }, [fetchedFiles, setFiles])

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
        ) : isError ? (
          <p>Error loading files: {error?.message}</p>
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
