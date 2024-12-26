"use client"

import { useEffect, useState } from "react"
import { LoaderIcon } from "lucide-react"
import { useMask } from "@/lib/store"
import { Progress } from "@/components/ui/progress"

export const MaskProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const { type, progress, isOpen } = useMask()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (!isOpen) return null

  return (
    <div className='fixed z-50 w-full h-full flex flex-col justify-center items-center bg-black/50 backdrop-blur transition-opacity duration-300'>
      {type === "upload" ? (
        <div>
          uploading...
          <Progress value={progress} className='w-[60vw]' />
        </div>
      ) : (
        // </div>
        // <div className='fixed z-50 w-full h-full flex justify-center items-center bg-black/50 backdrop-blur transition-opacity duration-300'>
        <LoaderIcon color='#2F80ED' className='animate-spin' />
      )}
    </div>
  )
}
