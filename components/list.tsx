"use client"

import { useEffect, useState } from "react"

// import { useToast } from "@/components/ui/use-toast"
// import { FileInfoProps } from "@/types"
// import { deleteFiles } from "@/actions/delete"
// import { listFiles } from "@/actions/list"
// import { Add } from "./add"
// import { Item } from "./item"
// import { DeleteButton } from "./deleteButton"
// import { SocketIndicator } from "./socket/indicator"

export const List = () => {
  // const [fileList, setFileList] = useState<FileInfoProps[]>([])
  // const { toast } = useToast()

  // const getData = async () => {
  //   // USE API route
  //   // const res = await axios.get("/api/list")
  //   // setFileList(res.data)

  //   // USE SERVER ACTIONS
  //   setFileList(await listFiles())
  // }

  // const selected = fileList
  //   .filter((file) => file.selected)
  //   .map((file) => file.id)

  // const handleSelect = (id: string) => {
  //   setFileList(
  //     fileList.map((file) =>
  //       file.id === id ? { ...file, selected: !file.selected } : file
  //     )
  //   )
  // }

  // USE API route
  // const handleDelete = async () => {
  //   await axios.post("/api/delete", { fileIds: selected })
  //   getData()
  // }

  // USE SERVER ACTIONS
  // const handleDelete = () => {
  //   deleteFiles(selected)
  //   // deleteFiles(selected).then(() => getData())
  // }

  // useEffect(() => {
  //   if (selected.length > 0) {
  //     toast({
  //       title: "Select Files",
  //       description: `${selected.length} file(s) selected.`,
  //     })
  //   } else {
  //     toast({
  //       title: "File List",
  //       description: `${fileList.length} file(s) in database.`,
  //     })
  //   }
  // }, [fileList.length, selected.length, toast])

  // useEffect(() => {
  //   getData()
  // }, [])

  return (
    <>
      {/* <Add getData={getData} /> */}
      <div className="fixed z-40 left-0 bottom-0">
      </div>

      <div className='flex flex-wrap items-center justify-center relative sm:justify-start mt-[138px] sm:mt-20'>
        {/* {fileList.map((file: FileInfoProps, index) => (
          <Item key={index} params={file} handleSelect={handleSelect} />
        ))}
        {selected.length > 0 && <DeleteButton handleDelete={handleDelete} />} */}
      </div>
    </>
  )
}
