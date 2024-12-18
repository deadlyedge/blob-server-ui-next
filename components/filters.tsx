import { useAppStore } from "@/lib/store"

export const Filters = () => {
  const {files}=useAppStore()

  return <div className="text-sm">{files?.length} files in database.</div>
}