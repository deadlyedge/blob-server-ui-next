import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { MaskProvider } from "@/components/maskProvider"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "pyBlobServer ui",
  description: "born to serve pyBlobServer",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={cn(nunito.className, "antialiased dark")}>
        <MaskProvider />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
