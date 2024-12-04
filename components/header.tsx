import { Whisper } from "next/font/google"

import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { UserUsageType } from "@/types"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
const whisper = Whisper({ subsets: ["latin"], weight: "400" })

type HeaderProps = {
  userInfo?: {
    user: string
    token: string
  } | null
  userUsage: UserUsageType | null
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Header = ({
  userInfo,
  userUsage,
  handleOnChange,
}: HeaderProps) => {
  const showUsage = userUsage
    ? Object.entries(userUsage)
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
      <div className='w-24 h-24 sm:w-52 sm:h-32 right-0 top-0 fixed bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate bg-opacity-20'></div>
      <div className='w-full h-36 sm:h-20 right-0 top-0 fixed z-10 bg-zinc-500/40'>
        <div className='p-2 w-full h-28 flex flex-col text-start space-y-1 border-zinc-500 text-zinc-200'>
          <Label htmlFor='token'>your token</Label>
          <div className='flex items-center'>
            <Input
              // type='password'
              id='token'
              onChange={handleOnChange}
              defaultValue={userInfo?.token}
              placeholder='5209cf61-xxxx-xxxx-xxxx-600fe1105a9f'
              className='w-[300px] font-serif'
            />
            <div className='ml-2'>
              @
              {userInfo ? (
                <HoverCard>
                  <HoverCardTrigger className='ml-1 text-green-500 underline'>
                    {userInfo?.user}
                  </HoverCardTrigger>
                  <HoverCardContent className='text-xs'>
                    {showUsage.map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <span className='ml-1 text-red-400'>need valid token</span>
              )}
            </div>
          </div>
        </div>
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
