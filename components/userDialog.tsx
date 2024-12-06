import { AuthenticatedUserType, UserUsageType } from "@/types"
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

type UserDialogProps = {
  userToken: AuthenticatedUserType
  usage: UserUsageType | null
}

export const UserDialog = ({ userToken, usage }: UserDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className='truncate text-green-500 hover:text-yellow-500 hover:motion-preset-wobble'>
        <div className='flex items-center'>
          <Info className='w-4 h-4 ml-1' />
          <span className='ml-1  underline'>{userToken.user}</span>
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
                  <TableHead className='text-right'>Size</TableHead>
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
                    {formatBytes(usage.total_size)}
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
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
        <div>
          [Last Download] has been hidden, because if you use this ui to manage
          the pyBlobServer files, you have to `&apos;`download`&apos;` them.
        </div>
        <DialogFooter>
          <ChangeToken userToken={userToken} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
