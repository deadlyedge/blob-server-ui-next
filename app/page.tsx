"use client"

import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"
import { checkToken } from "@/actions/check"
import { getUsage } from "@/actions/usage"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { UserUsageType } from "@/types"

// More descriptive type alias
type AuthenticatedUser = {
  user: string
  token: string
}

export default function Home() {
  const cookies = useCookies() // Destructure for clarity
  const [user, setUser] = useState<AuthenticatedUser | null>(null) // More concise name

  const [usage, setUsage] = useState<UserUsageType | null>(null) // More concise name

  // Initialize user state from cookies on mount
  useEffect(() => {
    const initialUser = {
      user: cookies.get("user") as string,
      token: cookies.get("token") as string,
    }
    setUser(initialUser.user && initialUser.token ? initialUser : null)
  }, [])

  const handleAuthentication = async (token: string) => {
    const response = await checkToken(token)
    if (response) {
      setUser(response)
      cookies.set("user", response.user, { path: "/", expires: 31536000 }) // 1 year
      cookies.set("token", response.token, { path: "/", expires: 31536000 }) // 1 year
    } else {
      setUser(null)
      cookies.remove("user", { path: "/" })
      cookies.remove("token", { path: "/" })
    }
  }

  const fetchUsage = async () => {
    if (user?.token) {
      const response = await getUsage(user.token, user.user)
      setUsage(response)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [user])

  return (
    <main>
      <Header
        user={user}
        usage={usage}
        onAuthentication={handleAuthentication}
      />
      <List token={user?.token} />
    </main>
  )
}
