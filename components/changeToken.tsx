import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { ArrowUp, Replace } from "lucide-react"
import { cn, delay } from "@/lib/utils"
import { changeToken } from "@/actions/actions"
import { useAppStore } from "@/lib/store" // Import the store
import { UserUsageType } from "@/types"

export const ChangeToken = () => {
  const [isCopied, setIsCopied] = useState(false)
  const { userToken, setUserToken } = useAppStore() // Use the store

  if (!userToken) return null

  const mutation = useMutation({
    mutationFn: () => changeToken(userToken),
    onSuccess: (data: UserUsageType | null) => {
      if (data) {
        setUserToken({ ...userToken, token: data.token })
        setIsCopied(false)
      } else {
        toast.error("Failed to change token: Unexpected response")
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to change token", { description: error.message })
    },
  })

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast("TOKEN Copied", { description: text })
    delay(20000).then(() => setIsCopied(false))
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className='p-2 bg-orange-700 rounded-md hover:bg-orange-300 hover:text-zinc-700 transition-colors'>
        Change Token
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Token</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm you want to CHANGE your current token
          </AlertDialogDescription>

          <div className='flex items-center'>
            <Button
              type='submit'
              variant='destructive'
              className='m-2 hover:motion-preset-blink'
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}>
              <Replace className='mr-2 w-4 h-4' />
              Change to NEW token
            </Button>
            {mutation.isPending && "Changing..."}
            token will show below.
          </div>

          <div>
            please save your new token carefully because once you close this
            window, token will NOT show again and you can NEVER use your old
            token again. Please click to copy and store them somewhere safe, and
            you will need it if you use them as environments in your other app's
            APIs.
            <br />
            <br />
            Your new token is:{" "}
            <code
              className={cn(
                "text-zinc-900 rounded-md p-1",
                isCopied ? "bg-emerald-300" : "bg-yellow-200"
              )}
              onClick={() => copyText(userToken.token)}>
              {userToken.token}
            </code>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction disabled={!isCopied || mutation.isPending}>
            <div className='flex items-center'>
              <ArrowUp className='w-5 h-5 mr-2' />
              Continue with this TOKEN
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
