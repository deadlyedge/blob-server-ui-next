"use client"

import { useEffect } from "react"
import { Whisper } from "next/font/google"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"

import { cookiesStorage, useAppStore } from "@/lib/store"
import { checkAuth } from "@/actions"

import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadZone } from "./uploadZone"
import { UsageAndSettings } from "./usageAndSettings"
// import { Filters } from "./filters"
import { SearchBar } from "./search"
import { AuthenticatedUserType } from "@/types"
import { FileIcon } from "lucide-react"
import { Separator } from "./ui/separator"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })

export const Header = () => {
  const { userToken, files, setUserToken, setUsage, setFiles } = useAppStore()

  const onAuthentication = async (token: string | undefined) => {
    const response = await checkAuth(token || "")
    if (!response) {
      toast.error("Invalid token. Please try again.", { duration: 3000 })
      setUserToken(null)
    } else {
      setUserToken(response)
      toast.info(`Welcome back, ${response.user}!`, { duration: 3000 })
    }
    setFiles()
  }
  const debouncedOnAuthentication = debounce(onAuthentication, 700)

  useEffect(() => {
    const initialUser: AuthenticatedUserType | null = cookiesStorage.getItem()
    if (initialUser) setUserToken(initialUser)
  }, [setUserToken])

  useEffect(() => {
    setUsage() // Adjust this based on your actual usage handling
  }, [userToken, setUsage])

  return (
    <>
      {/* Main header container */}
      <div className='w-full h-20 right-0 top-0 fixed flex items-center z-10 bg-zinc-700/80 backdrop-blur-md'>
        {/* token section */}
        <div className='p-2 sm:w-80 h-20 flex flex-col items-baseline justify-between border-zinc-500 text-zinc-200'>
          {!userToken?.user ? (
            <div className='flex flex-row items-center justify-between w-full'>
              <Label htmlFor='token'>Your Token</Label>
              <span className='ml-1 text-red-400 text-sm'>
                Need valid token
              </span>
            </div>
          ) : (
            <div className='flex flex-row items-center justify-between w-full'>
              <div className='truncate text-green-500 max-w-56'>
                {userToken.user}
              </div>
              <div className='text-sm flex items-center'>
                <FileIcon className='inline w-4 h-4' />
                {files?.length} files
              </div>
            </div>
          )}
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

        <Separator className='h-8 bg-zinc-500' orientation='vertical' />

        {/* upload section */}
        {userToken && (
          <div className='flex flex-row items-center'>
            <div className='flex flex-col items-start mr-1'>
              <SearchBar />
              <UsageAndSettings />
            </div>
            <UploadZone />
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
