import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Little delay util.
 * @param ms
 * @returns a custom delay Promise
 */
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms))

/**
 * transform number to a string like 'MB, KB...'
 * @param bytes
 * @param decimals
 * @returns {string}
 */
export const formatBytes = (bytes: number, decimals = 1) => {
	if (!+bytes) return "0 Bytes"

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

/**
 * make a logger
 */
export const logger = (...args: string[]) => {
	console.log(new Date().toLocaleString(), " - ", ...args)
}
