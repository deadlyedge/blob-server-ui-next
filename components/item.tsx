"use client"

import { useState } from "react"
import Image from "next/image"
import { FileInfoType } from "@/types"
import { cn, formatBytes, delay } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  FileBox,
  FileCode2,
  FileText,
  Trash2,
  FileAudio,
  FileVideo,
  ImageIcon,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ItemProps = {
  params: FileInfoType
  handleSelect: (id: string) => void
}

export const Item = ({ params, handleSelect }: ItemProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const imageUrl = `${params.baseUrl}/s/${params.file_id}`

  // Improved icon selection logic
  const Icon = (() => {
    if (params.file_name.match(/\.(jpg|jpeg|png|gif)$/i)) return ImageIcon
    if (params.file_name.match(/\.(pdf)$/i)) return FileText
    if (params.file_name.match(/\.(zip|7z|gz)$/i)) return FileBox
    if (params.file_name.match(/\.(mp4|mkv|avi)$/i)) return FileVideo
    if (params.file_name.match(/\.(mp3|wav|flac)$/i)) return FileAudio
    return FileCode2
  })()

  const fileInfo = {
    filename: params.file_name,
    imageUrl,
    fileSize: formatBytes(params.file_size),
    days: Math.floor(
      (Date.now() - new Date(params.upload_at).getTime()) / 3600 / 24 / 1000
    ),
    downloadUrl: `${imageUrl}?output=download`,
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast({ title: "Link Copied", description: text })
    delay(2000).then(() => setIsCopied(false))
  }

  return (
    <Card
      className={cn(
        "outline-none shadow-md text-zinc-700 text-lg sm:text-xs m-2 p-2 w-full sm:w-72 hover:outline-blue-300 hover:outline-4 transition-all",
        params.selected ? "bg-zinc-300/50" : "bg-white"
      )}>
      <CardContent className='w-full aspect-square relative mb-1 flex justify-center items-center'>
        {/* Improved Icon rendering */}
        {Icon !== ImageIcon ? (
          <Icon className='w-20 h-20' />
        ) : (
          <Image
            src={fileInfo.imageUrl}
            alt={fileInfo.filename}
            fill
            sizes='50vw'
            className='object-contain'
          />
        )}
      </CardContent>
      <div>
        <p className='truncate'>
          Filename:
          <code className='bg-zinc-200 px-1 rounded'>{fileInfo.filename}</code>
        </p>
        <p className='truncate rounded outline-none hover:outline-offset-1 hover:outline-2 hover:outline-orange-500 transition-all'>
          URL:
          <code
            className={cn(
              "px-1 rounded",
              isCopied ? "bg-emerald-300" : "bg-zinc-200"
            )}
            onClick={() => copyText(fileInfo.imageUrl)}>
            {fileInfo.imageUrl}
          </code>
        </p>
        <p>
          Size:{" "}
          <code className='bg-zinc-200 px-1 rounded'>{fileInfo.fileSize}</code>
        </p>
        <p>
          Uploaded:{" "}
          <code className='bg-zinc-200 px-1 rounded'>
            {fileInfo.days} days ago
          </code>
        </p>
        <div className='mt-1 flex justify-between'>
          <a href={fileInfo.downloadUrl} target='_blank'>
            <Button className='bg-orange-100 hover:bg-green-300'>
              <Download className='w-4 h-4 mr-2' />
              Download
            </Button>
          </a>
          <Toggle
            className='hover:bg-red-200 data-[state=on]:bg-red-700'
            id={params.file_id}
            pressed={params.selected}
            onPressedChange={() => handleSelect(params.file_id)}>
            <Trash2 className='w-4 h-4 text-red-300' />
          </Toggle>
        </div>
      </div>
    </Card>
  )
}
