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
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onClick = (fileId: string) => {
    setOpen(false)

    return scrollWidthOffset(document.getElementById(fileId)!)
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
        onClick={() => setOpen(true)}
        className='group/search-bar px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover/search-bar:text-zinc-600 dark:group-hover/search-bar:text-zinc-300 transition'>
          Name Seach
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search Your Events...' />
        <DialogTitle className='hidden' />
        <CommandList>
          <CommandEmpty>没找到结果</CommandEmpty>
          <CommandGroup>
            {files &&
              files.map(({ file_name, file_size, file_id }) => {
                return (
                  <CommandItem key={file_id} onSelect={() => onClick(file_id)}>
                    <File />
                    {file_name}--{formatBytes(file_size)}
                  </CommandItem>
                )
              })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
