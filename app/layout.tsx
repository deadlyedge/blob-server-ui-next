import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "blob server ui",
  description: "born to serve pyBlobServer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cn(nunito.className, "antialiased dark min-h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
