"use client"

import { useToast } from "@/hooks/use-toast"
import { FileInfoType } from "@/types"
import { useEffect, useState } from "react"
import { Item } from "./item"
import { DeleteButton } from "./deleteButton"
import { deleteFiles } from "@/actions/delete"
import { listFiles } from "@/actions/list"
import { useRouter } from "next/navigation"

export const List = ({ token }: { token: string | undefined }) => {
  const [fileList, setFileList] = useState<FileInfoType[] | null>([])
  const { toast } = useToast()
  const router = useRouter()

  const selected = fileList
    ? fileList.filter((file) => file.selected).map((file) => file.file_id)
    : []

  const handleSelect = (file_id: string) => {
    setFileList(
      fileList
        ? fileList.map((file) =>
            file.file_id === file_id
              ? { ...file, selected: !file.selected }
              : file
          )
        : []
    )
  }

  // USE API route
  // const handleDelete = async () => {
  //   await axios.post("/api/delete", { fileIds: selected })
  //   getData()
  // }

  // USE SERVER ACTIONS
  const handleDelete = () => {
    deleteFiles(selected, token)
    if (token) getFiles(token)
    // deleteFiles(selected).then(() => getData())
  }

  useEffect(() => {
    if (selected.length > 0) {
      toast({
        title: "Select Files",
        description: `${selected.length} file(s) selected.`,
      })
    } else {
      toast({
        title: "File List",
        description: `${fileList ? fileList.length : 0} file(s) in database.`,
      })
    }
  }, [fileList, selected.length, toast])
  const getFiles = async (token: string) => {
    setFileList(await listFiles(token))
  }

  useEffect(() => {
    if (token) {
      getFiles(token)
    } else {
      setFileList(null)
    }
    router.refresh()
  }, [token])

  return (
    <>
      {/* <Add getData={getData} /> */}
      <div className='fixed z-40 left-0 bottom-0'></div>

      <div className='flex flex-wrap items-center justify-center relative sm:justify-start mt-[138px] sm:mt-20'>
        {/* {fileList.map((file: FileInfoType, index) => (
          <Item key={index} params={file} handleSelect={handleSelect} />
        ))} */}
        {fileList &&
          fileList.map((file: FileInfoType, index) => (
            <Item key={index} params={file} handleSelect={handleSelect} />
          ))}
        {selected.length > 0 && <DeleteButton handleDelete={handleDelete} />}
      </div>
    </>
  )
}
