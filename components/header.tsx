import { Whisper } from "next/font/google"
import { cn } from "@/lib/utils"
import { UserUsageType } from "@/types"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadZone } from "./uploadZone"
import { ChangeToken } from "./changeToken"

const whisper = Whisper({ subsets: ["latin"], weight: "400" })

type HeaderProps = {
  userToken?: {
    user: string
    token: string
  } | null
  usage: UserUsageType | null
  onAuthentication: (token: string) => void
}

export const Header = ({ userToken, usage, onAuthentication }: HeaderProps) => {
  // Improved usage display logic
  const formattedUsage = usage
    ? Object.entries(usage)
        .map(([key, value]) => {
          if (typeof value === "number") {
            return `${key}: ${value}`
          }
          if (key.endsWith("at")) {
            return `${key}: ${new Date(value).toLocaleString()}`
          }
          return null
        })
        .filter(Boolean)
    : []

  return (
    <>
      {/* Background gradient */}
      <div className='w-24 h-24 sm:w-52 sm:h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>

      {/* Main header container */}
      <div className='w-full h-36 sm:h-20 right-0 top-0 fixed flex items-center z-10 bg-zinc-700/70'>
        {/* token section */}
        <div className='p-2 w-[320px] h-20 flex flex-col items-baseline justify-between border-zinc-500 text-zinc-200'>
          <div className='flex items-center text-sm'>
            {userToken ? (
              <ChangeToken userToken={userToken} />
            ) : (
              <Label htmlFor='token'>Your Token</Label>
            )}
            <div className='ml-2'>
              @
              {userToken ? (
                <HoverCard>
                  <HoverCardTrigger className='ml-1 text-green-500 underline'>
                    {userToken.user}
                  </HoverCardTrigger>
                  <HoverCardContent className='text-xs'>
                    {formattedUsage.map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <span className='ml-1 text-red-400'>Need valid token</span>
              )}
            </div>
          </div>
          <div className='flex items-center'>
            <Input
              id='token'
              onChange={(e) => onAuthentication(e.target.value)}
              defaultValue={userToken?.token}
              placeholder='5209cf61-xxxx-xxxx-xxxx-600fe1105a9f'
              className='w-[300px] font-serif border-zinc-500 border-t-0 border-b-0'
            />
          </div>
        </div>

        {/* upload section */}
        {userToken && <UploadZone token={userToken.token} />}

        {/* Title section */}
        <section
          className={cn(
            whisper.className,
            "fixed z-40 text-gray-100 scale-50 sm:scale-100 sm:h-40 sm:w-48 top-2 sm:top-0 right-0"
          )}>
          <div className='absolute top-8 right-2 text-[3rem] mr-16 mt-10 -rotate-90'>
            python
          </div>
          <div className='absolute inset-y-0 right-2'>
            <div className='text-[5rem] -mt-8'>BlobServer</div>
            <div className='font-sans text-xl mt-0 float-right'>NexTS</div>
          </div>
        </section>
      </div>
    </>
  )
}
