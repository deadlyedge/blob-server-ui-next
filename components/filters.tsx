import { useAppStore } from "@/lib/store"
import { FileIcon } from "lucide-react"

export const Filters = () => {
  const { files } = useAppStore()

  return (
    <div className='text-sm flex items-center'>
      <FileIcon className='inline w-4 h-4' />
      {files?.length} files
    </div>
  )
}
