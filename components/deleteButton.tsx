import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

export const DeleteButton = ({
  handleDelete,
}: {
  handleDelete: () => void
}) => {
  return (
    <Dialog>
      <DialogTrigger className='fixed w-20 top-20 mt-2 right-3 block z-50 bg-red-400 p-3 shadow-md transition duration-500 hover:scale-125 hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5'>
        Delete THEM!
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Files</DialogTitle>
          <DialogDescription>
            Please confirm you want to DELETE these files permanently. <br />
            (You could just refresh page to remove your selections)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='submit' variant='destructive' onClick={handleDelete}>
            <Trash2 className='mr-2 w-4 h-4' />
            Delete THEM!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
