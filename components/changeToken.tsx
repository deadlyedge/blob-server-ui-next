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
import { Replace } from "lucide-react"
import { toast } from "sonner"
import { cn, delay } from "@/lib/utils"
import { useState } from "react"
import { changeToken } from "@/actions/changeToken"

export const ChangeToken = ({
  userToken,
}: {
  userToken: {
    user: string
    token: string
  }
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [newToken, setNewToken] = useState(userToken.token)
  const { user, token } = userToken

  const handleChangeToken = async () => {
    const userUsage = await changeToken(user, token)
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
      <AlertDialogTrigger className='w-28 h-5 bg-orange-700 rounded-md hover:bg-orange-300 hover:text-zinc-700 transition-colors'>
        Change Token
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Token</AlertDialogTitle>
          <AlertDialogDescription>
            Please confirm you want to CHANGE your current token
            <br />
            <code className='bg-slate-800 rounded-md p-1'>
              {userToken.token}
            </code>
          </AlertDialogDescription>

          <div>
            <Button
              type='submit'
              variant='destructive'
              className='m-2'
              onClick={handleChangeToken}>
              <Replace className='mr-2 w-4 h-4' />
              Generate NEW token
            </Button>
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
            {userToken.token === newToken
              ? "Continue with OLD token"
              : "Close and use NEW token"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
