"use client"

import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"
import { checkToken } from "@/actions/check"
import { getUsage } from "@/actions/usage"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { UserUsageType } from "@/types"
import { useRefresh } from "@/components/providers"

// More descriptive type alias
type AuthenticatedUser = {
  user: string
  token: string
}

export default function Home() {
  const cookies = useCookies() // Destructure for clarity
  const { refresh } = useRefresh()
  const [user, setUser] = useState<AuthenticatedUser | null>(null) // More concise name

  const [usage, setUsage] = useState<UserUsageType | null>(null) // More concise name

  // Initialize user state from cookies on mount
  useEffect(() => {
    const initialUser = {
      user: cookies.get("user") as string,
      token: cookies.get("token") as string,
    }
    setUser(initialUser.user && initialUser.token ? initialUser : null)
  }, [cookies])

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
  }, [user, refresh])

  return (
    <main>
      <Header
        user={user}
        usage={usage}
        onAuthentication={handleAuthentication}
      />
      {user ? (
        <List token={user.token} />
      ) : (
        <div className='fixed w-full h-full flex items-center justify-center'>
          Please use a valid token.
        </div>
      )}
    </main>
  )
}
