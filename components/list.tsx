"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { useAppStore } from "@/lib/store" // Import the store

export const List = () => {
  const {
    userToken,
    files,
    setFiles,
    selectedFileIds,
    isLoading,
    onSelect,
    handleDelete,
  } = useAppStore() // Use the store

  useEffect(() => {
    if (selectedFileIds.length > 0) {
      toast.info(`${selectedFileIds.length} file(s) selected.`)
    }
  }, [selectedFileIds.length])

  useEffect(() => {
    setFiles()
  }, [setFiles])

  return (
    <>
      {!userToken && (
        <div className='fixed w-full h-full flex items-center justify-center'>
          Please use a valid token.
        </div>
      )}
      {isLoading && (
        <div className='fixed w-full h-full z-30 bg-black/50 flex items-center justify-center '>
          Loading...
        </div>
      )}
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
