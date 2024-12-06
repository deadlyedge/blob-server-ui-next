import { useState } from "react"
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
import { RefreshCwOff, Replace } from "lucide-react"
import { cn, delay } from "@/lib/utils"
import { changeToken } from "@/actions/changeToken"
import { AuthenticatedUserType } from "@/types"

export const ChangeToken = ({
  userToken,
}: {
  userToken: AuthenticatedUserType
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [newToken, setNewToken] = useState(userToken.token)

  const handleChangeToken = async () => {
    const userUsage = await changeToken(userToken)
    if (userUsage) setNewToken(userUsage.token)
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast("TOKEN Copied", { description: text })
    delay(2000).then(() => setIsCopied(false))
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
          <div>
            <code className='bg-slate-800 rounded-md p-1'>
              {userToken.token}
            </code>
          </div>

          <div className='flex items-center'>
            <Button
              type='submit'
              variant='destructive'
              className='m-2 hover:motion-preset-blink'
              onClick={handleChangeToken}>
              <Replace className='mr-2 w-4 h-4' />
              Change to NEW token
            </Button>
            token will show below.
          </div>

          {userToken.token !== newToken && (
            <div>
              please save your new token carefully because once you close this
              window, token will NOT show again and you can NEVER use your old
              token again. <br />
              <br />
              Your new token is:{" "}
              <code
                className={cn(
                  "text-zinc-900 rounded-md p-1",
                  isCopied ? "bg-emerald-300" : "bg-yellow-200"
                )}
                onClick={() => copyText(newToken)}>
                {newToken}
              </code>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <Button variant='secondary'>Generate</Button> */}
          <AlertDialogAction>
            {userToken.token === newToken ? (
              <div className='flex items-center'>
                <RefreshCwOff className='w-5 h-5 mr-2' />
                Continue with OLD token
              </div>
            ) : (
              "Close and use NEW token"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
