"use client"

import { useEffect, useState } from "react"
import { FileInfoType } from "@/types"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { deleteFiles } from "@/actions/delete"
import { listFiles } from "@/actions/list"
import { useRefresh } from "./providers"

export const List = ({ token }: { token: string | undefined }) => {
  const [fileList, setFileList] = useState<FileInfoType[] | null>(null) // Initialize as null
  const { refresh } = useRefresh()
  const selectedFileIds =
    fileList?.filter((file) => file.selected).map((file) => file.file_id) || []

  const handleSelect = (fileId: string) => {
    setFileList((prevList) =>
      prevList
        ? prevList.map((file) =>
            file.file_id === fileId
              ? { ...file, selected: !file.selected }
              : file
          )
        : []
    )
  }

  const handleDelete = async () => {
    if (token && selectedFileIds.length > 0) {
      try {
        await deleteFiles(selectedFileIds, token)
        await getFiles(token)
      } catch (error) {
        console.error("Error deleting files:", error)
        toast("Error", {
          description: "Failed to delete files. Please try again later.",
        })
      }
    }
  }

  const getFiles = async (token: string) => {
    try {
      const files = await listFiles(token)
      setFileList(files)
    } catch (error) {
      console.error("Error fetching files:", error)
      toast("Error", {
        description: "Failed to fetch files. Please try again later.",
      })
    }
  }

  useEffect(() => {
    if (token) {
      getFiles(token)
    } else {
      setFileList(null)
    }
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
  }, [fileList, selectedFileIds.length, toast])

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
        {/* Display message if no files */}
        {selectedFileIds.length > 0 && (
          <DeleteButton handleDelete={handleDelete} />
        )}
      </div>
    </>
  )
}
