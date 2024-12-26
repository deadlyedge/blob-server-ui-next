import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { MaskProvider } from "@/components/maskProvider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "pyBlobServer ui",
	description: "born to serve pyBlobServer",
	icons: {
		apple: "/apple-touch-icon.png",
		icon: [
			{ rel: "icon", url: "/logo-icon.svg", type: "image/svg" },
			{ rel: "icon", url: "/logo-icon.png", type: "image/png" },
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn(nunito.className, "antialiased dark")}>
				<MaskProvider />
				{children}
				<Toaster />
			</body>
		</html>
	)
}
