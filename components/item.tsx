"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Download,
  FileBox,
  FileCode2,
  FileText,
  Trash2,
  FileAudio,
  FileVideo,
} from "lucide-react"

import { FileInfoType } from "@/types"
import { cn, formatBytes, delay } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
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

  const showInfo = {
    filename: params.file_id,
    imageUrl,
    fileSize: formatBytes(params.file_size),
    days: Math.floor(
      (Date.now() - new Date(params.upload_at).getTime()) / 3600 / 24 / 1000
    ),
    downloadUrl: `${imageUrl}?output=download`,

    isImage: params.file_name.match(/\.(jpg|jpeg|png|gif)$/i),
    isPDF: params.file_name.match(/\.(pdf)$/i),
    isZip: params.file_name.match(/\.(zip|7z|gz)$/i),
    isVideo: params.file_name.match(/\.(mp4|mkv|avi)$/i),
    isAudio: params.file_name.match(/\.(mp3|wav|flac)$/i),
  }

  if (!params.selected) params.selected = false

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast({
      title: "Link Copied",
      description: text,
    })
    delay(2000).then(() => setIsCopied(false))
  }

  return (
    <Card
      className={cn(
        "outline-none shadow-md text-zinc-700 text-lg sm:text-xs m-2 p-2 w-full sm:w-72 hover:outline-blue-300 hover:outline-4 transition-all",
        params.selected ? "bg-zinc-300/50" : "bg-white"
      )}>
      <CardContent className='w-full aspect-square relative mb-1 flex justify-center items-center'>
        {showInfo.isImage && (
          <Image
            src={showInfo.imageUrl}
            alt={showInfo.filename}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
            className='object-contain'
          />
        )}
        {showInfo.isPDF && <FileText className='w-20 h-20' />}
        {showInfo.isZip && <FileBox className='w-20 h-20' />}
        {showInfo.isVideo && <FileVideo className='w-20 h-20' />}
        {showInfo.isAudio && <FileAudio className='w-20 h-20' />}
        {!showInfo.isImage &&
          !showInfo.isPDF &&
          !showInfo.isZip &&
          !showInfo.isVideo &&
          !showInfo.isAudio && <FileCode2 className='w-20 h-20' />}
      </CardContent>
      <p className='truncate'>
        filename:
        <code className='bg-zinc-200 px-1 rounded'>{params.file_name}</code>
      </p>
      <p className='truncate rounded outline-none hover:outline-offset-1 hover:outline-2 hover:outline-orange-500 transition-all'>
        url:
        <code
          className={cn(
            "px-1 rounded",
            isCopied ? "bg-emerald-300 " : "bg-zinc-200"
          )}
          onClick={() => copyText(showInfo.imageUrl)}>
          {showInfo.imageUrl}
        </code>
      </p>
      <p>
        size:
        <code className='bg-zinc-200 px-1 rounded'>{showInfo.fileSize}</code>
      </p>
      <p>
        exist:
        <code className='bg-zinc-200 px-1 rounded'>{showInfo.days} days</code>
      </p>
      <p className='mt-1'>
        <a href={showInfo.downloadUrl} target='_blank'>
          <Button className='bg-orange-100 hover:bg-green-300 '>
            <Download className='w-4 h-4 mr-2' />
            Download
          </Button>
        </a>
        <Toggle
          className='float-right hover:bg-red-200 data-[state=on]:bg-red-700'
          id={params.file_id}
          pressed={params.selected}
          onPressedChange={() => handleSelect(params.file_id)}>
          <Trash2 className='w-4 h-4 text-red-300' />
        </Toggle>
        {/* <input
          type='checkbox'
          id={params.file_id}
          name={params.file_id}
          checked={params.selected}
          onChange={() => handleSelect(params.file_id)}
          className='w-5 h-5 mt-1 rounded-lg float-right accent-red-500 hover:outline-2 hover:outline hover:outline-offset-2 hover:outline-red-600 transition-all'></input> */}
      </p>
    </Card>
  )
}
