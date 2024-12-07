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
import { ArrowUp, Replace } from "lucide-react"
import { cn, delay } from "@/lib/utils"
import { changeToken } from "@/actions/changeToken"
import { useAppStore } from "@/lib/store" // Import the store

export const ChangeToken = () => {
  const [isCopied, setIsCopied] = useState(false)
  const { userToken, setUserToken } = useAppStore() // Use the store

  if (!userToken) return null

  const handleChangeToken = async () => {
    const userUsage = await changeToken(userToken)
    if (userUsage) {
      setUserToken({ ...userToken, token: userUsage.token }) // Update token in the store
      setIsCopied(false)
    }
  }

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
          {/* <div>
            <code className='bg-slate-800 rounded-md p-1'>
              {userToken.token}
            </code>
          </div> */}

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

          {/* {userToken.token !== newToken && ( */}
          <div>
            please save your new token carefully because once you close this
            window, token will NOT show again and you can NEVER use your old
            token again. Please click to copy and store them somewhere safe, and
            you will need it if you use them as enviroments in your other app's
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
          {/* )} */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <Button variant='secondary'>Generate</Button> */}
          <AlertDialogAction disabled={!isCopied}>
            {/* {userToken.token === newToken ? ( */}
            <div className='flex items-center'>
              <ArrowUp className='w-5 h-5 mr-2' />
              Continue with this TOKEN
            </div>
            {/* ) : (
              "Close and use NEW token"
            )} */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
