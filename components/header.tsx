"use client"

import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"
import { Whisper } from "next/font/google"
import { useEffect } from "react"

import { checkAuth } from "@/actions"
import { cookiesStorage, useAppStore } from "@/lib/store"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthenticatedUserType } from "@/types"
import { FileIcon } from "lucide-react"
import { toast } from "sonner"
import { SearchBar } from "./search"
import { Separator } from "./ui/separator"
import { UploadZone } from "./uploadZone"
import { UsageAndSettings } from "./usageAndSettings"

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
		const initialUser: AuthenticatedUserType | null =
			cookiesStorage.getUserTokenCookie()
		if (initialUser) setUserToken(initialUser)
		setUsage() // Adjust this based on your actual usage handling
	}, [setUserToken, setUsage])

	// useEffect(() => {
	// }, [userToken])

	return (
		<nav className="w-full h-20 top-0 flex shrink-0 items-center z-50 bg-zinc-700/80 backdrop-blur-md">
			{/* token section */}
			<div className="p-2 sm:w-80 h-20 flex flex-col items-baseline justify-between border-zinc-500 text-zinc-200">
				{!userToken?.user ? (
					<div className="flex flex-row items-center justify-between w-full">
						<Label htmlFor="token">Your Token</Label>
						<span className="ml-1 text-red-400 text-sm">Need valid token</span>
					</div>
				) : (
					<div className="flex flex-row items-center justify-between w-full">
						<div className="truncate text-green-500 max-w-56 hidden sm:block">
							{userToken.user}
						</div>
						<div className="text-sm flex items-center">
							<FileIcon className="inline w-4 h-4" />
							{files?.length} files
						</div>
					</div>
				)}
				<div className="flex items-center">
					<Input
						id="token"
						onChange={(e) => debouncedOnAuthentication(e.target.value)}
						defaultValue={userToken?.token}
						placeholder="5209cf61-xxxx-xxxx-xxxx-600fe1105a9f"
						className="w-32 sm:w-[300px] font-serif border-zinc-500 border-t-0 border-b-0"
					/>
				</div>
			</div>

			<Separator className="h-8 bg-zinc-500 mr-1" orientation="vertical" />

			{/* upload section */}
			{userToken && (
				<div className="flex flex-row items-center">
					<div className="flex flex-col items-start mr-1">
						<SearchBar />
						<UsageAndSettings />
					</div>
					<UploadZone />
				</div>
			)}

			{/* Title section */}
			<section
				className={cn(whisper.className, "text-gray-100 ml-auto relative")}>
				<div className="h-20 w-36 right-0 top-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 blur z-20" />
				<div className="absolute top-8 right-2 text-[1rem] mr-16 mt-2 -rotate-90 z-30">
					python
				</div>
				<div className="absolute inset-y-0 right-2 z-30">
					<div className="text-[2rem] -mt-1">BlobServer</div>
					<div className="font-serif text-xl -mt-1 float-right">NextUI</div>
				</div>
			</section>
		</nav>
	)
}
