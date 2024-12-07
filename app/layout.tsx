import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { CookiesProvider } from "next-client-cookies/server"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/components/query-provider"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "blob server ui",
  description: "born to serve pyBlobServer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={cn(nunito.className, "antialiased dark min-h-screen")}>
        <QueryProvider>
          <CookiesProvider>{children}</CookiesProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
