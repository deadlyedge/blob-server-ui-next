import { ChangeToken } from "./changeToken"
import {
  Dialog,
  DialogClose,
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
import { CircleEllipsis } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "@radix-ui/react-label"

export const UsageAndSettings = () => {
  const { files, userToken, usage, uploadSwitch, setUploadSwitch } =
    useAppStore()

  if (!userToken) return null
  const onUploadSwitchChange = (value: "socket" | "tus" | "form") => {
    setUploadSwitch(value)
  }
  return (
    <Dialog>
      <DialogTrigger className='p-1 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
        <div className='flex items-center text-zinc-400'>
          <CircleEllipsis className='w-4 h-4 ml-1' />
          <span className='ml-2 text-sm'>Usage & Settings</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        {usage && (
          <>
            <DialogHeader>
              <DialogTitle>user: {userToken.user} info:</DialogTitle>
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
                  <TableCell className='text-right'>{files?.length}</TableCell>
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
        <div className='text-xs text-zinc-400'>
          [Last Download] has been hidden, because if you use this ui to manage
          the pyBlobServer files, you have to &apos;download&apos; them, so that
          the download date will be updated.
        </div>
        <h5>Upload Function Select:</h5>
        <RadioGroup
          defaultValue={uploadSwitch}
          className='text-sm ml-4'
          onValueChange={onUploadSwitchChange}>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='socket' id='r1' />
            <Label htmlFor='r1'>websocket (default)</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='tus' id='r2' />
            <Label htmlFor='r2'>tus (resumable uploads)</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='form' id='r3' />
            <Label htmlFor='r3'>form/multipart (normal)</Label>
          </div>
        </RadioGroup>
        <div className='text-xs text-zinc-400'>
          this is only for testing, websocket transfer is fastest in my network
          condition, but if you want to use the storage api in your own project,
          maybe here is a good place to try different functions.
        </div>
        <DialogFooter>
          <ChangeToken />
          <DialogClose className='p-2 rounded-md bg-slate-500 hover:bg-slate-700'>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
