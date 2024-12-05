"use client"

import { useEffect, useState } from "react"
import { FileInfoType } from "@/types"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { deleteFiles } from "@/actions/delete"
import { listFiles } from "@/actions/list"
import { useRefresh } from "./providers"
import { useRouter } from "next/navigation"

export const List = ({ token }: { token: string | undefined }) => {
  const [fileList, setFileList] = useState<FileInfoType[] | null>(null)
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([])
  const { refresh } = useRefresh()
  const router = useRouter()

  const handleSelect = (fileId: string) => {
    const updatedFileList =
      fileList?.map((file) =>
        file.file_id === fileId ? { ...file, selected: !file.selected } : file
      ) || []
    setFileList(updatedFileList)
    setSelectedFileIds(
      updatedFileList
        .filter((file) => file.selected)
        .map((file) => file.file_id)
    )
  }

  const handleDelete = async () => {
    if (token && selectedFileIds.length > 0) {
      try {
        await deleteFiles(selectedFileIds, token)
        await getFiles(token)
        toast.success("Files deleted successfully!")
      } catch (error: any) {
        console.error("Error deleting files:", error)
        toast.error("Error deleting files. Please try again later.", {
          description: error.message,
        })
      }
    }
  }

  const getFiles = async (token: string) => {
    try {
      const files = await listFiles(token)
      setFileList(files)
      setSelectedFileIds([]) // Clear selection after fetching new files
    } catch (error: any) {
      console.error("Error fetching files:", error)
      toast.error("Error fetching files. Please try again later.", {
        description: error.message,
      })
    }
  }

  useEffect(() => {
    if (token) {
      getFiles(token)
    }
    router.refresh()
  }, [token, refresh])

  useEffect(() => {
    const message =
      selectedFileIds.length > 0
        ? `${selectedFileIds.length} file(s) selected.`
        : fileList
        ? `${fileList.length} file(s) in database.`
        : "No files found."
    toast(selectedFileIds.length > 0 ? "Selected Files" : "File List", {
      description: message,
    })
  }, [fileList, selectedFileIds.length])

  return (
    <>
      <div className='fixed z-40 left-0 bottom-0'></div>
      <div className='flex flex-wrap items-center justify-center relative sm:justify-start mt-[138px] sm:mt-20'>
        {fileList ? (
          fileList.map((file) => (
            <Item
              key={file.file_id}
              params={file}
              handleSelect={handleSelect}
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
