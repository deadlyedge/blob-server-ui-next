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
    // const message =
    //   selectedFileIds.length > 0
    //     && `${selectedFileIds.length} file(s) selected.`
    //     // : files
    //     // ? `${files.length} file(s) in database.`
    //     // : "No files found."
    // toast(selectedFileIds.length > 0 && "Selected Files" : "File List", {
    //   description: message,
    // })
  }, [selectedFileIds.length])

  useEffect(() => {
    setFiles()
  }, [setFiles])

  if (!userToken) return <div>Not authenticated</div>

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
