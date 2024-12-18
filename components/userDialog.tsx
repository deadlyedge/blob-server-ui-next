import { ChangeToken } from "./changeToken"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBytes } from "@/lib/utils"
import { Info } from "lucide-react"
import { useAppStore } from "@/lib/store"

export const UserDialog = () => {
  const { files, userToken, usage } = useAppStore()

  if (!userToken) return null
  return (
    <Dialog>
      <DialogTrigger className='truncate text-green-500 hover:text-yellow-500 hover:motion-preset-wobble-sm'>
        <div className='flex items-center'>
          <Info className='w-4 h-4 ml-1' />
          <span className='ml-1 underline'>{userToken.user}</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        {usage && (
          <>
            <DialogHeader>
              <DialogTitle>{userToken.user} info:</DialogTitle>
              <DialogDescription>
                create at: {new Date(usage.created_at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <Table>
              {/* <TableCaption>your usage info</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>Upload</TableHead>
                  <TableHead className='text-right'>Download</TableHead>
                  <TableHead className='text-right'>Total Files</TableHead>
                  <TableHead className='text-right'>Last Upload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='text-right'>
                    {usage.total_upload_times}
                  </TableCell>
                  <TableCell className='text-right'>
                    {usage.total_download_times}
                  </TableCell>
                  <TableCell className='text-right'>
                    {files?.length}
                  </TableCell>
                  <TableCell className='text-right'>
                    {new Date(usage.last_upload_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>Bytes</TableHead>
                  <TableHead className='text-right'>Bytes</TableHead>
                  <TableHead className='text-right'>Space Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='text-right'>
                    {formatBytes(usage.total_upload_byte)}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatBytes(usage.total_download_byte)}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatBytes(usage.total_size)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
        <div className="text-xs text-zinc-400">
          [Last Download] has been hidden, because if you use this ui to manage
          the pyBlobServer files, you have to &apos;download&apos; them, so that
          the download date will be updated.
        </div>
        <DialogFooter>
          <ChangeToken />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
