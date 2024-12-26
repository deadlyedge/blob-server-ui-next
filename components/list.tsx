"use client"

import { useAppStore } from "@/lib/store" // Import the store
import { useEffect } from "react"
import { toast } from "sonner"
import { DeleteButton } from "./deleteButton"
import { Item } from "./item"

const apiBase = process.env.NEXT_PUBLIC_API_BASE_DOMAIN

export const List = () => {
	const {
		userToken,
		files,
		setFiles,
		selectedFileIds,
		// isLoading,
		onSelect,
		handleDelete,
	} = useAppStore() // Use the store

	useEffect(() => {
		if (selectedFileIds.length > 0) {
			toast.info(`${selectedFileIds.length} file(s) selected.`)
		}
	}, [selectedFileIds.length])

	useEffect(() => {
		setFiles()
	}, [setFiles])

	return (
		<>
			{!userToken && (
				<div className="fixed w-full h-full flex flex-col items-center justify-center">
					<p>
						Please use a valid token. <br />
						If this is the first time you using this app and you are in the list
						of ALLOWED_USERS. <br />
						You should generate your token from:{" "}
					</p>
					<p>http(s)://{apiBase}/user/[your_user_id]</p>
				</div>
			)}
			{/* {isLoading && (
        <div className='fixed w-full h-full z-30 bg-black/50 flex items-center justify-center '>
          Loading...
        </div>
      )} */}
			<div className="flex flex-wrap items-center justify-center sm:justify-start">
				{files ? (
					files.map((file) => (
						<Item
							key={file.file_id}
							file={file}
							selected={selectedFileIds.includes(file.file_id)}
							onSelect={onSelect}
						/>
					))
				) : (
					<p>No files found.</p>
				)}
				{selectedFileIds.length > 0 && (
					<DeleteButton handleDelete={handleDelete} />
				)}
			</div>
		</>
	)
}
