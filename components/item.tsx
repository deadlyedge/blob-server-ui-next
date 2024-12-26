"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { cn, delay, formatBytes } from "@/lib/utils"
import type { FileInfoType } from "@/types"
import {
	Download,
	FileAudio,
	FileBox,
	FileCode2,
	FileText,
	FileVideo,
	ImageIcon,
	Trash2,
} from "lucide-react"
import Image from "next/image"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"

type ItemProps = {
	file: FileInfoType // Define your FileType
	selected: boolean
	onSelect: (fileId: string) => void
}

export const Item = ({ file, selected, onSelect }: ItemProps) => {
	const [isCopied, setIsCopied] = useState(false)

	const imageUrl = `${file.baseUrl}/s/${file.file_id}`

	// Improved icon selection logic
	if (!file.file_name) return <Skeleton />

	const Icon = (() => {
		if (file.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return ImageIcon
		if (file.file_name.match(/\.(pdf)$/i)) return FileText
		if (file.file_name.match(/\.(zip|7z|gz)$/i)) return FileBox
		if (file.file_name.match(/\.(mp4|mkv|avi)$/i)) return FileVideo
		if (file.file_name.match(/\.(mp3|wav|flac)$/i)) return FileAudio
		return FileCode2
	})()

	const fileInfo = {
		filename: file.file_name,
		imageUrl,
		fileSize: formatBytes(file.file_size),
		days: Math.floor(
			(Date.now() - new Date(file.upload_at).getTime()) / 3600 / 24 / 1000,
		),
		downloadUrl: `${imageUrl}?output=download`,
	}

	const copyText = (text: string) => {
		navigator.clipboard.writeText(text)
		setIsCopied(true)
		toast("Link Copied", { description: text })
		delay(2000).then(() => setIsCopied(false))
	}

	return (
		<Suspense fallback={<Skeleton className="w-full h-full" />}>
			<Card
				className={cn(
					"ring-none shadow-md text-zinc-700 text-lg sm:text-xs m-2 p-2 w-full sm:w-72 hover:ring-blue-300 hover:ring-4",
					selected ? "bg-zinc-400/50" : "bg-zinc-200",
				)}>
				<CardContent className="w-full aspect-square relative mb-1 flex justify-center items-center">
					{/* Improved Icon rendering */}
					{Icon !== ImageIcon ? (
						<Icon className="w-20 h-20" />
					) : (
						<Image
							src={fileInfo.imageUrl}
							alt={fileInfo.filename}
							fill
							sizes="50vw"
							className="object-contain"
						/>
					)}
				</CardContent>
				<div className="w-[90vw] sm:w-full">
					<p className="truncate">
						Filename:
						<code className="bg-zinc-200 px-1 rounded">
							{fileInfo.filename}
						</code>
					</p>
					<p className="truncate rounded outline-none hover:outline-offset-1 hover:outline-2 hover:outline-orange-500 transition-all">
						URL:
						<code
							className={cn(
								"px-1 rounded",
								isCopied ? "bg-emerald-300" : "bg-zinc-200",
							)}
							onClick={() => copyText(fileInfo.imageUrl)}>
							{fileInfo.imageUrl}
						</code>
					</p>
					<p>
						Size:{" "}
						<code className="bg-zinc-200 px-1 rounded">
							{fileInfo.fileSize}
						</code>
					</p>
					<p>
						Uploaded:{" "}
						<code className="bg-zinc-200 px-1 rounded">
							{fileInfo.days} days ago
						</code>
					</p>
					<div className="mt-1 flex justify-between">
						<a href={fileInfo.downloadUrl} target="_blank" rel="noreferrer">
							<Button className="bg-orange-100 hover:bg-green-300">
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
						</a>
						<Toggle
							className="hover:bg-red-200 data-[state=on]:bg-red-700"
							id={file.file_id}
							pressed={selected}
							onPressedChange={() => onSelect(file.file_id)}>
							<Trash2 className="w-4 h-4 text-red-300" />
						</Toggle>
					</div>
				</div>
			</Card>
		</Suspense>
	)
}
