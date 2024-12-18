import { useAppStore } from "@/lib/store"

export const Filters = () => {
  const {files}=useAppStore()

  return <div className="ml-2">{files?.length} files in database.</div>
}