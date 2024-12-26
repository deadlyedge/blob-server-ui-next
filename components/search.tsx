"use client"

import { File, Search } from "lucide-react"
import { useEffect, useState } from "react"

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { formatBytes } from "@/lib/utils"

export const SearchBar = () => {
	const [open, setOpen] = useState(false)
	const { files } = useAppStore()

	useEffect(() => {
		const down = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	const onClick = (fileId: string) => {
		setOpen(false)

		return scrollWidthOffset(document.getElementById(fileId) as HTMLElement)
	}

	const scrollWidthOffset = (element: HTMLElement) => {
		// const menu = document.getElementById('menu')
		window.scrollTo({
			top: element.offsetTop - 360,
			behavior: "smooth",
		})
	}
	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="group/search-bar p-1 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/50 transition">
				<div className="flex items-center text-sm text-zinc-400 group-hover/search-bar:text-zinc-300 transition">
					<Search className="w-4 h-4 ml-1" />
					<p className="font-semibold text-sm ml-2">Name Seach</p>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
						<span className="text-xs">⌘</span>K
					</kbd>
				</div>
			</button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search Your Files..." />
				<DialogTitle className="hidden" />
				<CommandList>
					<CommandEmpty>No Result</CommandEmpty>
					<CommandGroup>
						{files?.map(({ file_name, file_size, file_id }) => {
							return (
								<CommandItem key={file_id} onSelect={() => onClick(file_id)}>
									<div className="grid grid-cols-8 w-full">
										<File className="col-span-1" />
										<span className="col-span-6 truncate">{file_name}</span>
										<span className="col-span-1 text-right">
											{formatBytes(file_size)}
										</span>
									</div>
								</CommandItem>
							)
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
