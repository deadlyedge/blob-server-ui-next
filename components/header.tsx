import { Whisper } from "next/font/google"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"

import { useAppStore } from "@/lib/store"
import { checkAuth } from "@/actions"

import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadZone } from "./uploadZone"
import { UserDialog } from "./userDialog"
import { Filters } from "./filters"
import { SearchBar } from "./search"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })

export const Header = () => {
  const { userToken, setUserToken } = useAppStore()

  const onAuthentication = async (token: string | undefined) => {
    try {
      const response = await checkAuth(token || "")
      setUserToken(response)
      toast.info(`Welcome back, ${response.user}!`, { duration: 3000 })
    } catch {
      toast.error("Invalid token. Please try again.", { duration: 3000 })
      setUserToken(null)
    }
  }
  const debouncedOnAuthentication = debounce(onAuthentication, 700)

  return (
    <>
      {/* Main header container */}
      <div className='w-full h-20 right-0 top-0 fixed flex items-center z-10 bg-zinc-700/80 backdrop-blur-md'>
        {/* token section */}
        <div className='p-2 sm:w-80 h-20 flex flex-col items-baseline justify-between border-zinc-500 text-zinc-200'>
          <div className='flex items-center text-sm'>
            {!userToken?.user ? (
              <>
                <Label htmlFor='token'>Your Token</Label>
                <div>
                  @ <span className='ml-1 text-red-400'>Need valid token</span>
                </div>
              </>
            ) : (
              <UserDialog />
            )}
          </div>
          <div className='flex items-center'>
            <Input
              id='token'
              onChange={(e) => debouncedOnAuthentication(e.target.value)}
              defaultValue={userToken?.token}
              placeholder='5209cf61-xxxx-xxxx-xxxx-600fe1105a9f'
              className='w-40 sm:w-[300px] font-serif border-zinc-500 border-t-0 border-b-0'
            />
          </div>
        </div>

        {/* upload section */}
        {userToken && (
          <div className="flex flex-row items-center">
            <UploadZone />
            <div className="ml-1 flex flex-col items-center">
              <SearchBar />
              <Filters />
            </div>
          </div>
        )}

        {/* Title section */}
        <section
          className={cn(
            whisper.className,
            "fixed text-gray-100 top-0 right-0"
          )}>
          <div className='h-20 w-36 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-opacity-20 blur z-20'></div>
          <div className='absolute top-8 right-2 text-[1rem] mr-16 mt-2 -rotate-90 z-30'>
            python
          </div>
          <div className='absolute inset-y-0 right-2 z-30'>
            <div className='text-[2rem] -mt-1'>BlobServer</div>
            <div className='font-serif text-xl -mt-1 float-right'>NextUI</div>
          </div>
        </section>
      </div>
    </>
  )
}
